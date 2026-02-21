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
        layer.el.style.transform = `translateY(${scrollY * layer.speed}px)`;
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
     TOP PROGRESS BAR SYSTEM
  ========================== */
/* =========================
   CARD + SOCCER PROGRESS
========================= */

const REQUIRED = ["1","2","3","4","5","6"];

// Card images for progress panel & menu buttons
const CARD_IMAGES = {
  "1": "images/Free Kick Card.webp",
  "2": "images/Goalkeeping.webp",
  "3": "images/Workteam Card.webp",
  "4": "images/Assisting Card.webp",
  "5": "images/Giant Killer.webp",
  "6": "images/Close Contol Card.webp"
};

// Menu button mapping for unlocked images
const MENU_IMAGES = {
  "1": "images/Free Kick Card.webp",
  "2": "images/Goalkeeping.webp",
  "3": "images/Workteam Card.webp",
  "4": "images/Assisting Card.webp",
  "5": "images/Giant Killer.webp",
  "6": "images/Close Contol Card.webp"
};

// Load visited pages from localStorage
let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
const CURRENT_PAGE = document.body.dataset.page;

// Elements
const progressPanel = document.getElementById("progress-panel");
const finalBtn = document.getElementById("final-cta-btn");
const progressFill = document.getElementById("progress-bar-fill");
const soccerBall = document.getElementById("soccer-ball");

// --------------------
// Show progress panel on card pages
// --------------------
if (progressPanel && CURRENT_PAGE && REQUIRED.includes(CURRENT_PAGE)) {
  progressPanel.style.display = "block";
}

// --------------------
// Save current page (1–6 only)
// --------------------
if (CURRENT_PAGE && REQUIRED.includes(CURRENT_PAGE) && !visited.includes(CURRENT_PAGE)) {
  visited.push(CURRENT_PAGE);
  localStorage.setItem("visitedPages", JSON.stringify(visited));
}

// --------------------
// Update card slots in panel
// --------------------
document.querySelectorAll(".card-slot").forEach(slot => {
  const id = slot.dataset.card;
  if (visited.includes(id)) {
    slot.classList.add("completed");
    slot.style.backgroundImage = `url("${CARD_IMAGES[id]}")`;
  } else {
    // Optional: show empty dotted outline
    slot.style.backgroundImage = "none";
    slot.classList.remove("completed");
  }
});

// --------------------
// Update menu buttons based on visited cards
// --------------------
document.querySelectorAll(".menu-btn").forEach(button => {
  const id = button.dataset.id;
  if (visited.includes(id) && MENU_IMAGES[id]) {
    button.src = MENU_IMAGES[id];
    button.classList.remove("locked");
    button.classList.add("unlocked");
  }
});

// --------------------
// Calculate progress
// --------------------
const completed = REQUIRED.filter(id => visited.includes(id)).length;
const percent = (completed / REQUIRED.length) * 100;

// Update progress bar
if (progressFill) {
  progressFill.style.width = `${percent}%`;
}

// Move soccer ball along the bar
if (soccerBall) {
  soccerBall.style.left = `${percent}%`;
}

// --------------------
// Final section button logic
// --------------------
if (finalBtn && completed === REQUIRED.length) {
  finalBtn.style.display = "block";

  // Hide progress panel when final button is active
  if (progressPanel) {
    progressPanel.style.display = "none";
  }

  finalBtn.addEventListener("click", () => {
    const target = document.getElementById("final-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "index.html#final-section";
    }
  });
} else {
  // Keep panel visible until all cards complete
  if (progressPanel) {
    progressPanel.style.display = "block";
  }
}
/* =========================
     BUTTON ENTRANCE ANIMATION
  ========================== */

  const buttons = document.querySelectorAll(".menu-btn");
  const firstSix = Array.from(buttons).slice(0, 6);

  function triggerAnimation(btn) {
    btn.classList.remove("sporty-float");
    void btn.offsetWidth;
    btn.classList.add("sporty-float");
  }

  const observer = new IntersectionObserver(entries => {
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
    const unlocked = REQUIRED.every(id => visited.includes(id));
    if (unlocked && button7) {
      button7.classList.remove("locked");
    }
  }

  checkUnlock();
});

/* =========================
   IDLE + SCROLL PARALLAX
========================== */

const container2 = document.querySelector(".parallax-layers");
if (container2) {
  const layers = [
    { el: container2.querySelector(".layer-1"), speed: 0.35, idleAmp: 10, idleSpeed: 0.0006 },
    { el: container2.querySelector(".layer-2"), speed: 0.25, idleAmp: 7,  idleSpeed: 0.0008 },
    { el: container2.querySelector(".layer-3"), speed: 0.15, idleAmp: 5,  idleSpeed: 0.001 }
  ];

  let scrollY = window.scrollY;
  let lastScrollTime = performance.now();

  function updateParallax(time) {
    const idleFactor = Math.min((time - lastScrollTime) / 1000, 1);

    layers.forEach(layer => {
      if (!layer.el) return;
      const scrollOffset = scrollY * layer.speed;
      const idleOffset =
        Math.sin(time * layer.idleSpeed) * layer.idleAmp * idleFactor;
      layer.el.style.transform = `translateY(${scrollOffset + idleOffset}px)`;
    });
  }

  function animate(time) {
    updateParallax(time);
    requestAnimationFrame(animate);
  }

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    lastScrollTime = performance.now();
  });

  requestAnimationFrame(animate);
}

/* =========================
   LAZY LOAD CARDS + MENU IMAGES
========================= */
function lazyLoadCardsAndMenu(visited) {
  // ----- Menu Buttons -----
  document.querySelectorAll(".menu-btn").forEach(button => {
    const id = button.dataset.id;

    // Set initial src from data-src if not already set
    if (!button.src && button.dataset.src) {
      button.src = button.dataset.src; // lightweight locked image
    }

    // Swap to unlocked image if visited
    if (visited.includes(id)) {
      const unlocked = CARD_IMAGES[id]; // or MENU_IMAGES[id] if you prefer
      if (unlocked) button.src = unlocked;
      button.classList.remove("locked");
      button.classList.add("unlocked");
    }
  });

  // ----- Progress Panel Cards -----
  document.querySelectorAll(".card-slot").forEach(slot => {
    const id = slot.dataset.card;

    if (visited.includes(id)) {
      // Load actual card image
      const img = CARD_IMAGES[id];
      if (img) slot.style.backgroundImage = `url('${img}')`;
      slot.classList.add("completed");
    } else {
      // lightweight placeholder
      slot.style.backgroundImage = "none";
      slot.classList.remove("completed");
    }
  });
}

// Example usage:
let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
lazyLoadCardsAndMenu(visited);