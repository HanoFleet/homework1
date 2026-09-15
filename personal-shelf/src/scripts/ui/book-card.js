window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.STATUS_LABEL = {
  reading: "在读",
  finished: "读完",
  queued: "想读",
};

window.ShelfUI.PRIORITY_LABEL = {
  later: "以后再说",
  normal: "普通",
  soon: "很想读",
};

window.ShelfUI.renderStars = function (rating, bookId) {
  var escapeHtml = window.ShelfUI.escapeHtml;
  var value = Number(rating) || 0;
  var html = '<div class="book-card__stars" role="group" aria-label="评分">';
  var index;

  for (index = 1; index <= 5; index += 1) {
    html +=
      '<button type="button" class="book-card__star' +
      (index <= value ? " is-on" : "") +
      '" data-action="rate" data-book-id="' +
      escapeHtml(bookId) +
      '" data-rating="' +
      index +
      '" aria-label="打 ' +
      index +
      ' 星">★</button>';
  }

  return html + "</div>";
};

window.ShelfUI.renderBook = function (book, options) {
  var escapeHtml = window.ShelfUI.escapeHtml;
  var status = window.ShelfUI.STATUS_LABEL[book.status] || "在读";
  var queued = book.status === "queued";
  var reading = book.status === "reading";
  var finished = book.status === "finished";
  var percent = queued ? 0 : Math.max(0, Math.min(100, Number(book.progress) || 0));
  var flash = options && options.flashId && String(options.flashId) === String(book.id);
  var html =
    '<article class="book-card' +
    (flash ? " is-flash" : "") +
    '" data-status="' +
    escapeHtml(book.status) +
    '" data-book-id="' +
    escapeHtml(book.id) +
    '">' +
    '<div class="book-card__top">' +
    '<p class="book-card__status">' +
    escapeHtml(status) +
    "</p>" +
    window.ShelfUI.renderRemoveButton(book) +
    "</div>" +
    '<h2 class="book-card__title">' +
    escapeHtml(book.title) +
    "</h2>" +
    '<p class="book-card__author">' +
    escapeHtml(book.author) +
    "</p>";

  if (book.genre) {
    html += '<p class="book-card__genre">' + escapeHtml(book.genre) + "</p>";
  }

  if (queued) {
    html +=
      '<p class="book-card__meta">想读优先级：' +
      escapeHtml(window.ShelfUI.PRIORITY_LABEL[book.priority] || "普通") +
      "</p>";
  }

  if (reading) {
    html +=
      '<div class="book-card__progress">' +
      '<label class="book-card__progress-label" for="progress-' +
      escapeHtml(book.id) +
      '">进度 ' +
      percent +
      "%" +
      (book.pageNow && book.pageTotal
        ? " · 第 " + book.pageNow + " / " + book.pageTotal + " 页"
        : "") +
      "</label>" +
      '<div class="book-card__bar">' +
      '<span class="book-card__fill" style="width: ' +
      percent +
      '%"></span>' +
      "</div>" +
      '<input class="book-card__range" id="progress-' +
      escapeHtml(book.id) +
      '" type="range" min="0" max="99" value="' +
      percent +
      '" data-book-id="' +
      escapeHtml(book.id) +
      '" aria-label="调整《' +
      escapeHtml(book.title) +
      '》的进度" />' +
      "</div>";

    if (book.log && book.log.length) {
      html +=
        '<p class="book-card__meta">上次记下 ' +
        escapeHtml(window.ShelfUI.formatDate(book.log[book.log.length - 1].at)) +
        " · " +
        book.log[book.log.length - 1].progress +
        "%</p>";
    }
  }

  if (finished) {
    html +=
      '<div class="book-card__progress" aria-label="阅读进度 100%">' +
      '<div class="book-card__bar">' +
      '<span class="book-card__fill" style="width: 100%"></span>' +
      "</div>" +
      '<span class="book-card__percent">100%</span>' +
      "</div>" +
      window.ShelfUI.renderStars(book.rating, book.id);

    if (book.startedAt || book.finishedAt) {
      html +=
        '<p class="book-card__meta">' +
        (book.startedAt ? "从 " + escapeHtml(window.ShelfUI.formatDate(book.startedAt)) : "") +
        (book.finishedAt ? " 读到 " + escapeHtml(window.ShelfUI.formatDate(book.finishedAt)) : "") +
        "</p>";
    }
  }

  if (!queued && book.note) {
    html += '<p class="book-card__note">' + escapeHtml(book.note) + "</p>";
  }

  if (finished && !book.note) {
    html += '<p class="book-card__note book-card__note--empty">还没写下读后感。</p>';
  }

  html += '<div class="book-card__actions">';

  if (queued) {
    html +=
      '<button type="button" class="book-card__action" data-action="start" data-book-id="' +
      escapeHtml(book.id) +
      '">开始读</button>';
  }

  if (reading) {
    html +=
      '<button type="button" class="book-card__action" data-action="finish" data-book-id="' +
      escapeHtml(book.id) +
      '">读完了</button>';
  }

  html +=
    '<button type="button" class="book-card__action" data-action="edit" data-book-id="' +
    escapeHtml(book.id) +
    '">编辑</button></div></article>';

  return html;
};
