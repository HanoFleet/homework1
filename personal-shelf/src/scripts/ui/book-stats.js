window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.renderBookStats = function (node, books) {
  if (!node) {
    return;
  }

  var counts = window.ShelfQuery.counts(books);
  var latest = counts.latestTitle
    ? "最近在读 · " + counts.latestTitle
    : "最近还没打开在读书";

  node.innerHTML =
    '<article class="book-stats__item"><strong>' +
    counts.queued +
    "</strong><span>想读</span></article>" +
    '<article class="book-stats__item"><strong>' +
    counts.reading +
    "</strong><span>在读 · 均 " +
    counts.readingAvg +
    "%</span></article>" +
    '<article class="book-stats__item"><strong>' +
    counts.finished +
    "</strong><span>读完</span></article>" +
    '<article class="book-stats__item book-stats__item--wide"><strong>' +
    counts.all +
    "</strong><span>" +
    window.ShelfUI.escapeHtml(latest) +
    "</span></article>";
};
