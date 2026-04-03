# Auto Resume Downloads

A lightweight Chrome extension that automatically resumes interrupted or paused downloads — no manual intervention needed.


## Features

- Resumes downloads the moment they are paused or interrupted
- Toggle the extension on/off with a single click
- Activity log showing every resumed download with an exact timestamp
- Minimal UI, no bloat, just what you need


## Installation

This extension is not on the Chrome Web Store. Install it manually in a few steps:

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the `auto-resume-extenstion` folder
6. The extension will appear in your toolbar


## Usage

- Click the extension icon in the toolbar to open the popup
- Use the **toggle switch** to turn auto-resume on or off
- The **Activity Log** shows every download that was resumed, along with the exact time it happened
- Click **Clear** to clear the log

## How It Works

- Listens to Chrome's download events in real time so that the moment a download is paused or interrupted, it resumes it automatically
- A fallback sweep runs every minute to catch anything that may have been missed
- All monitoring happens in the background, you don't need to keep the popup open


## Files

auto-resume-extenstion/
├── manifest.json      # Extension config
├── background.js      # Core logic (download monitoring & resuming)
├── popup.html         # UI
├── popup.js           # UI logic
└── icons/             # Toolbar icons
```


## Permissions Used

| Permission | Reason |
|---|---|
| `downloads` | To monitor and resume downloads |
| `storage` | To save the on/off state and activity log |
| `alarms` | To run a periodic fallback sweep |

---

## License

MIT — free to use, modify, and distribute.
