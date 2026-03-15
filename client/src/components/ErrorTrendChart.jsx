import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);
export default function ErrorTrendChart({ trends }) {
  if (!trends?.length) return null;
  return (
    <div style={{ height: "200px" }}>
      <Line
        data={{ labels: trends.map(t => t._id), datasets: [{ label: "Errors", data: trends.map(t => t.count), borderColor: "rgb(59,130,246)", backgroundColor: "rgba(59,130,246,0.1)", tension: 0.4, fill: true, pointBackgroundColor: "rgb(59,130,246)", pointRadius: 4, pointHoverRadius: 6 }] }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.parsed.y} error${c.parsed.y !== 1 ? "s" : ""}` } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#9ca3af" } }, y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 }, color: "#9ca3af" }, grid: { color: "rgba(156,163,175,0.15)" } } } }}
      />
    </div>
  );
}
