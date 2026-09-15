window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.renderBookList = function (list, books) {
  if (!list) {
    return;
  }

  if (!books.length) {
    list.innerHTML = '<p class="empty">书架还是空的。</p>';
    return;
  }

  list.innerHTML = books.map(window.ShelfUI.renderBook).join("");
};
