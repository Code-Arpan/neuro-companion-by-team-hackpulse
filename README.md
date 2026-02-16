# 🧠 Neuro Companion

**Neuro Companion** is a fast, privacy-first AI assistant designed to help neurodivergent users (ADHD, Autism, Dyslexia) overcome task paralysis by breaking overwhelming goals into tiny, actionable “micro-wins” using **Google Gemini 3 Flash**.

---

## ✨ Features

* ⚡ Ultra-fast AI task breakdown (<3s locally)
* 🎤 Text + Voice input support (Web Speech API)
* 🧠 Neuro-inclusive single-task UI
* 🔐 Local-first privacy design (no PII sent)
* 🎯 Graceful fallback & error handling

---

## 🌐 Supported Browsers

For full functionality (especially **voice input**), please use:

✅ **Google Chrome**
✅ **Microsoft Edge**

Voice input may **not work properly** on Firefox, Safari, or other browsers due to Web Speech API limitations.

---

## 🏗️ Tech Stack

* React + TypeScript + Vite
* TailwindCSS
* Google Gemini 3 Flash API
* Web Speech API
* Docker

---

## 🚀 Run Locally (Fastest)

1. Install dependencies:

```
npm install
```

2. Add your Gemini API key in `.env.local`:

```
GEMINI_API_KEY=your_api_key_here
```

3. Start the app:

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🐳 Run Using Docker (For Submission)

### Build image

```
docker build -t neuro-companion .
```

### Run container

```
docker run -p 3000:3000 --env-file .env.local neuro-companion
```

Open:

```
http://localhost:3000
```

---

## ⚡ Performance Note

* Running with `npm run dev` is **very fast** because the app runs directly on the host machine.
* Running inside Docker may feel **slightly slower on Windows systems** due to container virtualization and network overhead.

This is expected and does not affect functionality. Docker is included to ensure isolated, conflict-free execution for judging.

---

## ⚙️ How It Works

1. User enters a task via text or voice
2. Input is processed locally for privacy
3. Gemini 3 Flash generates micro-steps
4. UI displays one step at a time

---

## 🏆 Built For

**Neurathon Hackathon — The Smart Companion Problem Statement**

---

👥 Team - HackPulse