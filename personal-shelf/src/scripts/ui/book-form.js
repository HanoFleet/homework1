window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.syncBookFormFields = function (form) {
  if (!form) {
    return;
  }

  var status = String(form.status.value || "reading");
  var progressField = form.querySelector('[data-field="progress"]');
  var pagesField = form.querySelector('[data-field="pages"]');
  var noteField = form.querySelector('[data-field="note"]');
  var ratingField = form.querySelector('[data-field="rating"]');
  var priorityField = form.querySelector('[data-field="priority"]');
  var hint = form.querySelector("[data-form-hint]");
  var progressInput = form.elements.progress;
  var noteInput = form.elements.note;
  var ratingInput = form.elements.rating;
  var queued = status === "queued";
  var finished = status === "finished";

  if (progressField) {
    progressField.hidden = queued;
  }
  if (pagesField) {
    pagesField.hidden = queued;
  }
  if (noteField) {
    noteField.hidden = queued;
  }
  if (ratingField) {
    ratingField.hidden = !finished;
  }
  if (priorityField) {
    priorityField.hidden = !queued;
  }

  if (progressInput) {
    progressInput.required = !queued;
    progressInput.readOnly = finished;
    if (queued) {
      progressInput.value = "";
    } else if (finished) {
      progressInput.value = "100";
    } else if (progressInput.value === "") {
      progressInput.value = "0";
    }
  }

  if (form.elements.pageNow) {
    if (queued) {
      form.elements.pageNow.value = "";
      form.elements.pageTotal.value = "";
    }
  }

  if (noteInput) {
    noteInput.required = finished;
    if (queued) {
      noteInput.value = "";
    }
  }

  if (ratingInput) {
    ratingInput.required = finished;
    if (!finished) {
      ratingInput.value = "0";
    } else if (!ratingInput.value || ratingInput.value === "0") {
      ratingInput.value = "4";
    }
  }

  if (hint) {
    if (queued) {
      hint.textContent = "想读只占位子：没有进度、页码和读后感。可以标一下有多想看。";
    } else if (finished) {
      hint.textContent = "读完需要读后感和评分。页码可以留空。";
    } else {
      hint.textContent = "在读可以写页码，卡片上拖进度会自动保存。";
    }
  }
};

window.ShelfUI.resetBookForm = function (form) {
  if (!form) {
    return;
  }

  form.reset();
  delete form.dataset.editingId;
  delete form.dataset.addedAt;
  delete form.dataset.startedAt;
  delete form.dataset.finishedAt;
  delete form.dataset.updatedAt;
  form.status.value = "reading";
  if (form.querySelector("[data-form-heading]")) {
    form.querySelector("[data-form-heading]").textContent = "上架一本新书";
  }
  if (form.querySelector("[data-form-submit]")) {
    form.querySelector("[data-form-submit]").textContent = "上架";
  }
  var cancel = form.querySelector("[data-form-cancel]");
  if (cancel) {
    cancel.hidden = true;
  }
  window.ShelfUI.syncBookFormFields(form);
};

window.ShelfUI.fillBookForm = function (form, book) {
  if (!form || !book) {
    return;
  }

  form.dataset.editingId = book.id;
  form.dataset.addedAt = book.addedAt || "";
  form.dataset.startedAt = book.startedAt || "";
  form.dataset.finishedAt = book.finishedAt || "";
  form.dataset.updatedAt = book.updatedAt || "";
  form.elements.title.value = book.title || "";
  form.elements.author.value = book.author || "";
  form.elements.genre.value = book.genre || "";
  form.elements.status.value = book.status || "reading";
  form.elements.priority.value = book.priority || "normal";
  form.elements.progress.value =
    book.status === "queued" ? "" : book.progress == null ? "0" : String(book.progress);
  form.elements.pageNow.value = book.pageNow || "";
  form.elements.pageTotal.value = book.pageTotal || "";
  form.elements.note.value = book.status === "queued" ? "" : book.note || "";
  form.elements.rating.value = book.status === "finished" ? String(book.rating || 4) : "0";

  if (form.querySelector("[data-form-heading]")) {
    form.querySelector("[data-form-heading]").textContent = "改这本书";
  }
  if (form.querySelector("[data-form-submit]")) {
    form.querySelector("[data-form-submit]").textContent = "保存";
  }
  var cancel = form.querySelector("[data-form-cancel]");
  if (cancel) {
    cancel.hidden = false;
  }

  window.ShelfUI.syncBookFormFields(form);
  form.elements.title.focus();
};

window.ShelfUI.readBookForm = function (form) {
  var data = new FormData(form);
  var editingId = form.dataset.editingId;
  var status = String(data.get("status") || "");
  var raw = {
    id: editingId || window.ShelfModel.createId(),
    title: data.get("title"),
    author: data.get("author"),
    genre: data.get("genre"),
    status: status,
    priority: data.get("priority"),
    progress: status === "queued" ? null : data.get("progress"),
    pageNow: status === "queued" ? null : data.get("pageNow"),
    pageTotal: status === "queued" ? null : data.get("pageTotal"),
    note: status === "queued" ? "" : data.get("note"),
    rating: status === "finished" ? data.get("rating") : 0,
    addedAt: form.dataset.addedAt || window.ShelfModel.now(),
    startedAt: form.dataset.startedAt || "",
    finishedAt: form.dataset.finishedAt || "",
    updatedAt: window.ShelfModel.now(),
  };

  return window.ShelfModel.normalize(raw);
};

window.ShelfUI.bindBookForm = function (form, handlers) {
  if (!form) {
    return;
  }

  var onAdd = handlers && handlers.onAdd;
  var onSave = handlers && handlers.onSave;

  form.elements.status.addEventListener("change", function () {
    window.ShelfUI.syncBookFormFields(form);
  });

  var cancel = form.querySelector("[data-form-cancel]");
  if (cancel) {
    cancel.addEventListener("click", function () {
      window.ShelfUI.resetBookForm(form);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && form.dataset.editingId) {
      window.ShelfUI.resetBookForm(form);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var book = window.ShelfUI.readBookForm(form);
    if (!book) {
      return;
    }

    if (form.dataset.editingId) {
      onSave(book);
    } else {
      onAdd(book);
    }

    window.ShelfUI.resetBookForm(form);
  });

  window.ShelfUI.syncBookFormFields(form);
};
