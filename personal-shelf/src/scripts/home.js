(function () {
  var STATUS_LABEL = {
    reading: "在读",
    finished: "读完",
    queued: "想读",
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBook(book) {
    var percent = Math.max(0, Math.min(100, Number(book.progress) || 0));
    var status = STATUS_LABEL[book.status] || "在读";

    return (
      '<article class="book-card">' +
      '<p class="book-card__status">' +
      escapeHtml(status) +
      "</p>" +
      '<h2 class="book-card__title">' +
      escapeHtml(book.title) +
      "</h2>" +
      '<p class="book-card__author">' +
      escapeHtml(book.author) +
      "</p>" +
      '<div class="book-card__progress" aria-label="阅读进度 ' +
      percent +
      '%">' +
      '<div class="book-card__bar">' +
      '<span class="book-card__fill" style="width: ' +
      percent +
      '%"></span>' +
      "</div>" +
      '<span class="book-card__percent">' +
      percent +
      "%</span>" +
      "</div>" +
      (book.note
        ? '<p class="book-card__note">' + escapeHtml(book.note) + "</p>"
        : "") +
      "</article>"
    );
  }

  function renderHome() {
    var list = document.getElementById("book-list");
    var books = window.BOOKS || [];

    if (!list) {
      return;
    }

    if (!books.length) {
      list.innerHTML = '<p class="empty">书架还是空的。</p>';
      return;
    }

    list.innerHTML = books.map(renderBook).join("");
  }

  document.addEventListener("DOMContentLoaded", renderHome);
})();
