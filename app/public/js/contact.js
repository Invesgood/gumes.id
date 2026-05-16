(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("cf-submit");
  const submitLabel = document.getElementById("cf-submit-label");
  const feedback = document.getElementById("cf-feedback");

  function showFeedback(msg, kind) {
    feedback.textContent = msg;
    feedback.classList.remove("hidden", "text-error", "text-primary");
    feedback.classList.add(kind === "error" ? "text-error" : "text-primary");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.classList.add("hidden");

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      inquiry: String(fd.get("inquiry") || ""),
      message: String(fd.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      showFeedback("Lengkapi nama, email, dan pesan terlebih dahulu.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Mengirim…";

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) {
        showFeedback(data.error || "Gagal mengirim pesan.", "error");
        submitBtn.disabled = false;
        submitLabel.textContent = "Initiate Correspondence";
        return;
      }
      form.reset();
      showFeedback("Terima kasih — pesan Anda sudah kami terima. Kurator akan segera menghubungi.", "ok");
      submitLabel.textContent = "Sent ✓";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitLabel.textContent = "Initiate Correspondence";
      }, 3000);
    } catch (err) {
      showFeedback("Koneksi bermasalah. Coba lagi.", "error");
      submitBtn.disabled = false;
      submitLabel.textContent = "Initiate Correspondence";
    }
  });
})();
