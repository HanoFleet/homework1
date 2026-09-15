window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.formatDate = function (iso) {
  if (!iso) {
    return "";
  }

  var date = new Date(iso);
  if (isNaN(date.getTime())) {
    return "";
  }

  var month = String(date.getMonth() + 1);
  var day = String(date.getDate());
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }

  return date.getFullYear() + "-" + month + "-" + day;
};
