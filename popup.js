const toggle    = document.getElementById('toggle');
const statusEl  = document.getElementById('status');
const logsEl    = document.getElementById('logs');
const clearBtn  = document.getElementById('clearBtn');

function formatTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${d.toLocaleDateString()} ${hh}:${mm}:${ss}`;
}

function render({ enabled, logs = [] }) {
  toggle.checked = enabled;

  if (enabled) {
    statusEl.textContent = 'Active: Monitoring downloads';
    statusEl.className = 'status';
  } else {
    statusEl.textContent = 'Paused: Auto-resume is off';
    statusEl.className = 'status off';
  }

  if (logs.length === 0) {
    logsEl.innerHTML = '<div class="empty">No activity yet</div>';
    return;
  }

  logsEl.innerHTML = logs.map(entry => `
    <div class="log-item">
      <div class="log-msg">${escapeHtml(entry.message)}</div>
      <div class="log-time">${formatTime(entry.time)}</div>
    </div>
  `).join('');
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function load() {
  chrome.storage.local.get(['enabled', 'logs'], render);
}

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: toggle.checked }, load);
});

clearBtn.addEventListener('click', () => {
  chrome.storage.local.set({ logs: [] }, load);
});

chrome.storage.onChanged.addListener(load);

load();
