window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.renderBookStats = function (node, books) {
  if (!node) {
    return;
  }

  var counts = window.ShelfQuery.counts(books);

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
    '<article class="book-stats__item"><strong>' +
    counts.all +
    "</strong><span>整架</span></article>";
};
