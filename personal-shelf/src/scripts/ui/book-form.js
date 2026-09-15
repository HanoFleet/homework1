window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.readBookForm = function (form) {
  var data = new FormData(form);
  var title = String(data.get("title") || "").trim();
  var author = String(data.get("author") || "").trim();
  var progress = Number(data.get("progress"));
  var status = String(data.get("status") || "");
  var note = String(data.get("note") || "").trim();

  if (!title || !author) {
    return null;
  }

  if (!isFinite(progress)) {
    progress = 0;
  }

  progress = Math.max(0, Math.min(100, progress));

  if (status !== "queued" && status !== "reading" && status !== "finished") {
    status = "reading";
  }

  return {
    id: "book-" + Date.now(),
    title: title,
    author: author,
    progress: progress,
    status: status,
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
