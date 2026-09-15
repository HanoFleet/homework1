window.ShelfModel = window.ShelfModel || {};

window.ShelfModel.STATUSES = ["queued", "reading", "finished"];

window.ShelfModel.createId = function () {
  return "book-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
};

window.ShelfModel.clampProgress = function (value) {
  var progress = Number(value);
  if (!isFinite(progress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(progress)));
};

window.ShelfModel.normalize = function (raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  var title = String(raw.title || "").trim();
  var author = String(raw.author || "").trim();
  if (!title || !author) {
    return null;
  }

  var status = String(raw.status || "");
  if (window.ShelfModel.STATUSES.indexOf(status) === -1) {
    status = window.ShelfModel.clampProgress(raw.progress) >= 100 ? "finished" : "reading";
  }

  var rating = Number(raw.rating);
  if (!isFinite(rating)) {
    rating = 0;
  }
  rating = Math.max(0, Math.min(5, Math.round(rating)));

  var book = {
    id: String(raw.id || window.ShelfModel.createId()),
    title: title,
    author: author,
    genre: String(raw.genre || "").trim(),
    status: status,
    addedAt: String(raw.addedAt || "").trim() || new Date().toISOString(),
  };

  if (status === "queued") {
    book.progress = null;
    book.note = "";
    book.rating = 0;
    return book;
  }

  if (status === "finished") {
    book.progress = 100;
    book.note = String(raw.note || "").trim();
    book.rating = rating;
    return book;
  }

  var progress = window.ShelfModel.clampProgress(raw.progress);
  if (progress >= 100) {
    book.status = "finished";
    book.progress = 100;
    book.note = String(raw.note || "").trim();
    book.rating = rating;
    return book;
  }

  book.progress = progress;
  book.note = String(raw.note || "").trim();
  book.rating = 0;
  return book;
};

window.ShelfModel.startReading = function (book) {
  return window.ShelfModel.normalize(
    Object.assign({}, book, {
      status: "reading",
      progress: 0,
      note: "",
      rating: 0,
    })
  );
};

window.ShelfModel.finishReading = function (book) {
  return window.ShelfModel.normalize(
    Object.assign({}, book, {
      status: "finished",
      progress: 100,
    })
  );
};

window.ShelfModel.withProgress = function (book, progress) {
  return window.ShelfModel.normalize(
    Object.assign({}, book, {
      status: "reading",
      progress: progress,
    })
  );
};

window.ShelfModel.withRating = function (book, rating) {
  return window.ShelfModel.normalize(
    Object.assign({}, book, {
      status: "finished",
      rating: rating,
    })
  );
};
