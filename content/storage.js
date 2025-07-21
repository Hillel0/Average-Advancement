window.gradeStorage = {
  get: (cb) => chrome.storage.local.get(["savedGrades"], res => cb(res.savedGrades || [])),
  set: (grades, cb) => chrome.storage.local.set({ savedGrades: grades }, cb),
  clear: (cb) => chrome.storage.local.set({ savedGrades: [] }, cb)
};