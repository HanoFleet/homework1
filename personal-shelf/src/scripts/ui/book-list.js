window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.renderBookList = function (list, books, options) {
  if (!list) {
    return;
  }

  var settings = options || {};
  var emptyText = settings.emptyText || "书架还是空的。";

  if (!books.length) {
    list.innerHTML =
      '<div class="empty">' +
      "<p>" +
      window.ShelfUI.escapeHtml(emptyText) +
      "</p>" +
      '<p class="empty__hint">换个筛选，或往上架一本新的。</p>' +
      "</div>";
    return;
  }

  list.innerHTML = books
    .map(function (book) {
      return window.ShelfUI.renderBook(book, { flashId: settings.flashId });
    })
    .join("");
};
