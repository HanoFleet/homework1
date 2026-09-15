window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.findBook = function (books, bookId) {
  var id = String(bookId || "");
  var index = 0;

  for (index = 0; index < books.length; index += 1) {
    if (String(books[index].id) === id) {
      return books[index];
    }
  }

  return null;
};

window.ShelfUI.replaceBook = function (books, next) {
  return (books || []).map(function (book) {
    return String(book.id) === String(next.id) ? next : book;
  });
};

window.ShelfUI.bindBookActions = function (list, handlers) {
  if (!list) {
    return;
  }

  list.addEventListener("input", function (event) {
    var range = event.target.closest(".book-card__range");
    if (!range || !list.contains(range)) {
      return;
    }

    var label = range
      .closest(".book-card__progress")
      .querySelector(".book-card__progress-label");
    var fill = range.closest(".book-card__progress").querySelector(".book-card__fill");
    var value = window.ShelfModel.clampProgress(range.value);

    if (label) {
      label.textContent = "进度 " + value + "%";
    }
    if (fill) {
      fill.style.width = value + "%";
    }
  });

  list.addEventListener("click", function (event) {
    var button = event.target.closest("[data-action][data-book-id]");
    if (!button || !list.contains(button)) {
      return;
    }

    var action = button.getAttribute("data-action");
    var bookId = button.getAttribute("data-book-id");
    var card = button.closest(".book-card");
    var range = card ? card.querySelector(".book-card__range") : null;

    if (action === "start") {
      handlers.onStart(bookId);
      return;
    }

    if (action === "save-progress" && range) {
      handlers.onProgress(bookId, range.value);
      return;
    }

    if (action === "finish") {
      handlers.onFinish(bookId);
      return;
    }

    if (action === "edit") {
      handlers.onEdit(bookId);
      return;
    }

    if (action === "rate") {
      handlers.onRate(bookId, button.getAttribute("data-rating"));
    }
  });
};
