# Mood Tracking App 😶‍🌫️

A lightweight real-time mood voting web application built with **Node.js + Express + vanilla frontend + Chart.js**.

This project is intentionally **not meant to be taken seriously**. It is a playful system that aggregates “emotional state” votes and displays them in real time.

---

## ⚠️ Disclaimer

This application is purely **humorous / experimental**.  
It does not measure real emotions, psychological states, or any factual sentiment.  
It is designed for fun, demos, or chaotic internal tools.

---

## 🚀 Features

- Live mood status based on user votes
- Anonymous voting system (IP-based per hour)
- Real-time refresh every minute
- Historical mood chart (stacked bar chart)
- Simple static frontend (no framework)
- Lightweight Express backend

---

## 🧠 Mood System

The system supports 4 mood levels:

| Value | Mood    | Meaning |
|------|--------|---------|
| 1 | 🟢 Green | Good mood |
| 2 | 🟡 Yellow | Tolerates jokes, but limited |
| 3 | 🟠 Orange | Handle with care |
| 4 | 🔴 Red | Avoid interaction |

Unknown state is represented as ⚫.

---

## 📁 Project Structure

```

public/
app.js        # Frontend logic
style.css     # UI styling
index.html    # Main page
images/       # Mood images (IMPORTANT)
server.js       # Express backend

```

---

## 🖼️ Mood Images Setup (IMPORTANT)

You must place mood images inside:

```

public/images/

```

And name them exactly as follows:

```

public/images/1.png   → 🟢 Green mood
public/images/2.png   → 🟡 Yellow mood
public/images/3.png   → 🟠 Orange mood
public/images/4.png   → 🔴 Red mood
public/images/unknown.png → ⚫ Unknown state

````

If these files are missing, the UI will still work but images will not display correctly.

---

## 🛠️ Installation

### 1. Install dependencies

```bash
npm install express
````

### 2. Run the server

```bash
node server.js
```

### 3. Open in browser

```
http://localhost:3000
```

---

## 📡 API Endpoints

### `POST /api/vote`

Submit a mood vote.

```json
{
  "mood": 1
}
```

Valid values:

* 1 = green
* 2 = yellow
* 3 = orange
* 4 = red

---

### `GET /api/status`

Returns current aggregated mood:

```json
{
  "mood": 2,
  "totalVotes": 12
}
```

---

### `GET /api/history`

Returns hourly mood history used for chart rendering.

---

## 📊 Frontend

* Built with vanilla JavaScript
* Uses Chart.js for visualization
* Auto-refresh every 60 seconds
* Interactive mood voting buttons

---

## 🔒 Privacy

Votes are tracked using IP address per hour only.
No persistent user identification is implemented.

---

## 📜 License

This project is licensed under the **GNU Affero General Public License (AGPL-3.0)**.

You are free to use, modify, and distribute it under the same license conditions.
If you deploy it publicly, you must also provide access to the source code.

---

## 💀 Final Note

This system is not serious, not scientific, and not emotionally aware.
It is a glorified mood roulette with charts.

Enjoy responsibly.
