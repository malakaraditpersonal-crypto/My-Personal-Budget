# My Personal Budget

A mobile-friendly budget tracker that keeps its data in this browser. It includes income and expense tracking, account balances, budgets, savings goals, calendar views, CSV export, and JSON backup/restore.

## Run locally

1. Install Python 3 if it is not already installed.
2. Open a terminal in this `outputs` folder.
3. Run `py -m http.server 8000` (or `python -m http.server 8000`).
4. Visit [http://localhost:8000](http://localhost:8000).

Keep the terminal open while using the app. Use `Ctrl+C` to stop the local server. Opening `index.html` directly as a file will load the tracker, but browser install and offline support require localhost or an HTTPS website.

## Install on a device

Open the local address or hosted HTTPS address in a supported browser. Choose **Install app** in the app's Profile screen when it appears, or use the browser's install option. The app shell is cached after the first visit and opens offline afterward. Budget data remains in that browser's local storage; use **Backup data** to save a portable copy.

## Host it

Upload the contents of this `outputs` folder to any static host that serves HTTPS, such as GitHub Pages, Netlify, or Cloudflare Pages. Keep the directory structure intact. No backend or build step is required. Google sign-in is optional and is not configured by default.
