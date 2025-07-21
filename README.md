# 📊 Relative Average Calculator - Bar-Ilan Inbar Extension

A Chrome/Brave extension that helps Bar-Ilan University students easily track and calculate their **relative course average**, **credit progress**, and **degree requirements**, directly from the Inbar grades page.

---

## ✨ Features

- ✅ **Checkbox selection** of graded courses from the Inbar student portal
- 💾 **Save grades locally** to Chrome storage — persist across visits
- 📈 **Calculate weighted average** based on selected courses and credit points
- 🧮 **Track academic progress** across:
  - שנה א חובה
  - שנה ב חובה
  - אשכולות בחירה
  - אשכול השלמה
- 📉 **Collapsible UI panels** for a clean experience (left + right)
- ➕ **Manual course entry support** (for courses not yet graded)
- ❌ **Remove specific saved courses**
- 🧪 Automatically excludes **קורסים כמו חזית המחקר במדעי המחשב** by default, because it isn't included in credit counting

---

## 🔧 Technologies & Tools

- 🔍 **Chrome Extension API (Manifest v3)**
- 🧩 **Plain JavaScript**
- 📦 **Modular architecture** using:
  - `content.js` - DOM injection & main logic
  - `storage.js` - local storage wrapper
  - `average.js` - weighted average calculations
  - `curriculum.js` - degree credit requirements
  - `ui.js` - modular UI component builder

---

## 🚀 Installation Instructions

1. Clone or download the project folder
2. Go to `chrome://extensions` (or `brave://extensions`😉)
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the project folder
6. Go to your Inbar grades page - the extension will activate automatically

---

## 💡 What Problem Does It Solve?

Bar-Ilan students currently have to manually track:
- Which courses they’ve completed
- Which degree requirements are still missing
- Their weighted average - often requiring manual exclusion of:
  - Non-CS courses
  - Failed grades that don't affect the final average

💥 This extension automates the process - saving time, reducing mistakes, and providing **instant visibility** over degree progress.

---

## 🧠 Credits & Acknowledgments

- Developed by Hillel Rosenthal
- Powered by user feedback, Bar-Ilan curriculum and lots of coffee ☕
