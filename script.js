document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PARALLAX (Optimized)
  ========================== */

  const container = document.querySelector(".parallax-layers");
  if (container) {

    const layers = [
      { el: container.querySelector(".layer-1"), speed: 0.35 },
      { el: container.querySelector(".layer-2"), speed: 0.25 },
      { el: container.querySelector(".layer-3"), speed: 0.15 }
    ];

    let scrollY = window.scrollY;
    let ticking = false;

    function updateParallax() {
      layers.forEach(layer => {
        if (!layer.el) return;
        layer.el.style.transform =
          `translateY(${scrollY * layer.speed}px)`;
      });
    }

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;

      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });

  }


  /* =========================
     MENU BUTTON NAVIGATION
  ========================== */

  document.querySelectorAll(".menu-btn").forEach(button => {
    button.addEventListener("click", () => {

      const id = button.dataset.id;
      const page = button.dataset.page;

      if (!id || !page) return;

      // Block locked final card
      if (id === "7" && button.classList.contains("locked")) {
        alert("Complete all 6 cards to unlock this!");
        return;
      }

      // Save visited (1–6 only)
      let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
      if (!visited.includes(id) && id !== "7") {
        visited.push(id);
        localStorage.setItem("visitedPages", JSON.stringify(visited));
      }

      window.location.href = page;
    });
  });


  /* =========================
     PROGRESS SYSTEM
  ========================== */

  const progressBtn = document.getElementById("progress-ui");
  const overlay = document.getElementById("progress-overlay");
  const progressCount = document.getElementById("progress-count");
  const finalBtn = document.getElementById("goto-final");
  const closeBtn = document.getElementById("close-popup");

  if (overlay) overlay.style.display = "none";

  let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
  const CURRENT_PAGE = document.body.dataset.page || null;

  if (CURRENT_PAGE && CURRENT_PAGE !== "7" && !visited.includes(CURRENT_PAGE)) {
    visited.push(CURRENT_PAGE);
    localStorage.setItem("visitedPages", JSON.stringify(visited));
  }

  function updateProgress() {
    const required = ["1","2","3","4","5","6"];
    const done = required.filter(id => visited.includes(id)).length;

    if (progressCount) {
      progressCount.textContent = `${done} / 6 completed`;
    }

    if (finalBtn) {
      finalBtn.style.display = done === 6 ? "inline-block" : "none";
    }

    const button7 = document.querySelector('[data-id="7"]');
    if (button7) {
      button7.classList.toggle("locked", done !== 6);
    }
  }

  if (progressBtn && overlay) {
    progressBtn.addEventListener("click", () => {
      overlay.style.display =
        overlay.style.display === "flex" ? "none" : "flex";
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  if (finalBtn) {
    finalBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      window.location.href = "index.html#final-section";
    });
  }

  updateProgress();


  /* =========================
     BUTTON ENTRANCE ANIMATION
  ========================== */

  const buttons = document.querySelectorAll('.menu-btn');
  const firstSix = Array.from(buttons).slice(0, 6);

  function triggerAnimation(btn) {
    btn.classList.remove('sporty-float');
    void btn.offsetWidth;
    btn.classList.add('sporty-float');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerAnimation(entry.target);
      }
    });
  }, { threshold: 0.5 });

  firstSix.forEach(btn => observer.observe(btn));


  /* =========================
     FINAL UNLOCK CHECK
  ========================== */

  const button7 = document.querySelector('.menu-btn[data-id="7"]');

  function checkUnlock() {
    const required = ["1","2","3","4","5","6"];
    const unlocked = required.every(id => visited.includes(id));

    if (unlocked && button7) {
      button7.classList.remove("locked");
    }
  }

  checkUnlock();

});