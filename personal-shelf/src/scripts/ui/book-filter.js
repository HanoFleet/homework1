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
