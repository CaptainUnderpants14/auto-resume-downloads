chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, logs: [] });
  setupAlarm();
});

chrome.runtime.onStartup.addListener(setupAlarm);

function setupAlarm() {
  chrome.alarms.clearAll(() => {
    chrome.alarms.create('check', { periodInMinutes: 1 });
  });
}

// only fires when a download becomes interrupted or paused
chrome.downloads.onChanged.addListener((delta) => {
  const becameInterrupted = delta.state?.current === 'interrupted';
  const becamePaused      = delta.paused?.current === true;

  if (!becameInterrupted && !becamePaused) return;

  chrome.storage.local.get('enabled', ({ enabled }) => {
    if (!enabled) return;
    setTimeout(() => {
      chrome.downloads.search({ id: delta.id }, ([dl]) => {
        if (dl && dl.canResume) resume(dl);
      });
    }, 3000);
  });
});

// Fallback sweep every minute to catches if anything is missed
chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get('enabled', ({ enabled }) => {
    if (!enabled) return;

    // Resume interrupted downloads
    chrome.downloads.search({ state: 'interrupted' }, (list) => {
      list.forEach(dl => { if (dl.canResume) resume(dl); });
    });

    // Resume paused downloads (paused = in_progress + paused:true)
    chrome.downloads.search({ state: 'in_progress', paused: true }, (list) => {
      list.forEach(dl => { if (dl.canResume) resume(dl); });
    });
  });
});

function resume(dl) {
  chrome.downloads.resume(dl.id, () => {
    if (chrome.runtime.lastError) return;
    const name = dl.filename.replace(/\\/g, '/').split('/').pop() || dl.url;
    addLog(`Resumed: ${name}`);
  });
}

function addLog(message) {
  const entry = { message, time: Date.now() };
  chrome.storage.local.get('logs', ({ logs = [] }) => {
    chrome.storage.local.set({ logs: [entry, ...logs].slice(0, 50) });
  });
}
