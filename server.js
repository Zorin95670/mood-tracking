const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const votes = {};

// uniquement valeurs numériques
// 1 = green, 2 = yellow, 3 = orange, 4 = red

function getHourKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`;
}

function getClientIp(req) {
  const raw =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  return raw.split(",")[0].trim();
}

function calculateMood(allVotes) {
  let total = 0;
  let count = 0;

  for (const ip in allVotes) {
    const value = allVotes[ip];

    if (![1,2,3,4].includes(value)) continue;

    total += value;
    count++;
  }

  if (count === 0) {
    return { mood: null, totalVotes: 0 };
  }

  const avg = total / count;

  let finalMood = 1;

  if (avg >= 3.5) finalMood = 4;
  else if (avg >= 2.5) finalMood = 3;
  else if (avg >= 1.5) finalMood = 2;
  else finalMood = 1;

  return {
    mood: finalMood,
    totalVotes: count
  };
}

/**
 * POST vote (NUMERIC ONLY)
 */
app.post("/api/vote", (req, res) => {
  const { mood } = req.body;
  const ip = getClientIp(req);
  const key = getHourKey();

  const value = Number(mood);

  if (![1,2,3,4].includes(value)) {
    return res.status(400).json({ error: "invalid mood value" });
  }

  if (!votes[key]) {
    votes[key] = {};
  }

  votes[key][ip] = value;

  res.json({ ok: true });
});

/**
 * GET status
 */
app.get("/api/status", (req, res) => {
  const key = getHourKey();
  const data = votes[key] || {};

  const result = calculateMood(data);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/history", (req, res) => {
  const result = [];

  for (const hourKey of Object.keys(votes)) {
    const data = votes[hourKey];

    const counters = { 1: 0, 2: 0, 3: 0, 4: 0 };

    let total = 0;
    let count = 0;

    for (const ip in data) {
      const v = data[ip];
      if (![1,2,3,4].includes(v)) continue;

      counters[v]++;
      total += v;
      count++;
    }

    let finalMood = null;
    if (count > 0) {
      const avg = total / count;

      if (avg >= 3.5) finalMood = 4;
      else if (avg >= 2.5) finalMood = 3;
      else if (avg >= 1.5) finalMood = 2;
      else finalMood = 1;
    }

    result.push({
      hour: hourKey,
      ...counters,
      finalMood
    });
  }

  result.sort((a, b) => a.hour.localeCompare(b.hour));

  res.json(result);
});