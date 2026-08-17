document.addEventListener("DOMContentLoaded", function () {
  /* ---------------- Mobile nav ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!nav) return;
    nav.classList.add("open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      if (isOpen) closeNav();
      else openNav();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  // Highlight active nav link
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(
    ".card, .step, .founder-block, .cta-banner, .location-card"
  );
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px 40px 0px" }
      );
      revealTargets.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  /* ---------------- Forms: AJAX submit + inline validation ---------------- */
  document.querySelectorAll("form.js-form").forEach(function (form) {
    var statusBox = form.parentElement.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    // Toggle aria-invalid live as the user fixes fields
    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("invalid", function () {
        field.setAttribute("aria-invalid", "true");
      });
      field.addEventListener("input", function () {
        if (field.checkValidity()) field.removeAttribute("aria-invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      if (submitBtn) {
        submitBtn.classList.add("is-loading");
        submitBtn.disabled = true;
      }
      if (statusBox) {
        statusBox.classList.remove("show", "success", "error");
      }

      var data = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          if (statusBox) {
            statusBox.textContent =
              form.getAttribute("data-success-message") || "Thanks — your message is in!";
            statusBox.classList.add("show", "success");
          }
          form.reset();
        })
        .catch(function () {
          if (statusBox) {
            statusBox.textContent =
              "Something went wrong sending that — please try again, or reach us another way.";
            statusBox.classList.add("show", "error");
          } else {
            // No status box available: fall back to a normal form submit
            form.submit();
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.classList.remove("is-loading");
            submitBtn.disabled = false;
          }
          if (statusBox) {
            statusBox.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          }
        });
    });
  });
});
