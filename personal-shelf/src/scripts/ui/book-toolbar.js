window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.bindBookToolbar = function (toolbar, onChange) {
  if (!toolbar) {
    return;
  }

  var search = toolbar.querySelector("[name='query']");
  var sort = toolbar.querySelector("[name='sort']");

  function emit() {
    onChange({
      query: search ? search.value : "",
      sort: sort ? sort.value : "added",
    });
  }

  if (search) {
    search.addEventListener("input", emit);
  }
  if (sort) {
    sort.addEventListener("change", emit);
  }
};
