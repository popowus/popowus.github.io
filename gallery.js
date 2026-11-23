const galleryStoragePrefix = 'liyan-portfolio-gallery-v1-';

document.querySelectorAll('[data-gallery-editable]').forEach((node) => {
  const key = galleryStoragePrefix + node.dataset.galleryEditable;
  const saved = localStorage.getItem(key);
  if (saved !== null) node.innerHTML = saved;
  node.addEventListener('input', () => localStorage.setItem(key, node.innerHTML));
});

function showArt(entry, data) {
  const button = entry.querySelector('.art-image');
  if (!button || !data) return;
  button.classList.add('has-art');
  button.innerHTML = '';
  const image = document.createElement('img');
  image.src = data;
  image.alt = entry.querySelector('.art-tile-meta p')?.textContent || '绘画作品';
  button.append(image);
}

document.querySelectorAll('.art-tile').forEach((entry) => {
  const key = `${galleryStoragePrefix}image-${entry.dataset.artSlot}`;
  showArt(entry, localStorage.getItem(key));
  entry.querySelector('.art-input')?.addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        localStorage.setItem(key, reader.result);
        showArt(entry, reader.result);
      } catch {
        window.alert('图片较大，浏览器本地空间不足。把图片文件发给我后可以直接放进网站。');
      }
    });
    reader.readAsDataURL(file);
    event.target.value = '';
  });
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
