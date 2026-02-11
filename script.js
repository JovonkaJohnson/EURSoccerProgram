document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".parallax-layers"); // ONLY inside this
  const layers = [
    { el: container.querySelector(".layer-1"), speed: 0.35 },
    { el: container.querySelector(".layer-2"), speed: 0.3 },
    { el: container.querySelector(".layer-3"), speed: 0.39 }
  ];

  let scrollY = 0;

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  function animate() {
    layers.forEach(layer => {
      if (!layer.el) return;
      layer.el.style.transform = `translateY(${scrollY * layer.speed}px)`;
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
