(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("book-list");
    var form = document.getElementById("book-form");

    window.ShelfUI.renderBookList(list, window.BOOKS || []);
    window.ShelfUI.bindBookForm(form, list);
  });
})();
