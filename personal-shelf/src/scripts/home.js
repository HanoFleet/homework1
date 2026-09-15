(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("book-list");
    var form = document.getElementById("book-form");
    var filter = document.getElementById("book-filter");
    var currentFilter = "all";

    function renderVisible() {
      var visible = window.ShelfUI.filterBooks(window.BOOKS, currentFilter);
      var emptyText =
        currentFilter === "all" ? "书架还是空的。" : "没有这类书。";
      window.ShelfUI.renderBookList(list, visible, emptyText);
    }

    window.BOOKS = window.ShelfStore.loadBooks(window.BOOKS || []);
    renderVisible();

    window.ShelfUI.bindBookRemove(list, function (bookId) {
      window.BOOKS = window.BOOKS.filter(function (book) {
        return book.id !== bookId;
      });
      window.ShelfStore.saveBooks(window.BOOKS);
      renderVisible();
    });

    window.ShelfUI.bindBookForm(form, function (book) {
      window.BOOKS.unshift(book);
      window.ShelfStore.saveBooks(window.BOOKS);
      renderVisible();
    });

    window.ShelfUI.bindBookFilter(filter, function (status) {
      currentFilter = status;
      renderVisible();
    });
  });
})();
