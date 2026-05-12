// Auth forms: login + signup + logout
(function () {
  "use strict";

  async function submitJSON(url, data) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: res.ok, body: await res.json().catch(() => ({})) };
  }

  // ── Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const errEl = document.getElementById("login-error");
    const btn = document.getElementById("login-submit");
    const lbl = document.getElementById("login-label");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errEl.classList.add("hidden");
      btn.disabled = true; lbl.textContent = "Signing in...";
      const fd = new FormData(loginForm);
      const { ok, body } = await submitJSON("/api/auth/login", {
        email: fd.get("email"), password: fd.get("password"),
      });
      if (!ok) {
        errEl.textContent = body.error || "Login gagal.";
        errEl.classList.remove("hidden");
        btn.disabled = false; lbl.textContent = "Sign In to Atelier";
        return;
      }
      window.location.href = loginForm.dataset.redirect || "/profile";
    });
  }

  // ── Signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const errEl = document.getElementById("signup-error");
    const btn = document.getElementById("signup-submit");
    const lbl = document.getElementById("signup-label");
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errEl.classList.add("hidden");
      btn.disabled = true; lbl.textContent = "Creating...";
      const fd = new FormData(signupForm);
      const { ok, body } = await submitJSON("/api/auth/signup", {
        name: fd.get("name"), email: fd.get("email"), password: fd.get("password"),
      });
      if (!ok) {
        errEl.textContent = body.error || "Signup gagal.";
        errEl.classList.remove("hidden");
        btn.disabled = false; lbl.textContent = "Initialize Membership";
        return;
      }
      window.location.href = "/profile";
    });
  }

  // ── Logout buttons
  document.querySelectorAll("[data-logout]").forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    });
  });
})();
