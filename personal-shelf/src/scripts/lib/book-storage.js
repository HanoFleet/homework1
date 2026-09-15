window.ShelfStore = window.ShelfStore || {};

window.ShelfStore.STORAGE_KEY = "personal-shelf.books";

window.ShelfStore.saveBooks = function (books) {
  try {
    window.localStorage.setItem(
      window.ShelfStore.STORAGE_KEY,
      JSON.stringify(books || [])
    );
  } catch (error) {
    return false;
  }

  return true;
};

window.ShelfStore.loadBooks = function (fallback) {
  var seed = (fallback || []).slice();

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

    return parsed;
  } catch (error) {
    return seed;
  }
};
