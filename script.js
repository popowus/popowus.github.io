const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('.section-anchor')];

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-28% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] });

sections.forEach((section) => observer.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});
