(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("book-list");
    var form = document.getElementById("book-form");
    var filter = document.getElementById("book-filter");
    var stats = document.getElementById("book-stats");
    var toolbar = document.getElementById("book-toolbar");
    var currentFilter = "all";
    var currentQuery = "";
    var currentSort = "added";

    function persist(books) {
      window.BOOKS = books;
      window.ShelfStore.saveBooks(window.BOOKS);
      renderVisible();
    }

    function visibleBooks() {
      var filtered = window.ShelfUI.filterBooks(window.BOOKS, currentFilter);
      var searched = window.ShelfQuery.search(filtered, currentQuery);
      return window.ShelfQuery.sort(searched, currentSort);
    }

    function emptyMessage() {
      if (currentQuery) {
        return "没有搜到这样的书。";
      }
      if (currentFilter === "queued") {
        return "想读名单还是空的。";
      }
      if (currentFilter === "all") {
        return "书架还是空的。";
      }
      return "没有这类书。";
    }

    function renderVisible() {
      window.ShelfUI.renderBookStats(stats, window.BOOKS);
      window.ShelfUI.updateFilterCounts(filter, window.BOOKS);
      window.ShelfUI.renderBookList(list, visibleBooks(), emptyMessage());
    }

    window.BOOKS = window.ShelfStore.loadBooks(window.BOOKS || []);
    renderVisible();

    window.ShelfUI.bindBookRemove(list, function (bookId) {
      persist(
        window.BOOKS.filter(function (book) {
          return String(book.id) !== String(bookId);
        })
      );
    });

    window.ShelfUI.bindBookForm(form, {
      onAdd: function (book) {
        persist([book].concat(window.BOOKS));
      },
      onSave: function (book) {
        persist(window.ShelfUI.replaceBook(window.BOOKS, book));
      },
    });

    window.ShelfUI.bindBookFilter(filter, function (status) {
      currentFilter = status;
      renderVisible();
    });

    window.ShelfUI.bindBookToolbar(toolbar, function (state) {
      currentQuery = state.query;
      currentSort = state.sort;
      renderVisible();
    });

    window.ShelfUI.bindBookActions(list, {
      onStart: function (bookId) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var next = window.ShelfModel.startReading(book);
        if (!next) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, next));
      },
      onProgress: function (bookId, progress) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var next = window.ShelfModel.withProgress(book, progress);
        if (!next) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, next));
      },
      onFinish: function (bookId) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var finished = window.ShelfModel.finishReading(book);
        if (!finished) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, finished));
        if (!finished.note) {
          window.ShelfUI.fillBookForm(form, finished);
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
      onEdit: function (bookId) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        if (!book) {
          return;
        }
        window.ShelfUI.fillBookForm(form, book);
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      onRate: function (bookId, rating) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var next = window.ShelfModel.withRating(book, rating);
        if (!next) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, next));
      },
    });
  });
})();
