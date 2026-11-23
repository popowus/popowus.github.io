const levelStoragePrefix = 'liyan-portfolio-levels-v1-';

document.querySelectorAll('[data-editable]').forEach((node) => {
  const key = levelStoragePrefix + node.dataset.editable;
  const saved = localStorage.getItem(key);
  if (saved !== null) node.innerHTML = saved;
  node.addEventListener('input', () => localStorage.setItem(key, node.innerHTML));
});

function readLevelMedia(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function renderLevelSlot(slot) {
  const wall = slot.querySelector('.media-wall');
  if (!wall) return;
  wall.querySelectorAll('.media-item-user').forEach((node) => node.remove());

  const key = `${levelStoragePrefix}media-${slot.dataset.slot}`;
  const items = readLevelMedia(key);
  wall.querySelector('.media-empty')?.classList.toggle('is-hidden', items.length > 0);

  items.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'media-item media-item-user';

    const image = document.createElement('img');
    image.src = item.data;
    image.alt = item.name || '关卡案例媒体';
    figure.append(image);

    const caption = document.createElement('figcaption');
    caption.contentEditable = 'true';
    caption.textContent = item.caption || item.name || '点击修改图片说明';
    caption.addEventListener('input', () => {
      const current = readLevelMedia(key);
      if (!current[index]) return;
      current[index].caption = caption.textContent;
      localStorage.setItem(key, JSON.stringify(current));
    });
    figure.append(caption);

    const remove = document.createElement('button');
    remove.className = 'media-remove';
    remove.type = 'button';
    remove.textContent = '移除';
    remove.addEventListener('click', () => {
      const current = readLevelMedia(key);
      current.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(current));
      renderLevelSlot(slot);
    });
    figure.append(remove);
    wall.append(figure);
  });
}

document.querySelectorAll('.media-slot').forEach((slot) => {
  const input = slot.querySelector('.slot-input');
  if (!input) return;

  input.addEventListener('change', () => {
    const key = `${levelStoragePrefix}media-${slot.dataset.slot}`;
    const saved = readLevelMedia(key);
    const files = [...input.files];
    let pending = files.length;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        saved.push({ name: file.name, caption: file.name, data: reader.result });
        pending -= 1;
        if (pending === 0) {
          try {
            localStorage.setItem(key, JSON.stringify(saved));
            renderLevelSlot(slot);
          } catch {
            window.alert('图片或 GIF 文件较大，浏览器本地空间不足。可以先压缩文件，或把文件位置发给我后直接放入网页。');
          }
        }
      });
      reader.readAsDataURL(file);
    });
    input.value = '';
  });

  renderLevelSlot(slot);
});

const coverGrid = document.querySelector('.level-cover-grid');
if (coverGrid) {
  const obstacles = new Set([2, 6, 10, 14, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 106, 110, 114]);
  for (let index = 0; index < 117; index += 1) {
    const cell = document.createElement('i');
    if (obstacles.has(index)) cell.className = 'is-obstacle';
    if (index === 58) cell.className = 'is-center';
    coverGrid.append(cell);
  }
}
