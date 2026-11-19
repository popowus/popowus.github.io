const editable = [...document.querySelectorAll('[data-editable]')];
// v2 keeps the provided case-study text separate from the earlier browser draft.
const storagePrefix = 'liyan-portfolio-crisp-v2-';

editable.forEach((node) => {
  const key = storagePrefix + node.dataset.editable;
  const saved = localStorage.getItem(key);
  if (saved) node.innerHTML = saved;
  node.addEventListener('input', () => localStorage.setItem(key, node.innerHTML));
});

function readMedia(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function addSavedMedia(slot, items) {
  const wall = slot.querySelector('.media-wall');
  if (!wall || !items.length) return;
  wall.querySelectorAll('.media-item-user').forEach((node) => node.remove());
  wall.querySelector('.media-empty')?.remove();
  items.forEach((item) => {
    const wrapper = document.createElement('figure');
    wrapper.className = 'media-item media-item-user';
    const image = document.createElement('img');
    image.src = item.data;
    image.alt = item.name || '项目媒体';
    wrapper.append(image);
    const caption = document.createElement('figcaption');
    caption.textContent = item.name || '项目媒体';
    wrapper.append(caption);
    wall.append(wrapper);
  });
}

function renderSavedMedia() {
  document.querySelectorAll('.media-slot').forEach((slot) => {
    const slotName = slot.dataset.slot;
    addSavedMedia(slot, readMedia(`${storagePrefix}crisp-media-${slotName}`));
  });

  // Keep GIFs uploaded through the previous single-wall control visible.
  const legacy = readMedia(`${storagePrefix}crisp-media`);
  const intro = document.querySelector('[data-slot="intro"]');
  if (intro && legacy.length) addSavedMedia(intro, legacy);
}

document.querySelectorAll('.media-slot').forEach((slot) => {
  const input = slot.querySelector('.slot-input');
  if (!input) return;
  input.addEventListener('change', () => {
    const slotName = slot.dataset.slot;
    const key = `${storagePrefix}crisp-media-${slotName}`;
    const saved = readMedia(key);
    [...input.files].forEach((file) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        saved.push({ name: file.name, data: reader.result });
        localStorage.setItem(key, JSON.stringify(saved));
        renderSavedMedia();
      });
      reader.readAsDataURL(file);
    });
    input.value = '';
  });
});

renderSavedMedia();
