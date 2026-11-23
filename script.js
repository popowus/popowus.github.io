const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('.section-anchor')];

const homeCoverGrid = document.querySelector('.home-level-cover-grid');
if (homeCoverGrid && !homeCoverGrid.children.length) {
  const obstacles = new Set([2, 6, 10, 14, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 106, 110, 114]);
  for (let index = 0; index < 117; index += 1) {
    const cell = document.createElement('i');
    if (obstacles.has(index)) cell.className = 'is-obstacle';
    if (index === 58) cell.className = 'is-center';
    homeCoverGrid.append(cell);
  }
}

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

const homeStoragePrefix = 'liyan-portfolio-home-v1-';
document.querySelectorAll('[data-home-editable]').forEach((node) => {
  const key = homeStoragePrefix + node.dataset.homeEditable;
  const saved = localStorage.getItem(key);
  if (saved !== null) node.innerHTML = saved;
  node.addEventListener('input', () => {
    localStorage.setItem(key, node.innerHTML);
    if (node.matches('[data-email-link]')) node.href = `mailto:${node.textContent.trim()}`;
  });
});

document.querySelectorAll('[data-email-link]').forEach((node) => {
  node.href = `mailto:${node.textContent.trim()}`;
});
