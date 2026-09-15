window.ShelfQuery = window.ShelfQuery || {};

window.ShelfQuery.search = function (books, query) {
  var list = books || [];
  var needle = String(query || "").trim().toLowerCase();

  if (!needle) {
    return list.slice();
  }

  return list.filter(function (book) {
    var haystack = [book.title, book.author, book.genre]
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(needle) !== -1;
  });
};

window.ShelfQuery.sort = function (books, mode) {
  var list = (books || []).slice();

  if (mode === "title") {
    list.sort(function (a, b) {
      return String(a.title).localeCompare(String(b.title), "zh");
    });
    return list;
  }

  if (mode === "progress") {
    list.sort(function (a, b) {
      var left = a.status === "queued" ? -1 : Number(a.progress) || 0;
      var right = b.status === "queued" ? -1 : Number(b.progress) || 0;
      if (right !== left) {
        return right - left;
      }
      return String(a.title).localeCompare(String(b.title), "zh");
    });
    return list;
  }

  list.sort(function (a, b) {
    return String(b.addedAt || "").localeCompare(String(a.addedAt || ""));
  });
  return list;
};

window.ShelfQuery.counts = function (books) {
  var list = books || [];
  var readingBooks = list.filter(function (book) {
    return book.status === "reading";
  });
  var readingTotal = readingBooks.reduce(function (sum, book) {
    return sum + (Number(book.progress) || 0);
  }, 0);

  return {
    all: list.length,
    queued: list.filter(function (book) {
      return book.status === "queued";
    }).length,
    reading: readingBooks.length,
    finished: list.filter(function (book) {
      return book.status === "finished";
    }).length,
    readingAvg: readingBooks.length
      ? Math.round(readingTotal / readingBooks.length)
      : 0,
  };
};
