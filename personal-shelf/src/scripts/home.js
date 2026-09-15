(function () {
  function renderHome() {
    window.ShelfUI.renderBookList(
      document.getElementById("book-list"),
      window.BOOKS || []
    );
  }

  document.addEventListener("DOMContentLoaded", renderHome);
})();
