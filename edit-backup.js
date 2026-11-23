(() => {
  const localHosts = new Set(['localhost', '127.0.0.1']);
  const isLocalEditing = location.protocol === 'file:' || localHosts.has(location.hostname);

  if (!isLocalEditing) {
    document.documentElement.classList.add('published-view');
    document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
      node.setAttribute('contenteditable', 'false');
    });
    document.querySelectorAll('.media-slot').forEach((slot) => {
      if (!slot.querySelector('.media-item')) slot.hidden = true;
    });
    return;
  }

  document.documentElement.classList.add('local-edit-view');
  const prefix = document.body.dataset.backupPrefix;
  const pageName = document.body.dataset.backupName || document.title || '作品集页面';
  if (!prefix) return;

  const toolbar = document.querySelector('.edit-toolbar');
  const dock = document.createElement('div');
  dock.className = toolbar ? 'backup-tools' : 'backup-dock';
  dock.innerHTML = '<span class="backup-status">当前浏览器自动保存已开启</span><button type="button" class="backup-export">下载编辑备份</button><label class="backup-import">导入备份<input type="file" accept="application/json,.json" /></label>';
  (toolbar || document.body).append(dock);

  const status = dock.querySelector('.backup-status');
  let statusTimer;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    clearTimeout(statusTimer);
    if (!isError) statusTimer = setTimeout(() => { status.textContent = '当前浏览器自动保存已开启'; }, 4500);
  }

  document.addEventListener('input', (event) => {
    if (!event.target.closest('[contenteditable="true"]')) return;
    const time = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
    setTimeout(() => setStatus(`已自动保存到当前浏览器 ${time}`), 0);
  });

  dock.querySelector('.backup-export').addEventListener('click', () => {
    const entries = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(prefix)) entries[key] = localStorage.getItem(key);
    }
    const backup = { format: 'liyan-portfolio-backup', version: 1, pageName, prefix, exportedAt: new Date().toISOString(), entries };
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = URL.createObjectURL(blob);
    link.download = `${pageName}-编辑备份-${date}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(`备份已下载，共 ${Object.keys(entries).length} 项`);
  });

  dock.querySelector('.backup-import input').addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        const backup = JSON.parse(reader.result);
        if (backup.format !== 'liyan-portfolio-backup' || backup.prefix !== prefix || !backup.entries) throw new Error('wrong backup');
        Object.entries(backup.entries).forEach(([key, value]) => localStorage.setItem(key, value));
        setStatus('备份导入成功，正在刷新页面');
        setTimeout(() => window.location.reload(), 500);
      } catch {
        setStatus('备份文件与当前页面不匹配，未导入', true);
      }
    });
    reader.readAsText(file);
    event.target.value = '';
  });
})();
