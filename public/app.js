const MOODS = {
  green:  { emoji: "🟢", label: "Bonne humeur", value: 1 },
  yellow: { emoji: "🟡", label: "Accepte les blagues mais pas plus", value: 2 },
  orange: { emoji: "🟠", label: "Ne le brusquez pas", value: 3 },
  red:    { emoji: "🔴", label: "Fuyez pauvre fou", value: 4 },
  null:   { emoji: "⚫", label: "On sait pas", value: 0 }
};

let intervalId = null;

function renderMood(data) {
  const moodKey = data.mood ?? 0;
  const mood = Object.keys(MOODS)
    .map(key => MOODS[key])
    .find(({ value }) => moodKey === value);

  document.getElementById("mood").textContent = mood.emoji;
  document.getElementById("label").textContent = mood.label;
}

async function refresh() {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    renderMood(data);

  } catch (err) {
    console.error("refresh failed:", err);
    renderMood({ mood: null });
  }
}

async function vote(mood) {
  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: MOODS[mood].value }),
    });

    if (!res.ok) throw new Error("vote failed");

    await refresh();

  } catch (err) {
    console.error(err);
    alert("Vote impossible pour le moment");
  }
}

function bindUI() {
  document.querySelectorAll("[data-mood]").forEach((btn) => {
    btn.addEventListener("click", () => {
      vote(btn.dataset.mood);
    });
  });
}

function start() {
  bindUI();
  refresh();

  intervalId = setInterval(refresh, 60000);
}

window.addEventListener("beforeunload", () => {
  if (intervalId) clearInterval(intervalId);
});

start();