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
      // Stagger cards/steps/badges that share a parent so a row arrives as
      // a short wave (60ms per item, capped) instead of popping in at once.
      var siblings = el.parentElement
        ? Array.prototype.filter.call(el.parentElement.children, function (c) {
            return c === el || (c.matches && c.matches(".card, .step, .location-card, .badge-item"));
          })
        : [el];
      var position = siblings.indexOf(el);
      if (position > 0) {
        el.style.setProperty("--reveal-delay", Math.min(position * 60, 360) + "ms");
      }
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

  /* ---------------- Hero stat count-up ---------------- */
  var statEls = document.querySelectorAll(".stat .num[data-count-to]");
  if (statEls.length) {
    function animateStat(el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion || isNaN(target)) {
        el.textContent = target + suffix;
        return;
      }
      var start = null;
      var duration = 900;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      statEls.forEach(animateStat);
    } else {
      var statIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      statEls.forEach(function (el) {
        statIo.observe(el);
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
