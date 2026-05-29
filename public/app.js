const MOODS = {
  green:  { emoji: "🟢", label: "Bonne humeur", value: 1 },
  yellow: { emoji: "🟡", label: "Accepte les blagues mais pas plus", value: 2 },
  orange: { emoji: "🟠", label: "Ne le brusquez pas", value: 3 },
  red:    { emoji: "🔴", label: "Fuyez pauvre fou", value: 4 },
  null:   { emoji: "⚫", label: "On sait pas", value: 0 }
};

let intervalId = null;
let chartInstance = null;

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
  loadHistoryChart();

  intervalId = setInterval(() => {
    refresh();
    loadHistoryChart();
  }, 60000);
}

window.addEventListener("beforeunload", () => {
  if (intervalId) clearInterval(intervalId);
});

async function loadHistoryChart() {
  try {
    const res = await fetch("/api/history");
    const history = await res.json();

    const labels = history.map(h =>
      h.hour.split("-").slice(3,5).join("h") + "h"
    );

    const data1 = history.map(h => h[1]);
    const data2 = history.map(h => h[2]);
    const data3 = history.map(h => h[3]);
    const data4 = history.map(h => h[4]);

    renderChart(labels, data1, data2, data3, data4);

  } catch (err) {
    console.error("chart error:", err);
  }
}

function renderChart(labels, d1, d2, d3, d4) {
  const ctx = document.getElementById("moodChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "🟢",
          data: d1,
          backgroundColor: "#2ecc71"
        },
        {
          label: "🟡",
          data: d2,
          backgroundColor: "#f1c40f"
        },
        {
          label: "🟠",
          data: d3,
          backgroundColor: "#e67e22"
        },
        {
          label: "🔴",
          data: d4,
          backgroundColor: "#e74c3c"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: "white" }
        },
        y: {
          stacked: true,
          ticks: { color: "white" }
        }
      }
    }
  });
}

start();