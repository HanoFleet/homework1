(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("book-list");
    var form = document.getElementById("book-form");
    var filter = document.getElementById("book-filter");
    var genres = document.getElementById("genre-filter");
    var stats = document.getElementById("book-stats");
    var toolbar = document.getElementById("book-toolbar");
    var io = document.getElementById("book-io");
    var toast = document.getElementById("toast-host");
    var currentFilter = "all";
    var currentGenre = "all";
    var currentQuery = "";
    var currentSort = "updated";
    var flashId = "";
    var lastRemoved = null;

    function toastMessage(message, action) {
      window.ShelfUI.showToast(toast, message, action);
    }

    function persist(books, nextFlash) {
      window.BOOKS = books;
      window.ShelfStore.saveBooks(window.BOOKS);
      flashId = nextFlash || "";
      renderVisible();
    }

    function visibleBooks() {
      var filtered = window.ShelfUI.filterBooks(window.BOOKS, currentFilter);
      var byGenre = window.ShelfQuery.byGenre(filtered, currentGenre);
      var searched = window.ShelfQuery.search(byGenre, currentQuery);
      return window.ShelfQuery.sort(searched, currentSort);
    }

    function emptyMessage() {
      if (currentQuery) {
        return "没有搜到这样的书。";
      }
      if (currentGenre !== "all") {
        return "这个类型下暂时没有书。";
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
      window.ShelfUI.renderGenreFilter(genres, window.BOOKS, currentGenre);
      window.ShelfUI.renderBookList(list, visibleBooks(), {
        emptyText: emptyMessage(),
        flashId: flashId,
      });
    }

    function withHistory(next) {
      var prev = window.ShelfUI.findBook(window.BOOKS, next.id);
      if (!prev) {
        return next;
      }
      return window.ShelfModel.normalize(
        Object.assign({}, prev, next, {
          log: next.log && next.log.length ? next.log : prev.log,
          startedAt: next.startedAt || prev.startedAt,
          addedAt: prev.addedAt,
        })
      );
    }

    window.BOOKS = window.ShelfStore.loadBooks(window.BOOKS || []);
    renderVisible();

    window.ShelfUI.bindBookRemove(list, function (bookId) {
      var book = window.ShelfUI.findBook(window.BOOKS, bookId);
      if (!book) {
        return;
      }
      lastRemoved = book;
      persist(
        window.BOOKS.filter(function (item) {
          return String(item.id) !== String(bookId);
        })
      );
      toastMessage("已拿下《" + book.title + "》", {
        label: "撤销",
        onClick: function () {
          if (!lastRemoved) {
            return;
          }
          persist([lastRemoved].concat(window.BOOKS), lastRemoved.id);
          lastRemoved = null;
        },
      });
    });

    window.ShelfUI.bindBookForm(form, {
      onAdd: function (book) {
        persist([book].concat(window.BOOKS), book.id);
        toastMessage("已上架《" + book.title + "》");
      },
      onSave: function (book) {
        persist(window.ShelfUI.replaceBook(window.BOOKS, withHistory(book)), book.id);
        toastMessage("已保存《" + book.title + "》");
      },
    });

    window.ShelfUI.bindBookFilter(filter, function (status) {
      currentFilter = status;
      renderVisible();
    });

    window.ShelfUI.bindGenreFilter(genres, function (genre) {
      currentGenre = genre;
      renderVisible();
    });

    window.ShelfUI.bindBookToolbar(toolbar, function (state) {
      currentQuery = state.query;
      currentSort = state.sort;
      renderVisible();
    });

    window.ShelfUI.bindBookIO(io, {
      onExport: function () {
        window.ShelfUI.exportBooks(window.BOOKS);
        toastMessage("已导出当前书架");
      },
      onImport: function (incoming) {
        persist(window.ShelfUI.mergeBooks(window.BOOKS, incoming));
        toastMessage("已导入 " + incoming.length + " 本");
      },
      onImportError: function () {
        toastMessage("这份文件读不出来，确认是书架导出的 JSON。");
      },
    });

    window.ShelfUI.bindBookActions(list, {
      onStart: function (bookId) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var next = window.ShelfModel.startReading(book);
        if (!next) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, next), next.id);
        toastMessage("开始读《" + next.title + "》");
      },
      onProgress: function (bookId, progress) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var next = window.ShelfModel.withProgress(book, progress);
        if (!next) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, next), next.id);
        toastMessage("《" + next.title + "》进度 " + next.progress + "%");
      },
      onFinish: function (bookId) {
        var book = window.ShelfUI.findBook(window.BOOKS, bookId);
        var finished = window.ShelfModel.finishReading(book);
        if (!finished) {
          return;
        }
        persist(window.ShelfUI.replaceBook(window.BOOKS, finished), finished.id);
        toastMessage("读完了《" + finished.title + "》");
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
        persist(window.ShelfUI.replaceBook(window.BOOKS, next), next.id);
        toastMessage("《" + next.title + "》打了 " + next.rating + " 星");
      },
    });
  });
})();
