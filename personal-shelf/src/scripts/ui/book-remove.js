window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.renderRemoveButton = function (book) {
  var escapeHtml = window.ShelfUI.escapeHtml;
  var id = book && book.id != null ? String(book.id) : "";
  var title = book && book.title ? String(book.title) : "这本书";

  if (!id) {
    return "";
  }

  return (
    '<button type="button" class="book-remove" data-book-id="' +
    escapeHtml(id) +
    '" aria-label="删除《' +
    escapeHtml(title) +
    '》">删除</button>'
  );
};

window.ShelfUI.bindBookRemove = function (list, onRemove) {
  if (!list) {
    return;
  }

  list.addEventListener("click", function (event) {
    var button = event.target.closest(".book-remove[data-book-id]");
    if (!button || !list.contains(button)) {
      return;
    }

    var title = (button.getAttribute("aria-label") || "这本书").replace(/^删除/, "");
    if (!window.confirm("把" + title + "从书架拿下来？")) {
      return;
    }

    onRemove(button.getAttribute("data-book-id"));
  });
};
