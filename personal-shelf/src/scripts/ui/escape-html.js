window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.escapeHtml = function (text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};
