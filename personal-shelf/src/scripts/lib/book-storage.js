window.ShelfStore = window.ShelfStore || {};

window.ShelfStore.STORAGE_KEY = "personal-shelf.books.v2";

window.ShelfStore.saveBooks = function (books) {
  var normalized = (books || [])
    .map(window.ShelfModel.normalize)
    .filter(Boolean);

  try {
    window.localStorage.setItem(
      window.ShelfStore.STORAGE_KEY,
      JSON.stringify(normalized)
    );
  } catch (error) {
    return false;
  }

  return true;
};

window.ShelfStore.loadBooks = function (fallback) {
  var seed = (fallback || []).map(window.ShelfModel.normalize).filter(Boolean);

  try {
    var raw = window.localStorage.getItem(window.ShelfStore.STORAGE_KEY);
    if (!raw) {
      window.ShelfStore.saveBooks(seed);
      return seed;
    }

    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      window.ShelfStore.saveBooks(seed);
      return seed;
    }

    var notes = parsed.map(window.ShelfModel.normalize).filter(Boolean);
    if (!notes.length) {
      window.ShelfStore.saveBooks(seed);
      return seed;
    }

    window.ShelfStore.saveBooks(notes);
    return notes;
  } catch (error) {
    return seed;
  }
};
