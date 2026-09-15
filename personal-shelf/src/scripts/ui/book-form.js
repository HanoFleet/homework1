window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.readBookForm = function (form) {
  var data = new FormData(form);
  var title = String(data.get("title") || "").trim();
  var author = String(data.get("author") || "").trim();
  var progress = Number(data.get("progress"));
  var note = String(data.get("note") || "").trim();

  if (!title || !author) {
    return null;
  }

  if (!isFinite(progress)) {
    progress = 0;
  }

  progress = Math.max(0, Math.min(100, progress));

  return {
    id: "book-" + Date.now(),
    title: title,
    author: author,
    progress: progress,
    status: progress >= 100 ? "finished" : "reading",
    note: note,
  };
};

window.ShelfUI.bindBookForm = function (form, onAdd) {
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var book = window.ShelfUI.readBookForm(form);
    if (!book) {
      return;
    }

    onAdd(book);
    form.reset();
  });
};
