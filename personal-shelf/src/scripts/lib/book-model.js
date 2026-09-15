window.ShelfModel = window.ShelfModel || {};

window.ShelfModel.STATUSES = ["queued", "reading", "finished"];
window.ShelfModel.PRIORITIES = ["later", "normal", "soon"];

window.ShelfModel.createId = function () {
  return "book-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
};

window.ShelfModel.now = function () {
  return new Date().toISOString();
};

window.ShelfModel.clampProgress = function (value) {
  var progress = Number(value);
  if (!isFinite(progress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(progress)));
};

window.ShelfModel.clampPage = function (value) {
  var page = Number(value);
  if (!isFinite(page) || page <= 0) {
    return null;
  }
  return Math.round(page);
};

window.ShelfModel.normalizeLog = function (raw, progress) {
  var log = Array.isArray(raw) ? raw : [];
  var cleaned = log
    .map(function (item) {
      if (!item || typeof item !== "object") {
        return null;
      }
      var at = String(item.at || "").trim();
      var value = window.ShelfModel.clampProgress(item.progress);
      if (!at) {
        return null;
      }
      return { at: at, progress: value };
    })
    .filter(Boolean)
    .slice(-6);

  if (progress != null && (!cleaned.length || cleaned[cleaned.length - 1].progress !== progress)) {
    cleaned.push({ at: window.ShelfModel.now(), progress: progress });
    cleaned = cleaned.slice(-6);
  }

  return cleaned;
};

window.ShelfModel.progressFromPages = function (pageNow, pageTotal) {
  if (!pageNow || !pageTotal) {
    return null;
  }
  return window.ShelfModel.clampProgress((pageNow / pageTotal) * 100);
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

  var priority = String(raw.priority || "normal");
  if (window.ShelfModel.PRIORITIES.indexOf(priority) === -1) {
    priority = "normal";
  }

  var pageNow = window.ShelfModel.clampPage(raw.pageNow);
  var pageTotal = window.ShelfModel.clampPage(raw.pageTotal);
  if (pageNow && pageTotal && pageNow > pageTotal) {
    pageNow = pageTotal;
  }

  var book = {
    id: String(raw.id || window.ShelfModel.createId()),
    title: title,
    author: author,
    genre: String(raw.genre || "").trim(),
    status: status,
    priority: priority,
    addedAt: String(raw.addedAt || "").trim() || window.ShelfModel.now(),
    updatedAt: String(raw.updatedAt || raw.addedAt || "").trim() || window.ShelfModel.now(),
    startedAt: String(raw.startedAt || "").trim(),
    finishedAt: String(raw.finishedAt || "").trim(),
  };

  if (status === "queued") {
    book.progress = null;
    book.note = "";
    book.rating = 0;
    book.pageNow = null;
    book.pageTotal = null;
    book.log = [];
    book.startedAt = "";
    book.finishedAt = "";
    return book;
  }

  var progress = window.ShelfModel.progressFromPages(pageNow, pageTotal);
  if (progress == null) {
    progress = window.ShelfModel.clampProgress(raw.progress);
  }

  if (status === "finished" || progress >= 100) {
    book.status = "finished";
    book.progress = 100;
    book.note = String(raw.note || "").trim();
    book.rating = rating;
    book.pageNow = pageTotal;
    book.pageTotal = pageTotal;
    book.log = window.ShelfModel.normalizeLog(raw.log, 100);
    book.startedAt = book.startedAt || book.addedAt;
    book.finishedAt = book.finishedAt || book.updatedAt;
    return book;
  }

  book.progress = Math.min(99, progress);
  book.note = String(raw.note || "").trim();
  book.rating = 0;
  book.pageNow = pageNow;
  book.pageTotal = pageTotal;
  book.log = window.ShelfModel.normalizeLog(raw.log);
  book.startedAt = book.startedAt || book.addedAt;
  book.finishedAt = "";
  return book;
};

window.ShelfModel.touch = function (book, extra) {
  return window.ShelfModel.normalize(
    Object.assign({}, book, extra, { updatedAt: window.ShelfModel.now() })
  );
};

window.ShelfModel.startReading = function (book) {
  return window.ShelfModel.touch(book, {
    status: "reading",
    progress: 0,
    note: "",
    rating: 0,
    pageNow: null,
    startedAt: window.ShelfModel.now(),
    log: [{ at: window.ShelfModel.now(), progress: 0 }],
  });
};

window.ShelfModel.finishReading = function (book) {
  return window.ShelfModel.touch(book, {
    status: "finished",
    progress: 100,
    pageNow: book && book.pageTotal ? book.pageTotal : book.pageNow,
    finishedAt: window.ShelfModel.now(),
    log: window.ShelfModel.normalizeLog(book && book.log, 100),
  });
};

window.ShelfModel.withProgress = function (book, progress) {
  var nextProgress = window.ShelfModel.clampProgress(progress);
  var pageNow = book.pageNow;
  if (book.pageTotal) {
    pageNow = Math.max(1, Math.round((book.pageTotal * nextProgress) / 100));
  }

  return window.ShelfModel.touch(book, {
    status: "reading",
    progress: nextProgress,
    pageNow: pageNow,
    log: window.ShelfModel.normalizeLog(book.log, nextProgress),
  });
};

window.ShelfModel.withRating = function (book, rating) {
  return window.ShelfModel.touch(book, {
    status: "finished",
    rating: rating,
  });
};
