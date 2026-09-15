window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.exportBooks = function (books) {
  var payload = {
    name: "personal-shelf",
    exportedAt: new Date().toISOString(),
    books: (books || []).map(window.ShelfModel.normalize).filter(Boolean),
  };
  var blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "personal-shelf.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

window.ShelfUI.readImportedBooks = function (text) {
  var parsed = JSON.parse(text);
  var list = Array.isArray(parsed) ? parsed : parsed && parsed.books;
  if (!Array.isArray(list)) {
    throw new Error("bad-format");
  }

  return list.map(window.ShelfModel.normalize).filter(Boolean);
};

window.ShelfUI.mergeBooks = function (current, incoming) {
  var map = {};
  (current || []).forEach(function (book) {
    map[book.id] = book;
  });
  (incoming || []).forEach(function (book) {
    map[book.id] = book;
  });
  return Object.keys(map).map(function (id) {
    return map[id];
  });
};

window.ShelfUI.bindBookIO = function (bar, handlers) {
  if (!bar) {
    return;
  }

  var exportButton = bar.querySelector("[data-io='export']");
  var importInput = bar.querySelector("[data-io='import']");

  if (exportButton) {
    exportButton.addEventListener("click", function () {
      handlers.onExport();
    });
  }

  if (importInput) {
    importInput.addEventListener("change", function () {
      var file = importInput.files && importInput.files[0];
      importInput.value = "";
      if (!file) {
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        try {
          handlers.onImport(window.ShelfUI.readImportedBooks(String(reader.result || "")));
        } catch (error) {
          handlers.onImportError();
        }
      };
      reader.readAsText(file);
    });
  }
};
