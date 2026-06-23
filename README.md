# ⚽ World Cup Prediction Optimizer

Live Polymarket exact-score odds → Poisson model → optimal expected-points prediction.

## Deploy in ~10 minutes

### Step 1 — Deploy the Cloudflare Worker (proxy)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up free
2. Click **Workers & Pages** → **Create** → **Create Worker**
3. Name it `worldcup-proxy` (or anything you like)
4. Click **Deploy**, then **Edit code**
5. Delete all existing code and paste the contents of `cloudflare-worker.js`
6. Click **Deploy**
7. Copy your worker URL — it looks like:
   `https://worldcup-proxy.YOURNAME.workers.dev`

### Step 2 — Add your Worker URL to index.html

Open `index.html` and find this line near the top of the `<script>` block:

```js
const WORKER_URL = 'https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev';
```

Replace it with your actual worker URL from Step 1.

### Step 3 — Publish to GitHub Pages

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `worldcup` (or anything), set to **Public**, click **Create**
3. Upload both files: `index.html` and `cloudflare-worker.js`
   (drag and drop them into the GitHub file browser)
4. Go to **Settings** → **Pages** → Source: **Deploy from branch** → branch: **main** → folder: **/ (root)**
5. Click **Save**
6. Wait ~60 seconds, then visit:
   `https://YOURUSERNAME.github.io/worldcup`

That's it — your optimizer is live at a permanent public URL.

## How it works

```
Browser (GitHub Pages)
    ↓  fetchViaWorker('/events/slug/...')
Cloudflare Worker  (adds correct headers, bypasses CORS)
    ↓  fetch('https://gamma-api.polymarket.com/...')
Polymarket API
```

The Cloudflare free tier allows 100,000 requests/day — more than enough for personal use.
