const galleryStoragePrefix = 'liyan-portfolio-gallery-v1-';

document.querySelectorAll('[data-gallery-editable]').forEach((node) => {
  const key = galleryStoragePrefix + node.dataset.galleryEditable;
  const saved = localStorage.getItem(key);
  if (saved !== null) node.innerHTML = saved;
  node.addEventListener('input', () => localStorage.setItem(key, node.innerHTML));
});

const lightbox = document.querySelector('.lightbox');
document.querySelectorAll('.art-image').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    if (!image || !lightbox) return;
    lightbox.querySelector('img').src = image.src;
    lightbox.querySelector('img').alt = image.alt;
    lightbox.querySelector('p').textContent = button.closest('.art-tile')?.querySelector('.art-tile-meta p')?.textContent || '';
    lightbox.showModal();
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
