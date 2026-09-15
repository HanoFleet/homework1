(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("book-list");
    var form = document.getElementById("book-form");

    window.BOOKS = window.ShelfStore.loadBooks(window.BOOKS || []);
    window.ShelfUI.renderBookList(list, window.BOOKS);

    window.ShelfUI.bindBookForm(form, function (book) {
      window.BOOKS.unshift(book);
      window.ShelfStore.saveBooks(window.BOOKS);
      window.ShelfUI.renderBookList(list, window.BOOKS);
    });
  });
})();
