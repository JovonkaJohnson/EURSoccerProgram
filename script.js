document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".parallax-layers");
  if (!container) return;

  const layers = [
    { el: container.querySelector(".layer-1"), speed: 0.35, tilt: 2, float: 10 },
    { el: container.querySelector(".layer-2"), speed: 0.3,  tilt: 1, float: 3 },
    { el: container.querySelector(".layer-3"), speed: 0.2, tilt: 0, float: 2 }
  ];

  let scrollY = 0;
  let time = 0;

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  function animate() {
    time += 0.02; // scrapbook movement speed

    layers.forEach(layer => {
      if (!layer.el) return;

      const scrollOffset = scrollY * layer.speed;

      // imperfect float (not perfectly smooth)
      const floatOffset = Math.sin(time) * layer.float;

      // subtle paper wobble
      const rotate = Math.sin(time * 0.4) * layer.tilt;

      layer.el.style.transform =
        `translateY(${scrollOffset + floatOffset}px)
         rotate(${rotate}deg)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
});


// Animate first 6 buttons when scrolled into view
const buttons = document.querySelectorAll('.menu-btn');
const animatedButtons = Array.from(buttons).slice(0, 6);

function triggerAnimation(btn) {
    btn.classList.remove('sporty-float'); // reset
    void btn.offsetWidth; // force reflow
    btn.classList.add('sporty-float'); // apply animation + glow
}

// IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            triggerAnimation(entry.target);
        }
    });
}, { threshold: 0.5 });

animatedButtons.forEach(btn => observer.observe(btn));


document.querySelectorAll(".menu-btn").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const page = button.dataset.page;

    if (id === "7" && button.classList.contains("locked")) {
      alert("Complete all 6 cards to unlock this!");
      return;
    }

    // save visited 1–6
    let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
    if (!visited.includes(id) && id !== "7") {
      visited.push(id);
      localStorage.setItem("visitedPages", JSON.stringify(visited));
    }

    // navigate
    window.location.href = page;
  });
});




document.addEventListener("DOMContentLoaded", () => {

  const progressBtn = document.getElementById("progress-ui");
  const overlay = document.getElementById("progress-overlay");
  const progressCount = document.getElementById("progress-count");
  const finalBtn = document.getElementById("goto-final");
  const closeBtn = document.getElementById("close-popup");

  // FORCE overlay hidden on page load
  overlay.style.display = "none";

  // Load visited progress
  let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
  const CURRENT_PAGE = document.body.dataset.page || "0";

  // Add current page to visited if 1-6
  if (!visited.includes(CURRENT_PAGE) && CURRENT_PAGE !== "7") {
    visited.push(CURRENT_PAGE);
    localStorage.setItem("visitedPages", JSON.stringify(visited));
  }

  function updateProgress() {
    const required = ["1","2","3","4","5","6"];
    const done = required.filter(id => visited.includes(id)).length;
    progressCount.textContent = `${done} / 6 completed`;

    // Show final card button if unlocked
    finalBtn.style.display = done === 6 ? "inline-block" : "none";

    // Update main menu button7 if exists
    const button7 = document.querySelector('[data-id="7"]');
    if (button7) {
      button7.classList.toggle("locked", done !== 6);
    }
  }

  // Click progress button → toggle overlay
  progressBtn.addEventListener("click", () => {
    overlay.style.display = overlay.style.display === "flex" ? "none" : "flex";
  });

  // Click close button → hide overlay
  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  finalBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    window.location.href = "index.html#final-section";
  });

  // Only update progress numbers; overlay stays hidden
  updateProgress();

});

document.addEventListener("DOMContentLoaded", () => {
  const button7 = document.querySelector('.menu-btn[data-id="7"]');

  // Load visited pages
  let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];

  function checkUnlock() {
    const required = ["1","2","3","4","5","6"];
    const unlocked = required.every(id => visited.includes(id));

    if (unlocked && button7) {
      button7.classList.remove("locked");
      button7.classList.add("unlocked-animation"); // start animation
    }
  }

  checkUnlock();

  // Optional: re-check after visiting any page
  window.addEventListener("storage", () => {
    visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
    checkUnlock();
  });
});




function smoothScrollTo(target, duration) {

  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {

    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  requestAnimationFrame(animation);
}


finalBtn.addEventListener("click", () => {
  overlay.style.display = "none";

  const target = document.getElementById("final-section");

  setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
});