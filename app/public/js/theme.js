// gumes-theme — light/dark toggle persisted in localStorage
(function () {
  const KEY = "gumes-theme";
  const html = document.documentElement;

  function apply(theme) {
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }

  function current() {
    try { return localStorage.getItem(KEY) === "dark" ? "dark" : "light"; }
    catch { return "light"; }
  }

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    apply(next);
    const btn = document.querySelector("#theme-toggle .material-symbols-outlined");
    if (btn) btn.textContent = next === "dark" ? "light_mode" : "dark_mode";
  }

  document.addEventListener("DOMContentLoaded", () => {
    apply(current());
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggle);
    const icon = btn?.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = current() === "dark" ? "light_mode" : "dark_mode";
  });
})();
