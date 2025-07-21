window.UI = (() => {
  const createButton = (label, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = onClick;
    btn.style.cssText = `
      padding: 10px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      cursor: pointer;
      font-family: sans-serif;
    `;
    return btn;
  };

  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 120px;
      right: 20px;
      background: #333;
      color: #fff;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 14px;
      opacity: 0.95;
      z-index: 10001;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const createResultBox = () => {
    const resultBox = document.createElement("div");
    resultBox.id = "averageResultBox";
    resultBox.style.cssText = `
      position: static;
      z-index: 10000;
      background: #f8f8f8;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 16px;
      font-weight: bold;
      min-width: 200px;
      width: calc(100% - 4px);
      box-sizing: border-box;
      margin: 0 auto;
    `;
    document.body.appendChild(resultBox);
    return resultBox;
  };

  return { createButton, showToast, createResultBox };
})();