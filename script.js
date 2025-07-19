const slides = document.querySelectorAll('.slide');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  const buffer = 25;
  return rect.top < window.innerHeight - buffer && rect.bottom > buffer;
}

function handleScroll() {
  slides.forEach(el => {
    const fromLeft = el.classList.contains('slide-left');
    const fromRight = el.classList.contains('slide-right');

    if (isInViewport(el)) {
      el.classList.add('visible');
      el.classList.remove('exit-left', 'exit-right');
    } else {
      el.classList.remove('visible');
      if (fromLeft) el.classList.add('exit-left');
      if (fromRight) el.classList.add('exit-right');
    }
  });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);
window.addEventListener('DOMContentLoaded', handleScroll);
