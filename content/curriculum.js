// Curriculum structure for the degree, based on the provided tables

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

export default curriculum; 