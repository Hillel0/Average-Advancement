(function () {
  if (document.getElementById("relative-average-ui")) return;

  function normalize(str) {
  return str
    ?.trim()
    .replace(/\s+/g, " ")                     // collapse multiple spaces
    .replace(/[\u200E\u200F\u202A-\u202E]/g, "") // remove RTL/LTR control characters
    .replace(/[״"׳']/g, "")                   // remove quotes
    .normalize("NFKC");                       // Unicode normalization
  }


  // ✅ Inject checkboxes into course rows
  const rows = Array.from(document.querySelectorAll("tr.GridRow"));
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 8) return;

    const gradeText = cells[6].innerText.trim();
    const creditText = cells[5].innerText.trim();
    const isFailed = gradeText === "נכשל";
    const isNumeric = /^\d+$/.test(gradeText) || /^\d+$/.test(creditText);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !isFailed && isNumeric;

    const td = document.createElement("td");
    td.appendChild(checkbox);
    row.insertBefore(td, row.firstChild);
  });

  const wrapper = document.createElement("div");
  wrapper.id = "relative-average-ui";
  wrapper.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: sans-serif;
  `;

  const resultBox = UI.createResultBox();

  const courseListDiv = document.createElement("div");
  courseListDiv.style.cssText = `
    max-height: 300px;
    min-width: 200px;
    max-width: 90vw;
    width: fit-content;
    white-space: nowrap;
    overflow-y: auto;
    background: white;
    border: 2px solid #007bff;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 10px;
  `;

  // Add after resultBox is created
  const progressBox = document.createElement("div");
  progressBox.id = "creditProgressBox";
  progressBox.style.cssText = `
    background: #f8f8f8;
    border: 2px solid #28a745;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 15px;
    min-width: 220px;
    margin-bottom: 20px;
  `;
  resultBox.insertAdjacentElement('afterend', progressBox);

  function updateAverageBox() {
    gradeStorage.get((grades) => {
      
      console.log("📊 Updating average with:", grades);
      
      renderAverage(grades);
      renderCourseList(grades);
      renderCreditProgress(grades);
    });
  }

  function renderAverage(grades) {
    const avg = calcAverage(grades);
    resultBox.textContent = avg
      ? `ממוצע נוכחי: ${avg} (${grades.length} קורסים)`
      : "אין ציונים שמורים עדיין";
  }

  function renderCourseList(grades) {
    courseListDiv.innerHTML = "";

    grades.forEach((course) => {
      const row = document.createElement("div");
      row.style.marginBottom = "4px";

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌ הסר";
      delBtn.style.cssText = `
        margin-left: 10px;
        padding: 2px 8px;
        font-size: 12px;
        cursor: pointer;
      `;
      delBtn.onclick = () => {
        gradeStorage.get(saved => {
          const filtered = saved.filter(c => c.groupId !== course.groupId);
          gradeStorage.set(filtered, updateAverageBox);
        });
      };

      const textSpan = document.createElement("span");
      textSpan.textContent = `${course.courseName || course.groupId} – ציון: ${course.grade}, נ\"ז: ${course.credits}`;

      row.appendChild(delBtn);
      row.appendChild(textSpan);
      courseListDiv.appendChild(row);
    });
  }

  function renderCreditProgress(grades) {
    const progress = calculateCreditProgress(grades);
    let html = `<b>התקדמות נ"ז:</b><br>`;
    html += `<ul style='padding-right: 18px;'>`;
    progress.groupProgress.forEach(g => {
      html += `<li><b>${g.name}:</b> ${g.completed} / ${g.required} (נותר: ${g.left})</li>`;
    });
    html += `</ul>`;
    html += `<b>סה"כ נדרש:</b> ${progress.totalCompleted} / ${progress.groupProgress.reduce((a, g) => a + g.required, 0)} (נותר: ${progress.totalLeft})`;
    progressBox.innerHTML = html;
  }

  // Save button
  const saveBtn = UI.createButton("💾 שמור ציונים", () => {
    gradeStorage.get(saved => {
      const realCourses = [];
      const placeholders = [];
      const groupIdSet = new Set();
      const normalizedNameToPlaceholder = {};

      // First pass: separate real courses and placeholders
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const checkbox = row.querySelector("input[type='checkbox']");
        if (!checkbox || !checkbox.checked) return;

        const groupId = cells[1]?.innerText.trim();
        const creditText = cells[5]?.innerText.trim();
        const gradeText = cells[7]?.innerText.trim();
        const courseName = cells[2]?.innerText.trim();
        const normalizedName = normalize(courseName);

        if (!groupId || gradeText === "נכשל" || gradeText === "עובר") return;

        const grade = parseFloat(gradeText);
        const credits = parseFloat(creditText);

        if (isNaN(grade)) {
          if (isNaN(credits)) return;
          // Store placeholder by normalized name
          placeholders.push({
            groupId,
            grade: NaN,
            credits,
            courseName,
            normalizedCourseName: normalizedName,
            _mergedCredits: false
          });
          normalizedNameToPlaceholder[normalizedName] = placeholders[placeholders.length - 1];
          return;
        }

        // Real course
        realCourses.push({ groupId, grade, credits, courseName, normalizedCourseName: normalizedName, _mergedCredits: false });
        groupIdSet.add(groupId);
      });

      // Second pass: merge placeholders with real courses if matching normalized name
      realCourses.forEach(course => {
        const placeholder = normalizedNameToPlaceholder[course.normalizedCourseName];
        if (placeholder) {
          // Merge credits if not already merged
          if (!placeholder._mergedCredits) {
            course.credits += placeholder.credits;
            course._mergedCredits = true;
          }
          // Remove the placeholder from the list
          delete normalizedNameToPlaceholder[course.normalizedCourseName];
        }
      });

      // Add any saved courses that are not already present by groupId
      const updatedSaved = saved.filter(c => !groupIdSet.has(c.groupId) && !isNaN(c.grade));

      // Only keep real courses (with a grade)
      const finalList = updatedSaved.concat(realCourses);
      gradeStorage.set(finalList, updateAverageBox);
    });
  });

  // Clear button
  const clearBtn = UI.createButton("🗑 נקה ציונים", () => {
    gradeStorage.clear(updateAverageBox);
  });

  // Manual entry UI
  const manualDiv = document.createElement("div");
  manualDiv.style.cssText = "display: flex; gap: 6px; flex-wrap: wrap; align-items: center;";

  const gidInput = document.createElement("input");
  gidInput.placeholder = "שם / קוד";
  const gradeInput = document.createElement("input");
  gradeInput.placeholder = "ציון";
  const creditInput = document.createElement("input");
  creditInput.placeholder = "נ\"ז";

  [gidInput, gradeInput, creditInput].forEach(input => {
    input.type = "text";
    input.style.cssText = "padding: 5px; border: 1px solid #ccc; border-radius: 4px; width: 80px;";
  });

  const addManualBtn = UI.createButton("➕ הוסף ידנית", () => {
    const groupId = gidInput.value.trim();
    const grade = parseFloat(gradeInput.value.trim());
    const credits = parseFloat(creditInput.value.trim());

    if (!groupId || isNaN(grade) || isNaN(credits)) {
      alert("אנא מלא מספר קבוצה, ציון ונ\"ז חוקיים.");
      return;
    }

    gradeStorage.get(saved => {
      const exists = saved.some(c => c.groupId === groupId);
      if (exists) {
        alert("קורס עם מספר קבוצה זה כבר קיים.");
        return;
      }
      saved.push({ groupId, grade, credits });
      gradeStorage.set(saved, () => {
        gidInput.value = "";
        gradeInput.value = "";
        creditInput.value = "";
        updateAverageBox();
      });
    });
  });

  manualDiv.append(gidInput, gradeInput, creditInput, addManualBtn);

  wrapper.appendChild(saveBtn);
  wrapper.appendChild(clearBtn);
  wrapper.appendChild(manualDiv);
  wrapper.appendChild(resultBox);
  wrapper.appendChild(courseListDiv);
  wrapper.appendChild(progressBox);
  document.body.appendChild(wrapper);

  updateAverageBox();
})();

// ---- BEGIN: Curriculum and Credit Progress Calculation ----

const curriculum = {
  totalRequired: 129,
  groups: [
    {
      name: "שנה א' חובה", // Year 1 Required
      requiredCredits: 48,
      courses: [
        { code: "89-110", name: "מבוא למדעי המחשב", credits: 5 },
        { code: "89-1111", name: "מבוא לתכנות מונחה עצמים", credits: 5 },
        { code: "89-112", name: "אלגברה ליניארית 1", credits: 5 },
        { code: "89-113", name: "אלגברה ליניארית 2", credits: 5 },
        { code: "89-132", name: "חשבון אינפיניטסימלי 1", credits: 5 },
        { code: "89-133", name: "חשבון אינפיניטסימלי 2", credits: 5 },
        { code: "89-195", name: "מתמטיקה בדידה", credits: 4 },
        { code: "89-1200", name: "מבני נתונים", credits: 4 },
        { code: "89-1262", name: "הסתברות", credits: 5 },
      ]
    },
    {
      name: "שנה ב' חובה", // Year 2 Required
      requiredCredits: 36,
      courses: [
        { code: "89-230", name: "מבנה מחשב", credits: 4 },
        { code: "89-231", name: "מערכות הפעלה", credits: 4 },
        { code: "89-263", name: "שיטות סטטיסטיות במדעי המחשב", credits: 3 },
        { code: "89-2197", name: "מבנים בדידים", credits: 3 },
        { code: "89-220", name: "אלגוריתמים 1", credits: 4 },
        { code: "89-2322", name: "אלגוריתמים מתקדמים", credits: 3 },
        { code: "89-2226", name: "חישוביות וסיבוכיות", credits: 3 },
        { code: "89-213", name: "מודלים חישוביים", credits: 3 },
        { code: "89-2511", name: "למידת מכונה", credits: 3 },
        { code: "89-333", name: "חזית המחקר במדעי המחשב", credits: 3 },
      ]
    },
    {
      name: "שנה ג' חובה", // Year 3 Required
      requiredCredits: 10,
      courses: [
        { code: "89-2322", name: "אלגוריתמים מתקדמים", credits: 3 },
        { code: "89-385", name: "סדנה לפרויקטים", credits: 3 },
        { code: "89-4XX", name: "סמינריון במדעי המחשב", credits: 4 }, // Placeholder for seminar
      ]
    },
    {
      name: "אשכול 1 - קורסי תכנות מתקדמים", // Cluster 1 - Advanced Programming
      requiredCredits: 9, // Must take at least 3 courses
      courses: [
        { code: "89-3311", name: "שפת תכנות", credits: 3 },
        { code: "89-3210", name: "תכנות מערכות מתקדם", credits: 3 },
        { code: "89-556", name: "תכנות מערכות מקביליות", credits: 3 },
        { code: "89-5581", name: "מערכות מסדי נתונים", credits: 3 },
      ]
    },
    {
      name: "אשכול 2 - בחירה חופשית", // Cluster 2 - Free Choice
      requiredCredits: 6, // Must take at least 2 courses
      courses: [
        { code: "89-5509", name: "מבוא לסייבר: מבוא בטוח ואבטחת תקשורת", credits: 3 },
        { code: "89-5570", name: "בינה מלאכותית", credits: 3 },
        { code: "89-5562", name: "מבוא לקריפטוגרפיה", credits: 3 },
      ]
    },
    {
      name: "אשכול השלמה", // Supplementary Cluster
      requiredCredits: 10,
      courses: [
        { code: "89-200", name: "לוגיקה מתמטית", credits: 2 },
        { code: "89-214", name: "מבנים אלגבריים", credits: 2 },
        { code: "89-256", name: "תורת המספרים", credits: 2 },
        { code: "89-3226", name: "סדנה מעשית באינטראקציית אדם-רובוט", credits: 2 },
        { code: "89-3592", name: "יסודות בממשק משתמש", credits: 2 },
        { code: "89-518", name: "גיאומטריה חישובית", credits: 2 },
        { code: "89-521", name: "אלגוריתמים ביו-אינטליגנטיים", credits: 2 },
        { code: "89-5222", name: "שיטות מתמטיות במדע הנתונים", credits: 2 },
        { code: "89-5223", name: "בינה מלאכותית ותכנון במערכות אוטונומיות", credits: 2 },
        { code: "89-5224", name: "Deep Learning in Computational Biology", credits: 2 },
        { code: "89-5227", name: "אלגוריתמים תת-לינאריים בזמן ובמקום", credits: 2 },
        { code: "89-5229", name: "אפיון התנהגות אנושית מנתוני אינטרנט", credits: 2 },
        { code: "89-5350", name: "מבוא לרשתות תקשורת", credits: 2 },
        { code: "89-5441", name: "ניהול נתוני עתק ברשת", credits: 2 },
        { code: "89-5456", name: "הסקה אוטומטית ושימושיה", credits: 2 },
        { code: "89-546", name: "מדעי נתונים טבלאיים", credits: 2 },
        { code: "89-550", name: "אבטחת תקשורת", credits: 2 },
        { code: "89-553", name: "קריפטואנליזה", credits: 2 },
        { code: "89-5555", name: "אלגוריתמים וסיבוכיות מעודנת", credits: 2 },
        { code: "89-560", name: "עיבוד תמונה", credits: 2 },
        { code: "89-561", name: "ראיה ממוחשבת", credits: 2 },
        { code: "89-575", name: "שיטות לאימות תוכנה", credits: 2 },
        { code: "89-5993", name: "קורס מחקר מתקדם באלגוריתמיקה 1", credits: 2 },
        { code: "89-602", name: "אוטומטים, משחקים, ואימות פורמלי", credits: 2 },
        { code: "89-6561", name: "מערכות הוכחה קריפטוגרפיות", credits: 2 },
        { code: "89-669", name: "סדנה ברובוטיקה", credits: 2 },
        { code: "89-679", name: "סדנה במסדי נתונים", credits: 2 },
        { code: "89-680", name: "עיבוד שפות טבעיות", credits: 2 },
        { code: "89-685", name: "מבוא לרובוטיקה", credits: 2 },
        { code: "89-6876", name: "שיטות דיפ–לרנינג לטקסטים ורצפים", credits: 2 },
      ]
    }
  ]
};

function calculateCreditProgress(grades) {
  // Build a map of completed course codes to their credits
  const completed = {};
  let totalCompleted = 0;
  grades.forEach(g => {
    if (!isNaN(g.grade) && g.grade >= 60 && g.groupId) { // Only passing grades
      completed[g.groupId] = g.credits;
      totalCompleted += g.credits;
    }
  });

  // For each group, sum completed credits
  const groupProgress = curriculum.groups.map(group => {
    let completedCredits = 0;
    group.courses.forEach(course => {
      if (completed[course.code]) {
        completedCredits += course.credits;
      }
    });
    return {
      name: group.name,
      required: group.requiredCredits,
      completed: completedCredits,
      left: Math.max(0, group.requiredCredits - completedCredits)
    };
  });

  // Total required
  const totalRequired = curriculum.totalRequired;
  const totalLeft = Math.max(0, totalRequired - totalCompleted);

  return {
    totalCompleted,
    totalLeft,
    groupProgress
  };
}
// ---- END: Curriculum and Credit Progress Calculation ----
