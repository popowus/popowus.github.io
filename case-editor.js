const casePage = document.body.dataset.casePage || 'case';
const caseStoragePrefix = `liyan-portfolio-${casePage}-v1-`;

document.querySelectorAll('[data-case-editable]').forEach((node) => {
  const key = caseStoragePrefix + node.dataset.caseEditable;
  const saved = localStorage.getItem(key);
  if (saved !== null) node.innerHTML = saved;
  node.addEventListener('input', () => localStorage.setItem(key, node.innerHTML));
});

function readCaseMedia(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function renderCaseSlot(slot) {
  const wall = slot.querySelector('.media-wall');
  if (!wall) return;
  wall.querySelectorAll('.media-item-user').forEach((node) => node.remove());
  const key = `${caseStoragePrefix}media-${slot.dataset.slot}`;
  const items = readCaseMedia(key);
  wall.querySelector('.media-empty')?.classList.toggle('is-hidden', items.length > 0);

  items.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'media-item media-item-user';
    const image = document.createElement('img');
    image.src = item.data;
    image.alt = item.name || '案例材料';
    figure.append(image);

    const caption = document.createElement('figcaption');
    caption.contentEditable = 'true';
    caption.textContent = item.caption || item.name || '点击修改说明';
    caption.addEventListener('input', () => {
      const current = readCaseMedia(key);
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
      const current = readCaseMedia(key);
      current.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(current));
      renderCaseSlot(slot);
    });
    figure.append(remove);
    wall.append(figure);
  });
}

document.querySelectorAll('.media-slot').forEach((slot) => {
  const input = slot.querySelector('.slot-input');
  if (!input) return;
  input.addEventListener('change', () => {
    const key = `${caseStoragePrefix}media-${slot.dataset.slot}`;
    const saved = readCaseMedia(key);
    const files = [...input.files];
    let pending = files.length;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        saved.push({ name: file.name, caption: file.name, data: reader.result });
        pending -= 1;
        if (pending !== 0) return;
        try {
          localStorage.setItem(key, JSON.stringify(saved));
          renderCaseSlot(slot);
        } catch {
          window.alert('文件较大，浏览器本地空间不足。可以把文件交给我后正式放进网页。');
        }
      });
      reader.readAsDataURL(file);
    });
    input.value = '';
  });
  renderCaseSlot(slot);
});
