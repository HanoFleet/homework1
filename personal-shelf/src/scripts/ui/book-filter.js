window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.filterBooks = function (books, status) {
  var list = books || [];

  if (!status || status === "all") {
    return list.slice();
  }

  return list.filter(function (book) {
    return book.status === status;
  });
};

window.ShelfUI.updateFilterCounts = function (nav, books) {
  if (!nav) {
    return;
  }

  var counts = window.ShelfQuery.counts(books);
  var labels = {
    all: "全部",
    queued: "想读",
    reading: "在读",
    finished: "读完",
  };

  Array.prototype.forEach.call(nav.querySelectorAll("[data-status]"), function (button) {
    var key = button.getAttribute("data-status");
    var count = counts[key];
    if (count == null) {
      return;
    }
    button.textContent = labels[key] + " " + count;
  });
};

window.ShelfUI.renderGenreFilter = function (nav, books, current) {
  if (!nav) {
    return;
  }

  var genres = window.ShelfQuery.genres(books);
  var html =
    '<button type="button" class="book-filter__btn' +
    (current === "all" ? " is-active" : "") +
    '" data-genre="all" aria-pressed="' +
    (current === "all" ? "true" : "false") +
    '">全部类型</button>';

  html += genres
    .map(function (genre) {
      var on = current === genre;
      return (
        '<button type="button" class="book-filter__btn' +
        (on ? " is-active" : "") +
        '" data-genre="' +
        window.ShelfUI.escapeHtml(genre) +
        '" aria-pressed="' +
        (on ? "true" : "false") +
        '">' +
        window.ShelfUI.escapeHtml(genre) +
        "</button>"
      );
    })
    .join("");

  nav.innerHTML = html;
};

window.ShelfUI.bindBookFilter = function (nav, onChange) {
  if (!nav) {
    return;
  }

  nav.addEventListener("click", function (event) {
    var button = event.target.closest("[data-status]");
    if (!button || !nav.contains(button)) {
      return;
    }

    var status = button.getAttribute("data-status");
    var buttons = nav.querySelectorAll("[data-status]");

    Array.prototype.forEach.call(buttons, function (item) {
      var active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });

    onChange(status);
  });
};

window.ShelfUI.bindGenreFilter = function (nav, onChange) {
  if (!nav) {
    return;
  }

  nav.addEventListener("click", function (event) {
    var button = event.target.closest("[data-genre]");
    if (!button || !nav.contains(button)) {
      return;
    }
    onChange(button.getAttribute("data-genre"));
  });
};
