window.ShelfUI = window.ShelfUI || {};

window.ShelfUI.showToast = function (host, message, action) {
  if (!host) {
    return;
  }

  host.innerHTML = "";

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");

  var text = document.createElement("p");
  text.className = "toast__text";
  text.textContent = message;
  toast.appendChild(text);

  if (action && action.label && action.onClick) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "toast__action";
    button.textContent = action.label;
    button.addEventListener("click", function () {
      action.onClick();
      host.innerHTML = "";
    });
    toast.appendChild(button);
  }

  host.appendChild(toast);

  window.clearTimeout(window.ShelfUI._toastTimer);
  window.ShelfUI._toastTimer = window.setTimeout(function () {
    if (host.contains(toast)) {
      host.innerHTML = "";
    }
  }, 7000);
};
