import React, { useEffect, useState } from "react";
import { request } from "../../util/request"; // ✅ ប្រើ request() មិនមែន axios ដោយផ្ទាល់
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* ── Inject CSS once ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.db-root { font-family: 'Outfit', sans-serif; }
.db-root * { box-sizing: border-box; }

.db-card {
  transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
  cursor: default;
}
.db-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 52px rgba(0,0,0,0.35) !important;
}

.db-chart-card { transition: box-shadow 0.22s ease; }
.db-chart-card:hover { box-shadow: 0 20px 48px rgba(0,0,0,0.32) !important; }

@keyframes db-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.db-shimmer {
  background: linear-gradient(90deg, #1a1d27 25%, #22263a 50%, #1a1d27 75%);
  background-size: 800px 100%;
  animation: db-shimmer 1.4s infinite;
  border-radius: 8px;
}

@keyframes db-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
.db-up  { animation: db-up 0.45s ease both; }
.db-d1  { animation-delay: 0.05s; }
.db-d2  { animation-delay: 0.12s; }
.db-d3  { animation-delay: 0.19s; }
.db-d4  { animation-delay: 0.26s; }
.db-d5  { animation-delay: 0.33s; }
.db-d6  { animation-delay: 0.40s; }

.db-root ::-webkit-scrollbar { width: 4px; height: 4px; }
.db-root ::-webkit-scrollbar-track { background: #0d0e14; }
.db-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }

@keyframes db-count { from { opacity:0; } to { opacity:1; } }
.db-num { animation: db-count 0.5s ease both; }
`;

if (typeof document !== "undefined" && !document.getElementById("db-css")) {
  const el = document.createElement("style");
  el.id = "db-css";
  el.textContent = CSS;
  document.head.appendChild(el);
}

const T = {
  bg:     "#0d0e14",
  card:   "#13151e",
  card2:  "#161922",
  border: "#1e2130",
  txt1:   "#e8eaf6",
  txt2:   "#6b7280",
  txt3:   "#9ca3af",
};

const CARDS = [
  {
    key: "totalSales",
    label: "Total Sales",
    prefix: "$",
    color: "#00c9a7",
    glow: "rgba(0,201,167,0.18)",
    light: "#00c9a715",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    trend: "+12.5%", trendUp: true,
  },
  {
    key: "totalExpense",
    label: "Total Expense",
    prefix: "$",
    color: "#f87171",
    glow: "rgba(248,113,113,0.18)",
    light: "#f8717115",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    trend: "-3.2%", trendUp: false,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    prefix: "",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.18)",
    light: "#60a5fa15",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    trend: "+8.1%", trendUp: true,
  },
  {
    key: "totalProducts",
    label: "Total Products",
    prefix: "",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
    light: "#f59e0b15",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    trend: "+5.4%", trendUp: true,
  },
];

const StatCard = ({ config, value, delay }) => (
  <div className={`db-card db-up db-d${delay}`} style={{
    flex: 1, minWidth: 210,
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 18,
    padding: "22px 24px",
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", right: -24, top: -24,
      width: 100, height: 100, borderRadius: "50%",
      background: config.glow, filter: "blur(20px)",
      pointerEvents: "none",
    }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: config.light,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: config.color,
      }}>
        {config.icon}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.3px",
        padding: "4px 10px", borderRadius: 20,
        background: config.trendUp ? "#00c9a712" : "#f8717112",
        color: config.trendUp ? "#00c9a7" : "#f87171",
      }}>
        {config.trend}
      </span>
    </div>
    <div className="db-num" style={{ fontSize: 30, fontWeight: 800, color: T.txt1, lineHeight: 1, marginBottom: 6 }}>
      {config.prefix}{typeof value === "number" ? value.toLocaleString() : value}
    </div>
    <div style={{ fontSize: 12, color: T.txt2, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
      {config.label}
    </div>
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, ${config.color}, transparent)`,
      borderRadius: "0 0 18px 18px",
    }} />
  </div>
);

const ChartCard = ({ title, subtitle, children, flex = 1, minWidth = 300, delay = 5 }) => (
  <div className={`db-chart-card db-up db-d${delay}`} style={{
    flex, minWidth,
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 18,
    padding: "22px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
  }}>
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: T.txt1 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: T.txt2, marginTop: 3, fontWeight: 500 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

/* ─────────────── MAIN ─────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpense: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const [charts, setCharts] = useState({
    sales:  { labels: [], data: [] },
    orders: { labels: [], data: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ ប្រើ request() — auto attach Bearer token + ប្រើ base_url ត្រឹមត្រូវ
        // ❌ មុន: axios.get("http://localhost:8000/api/dashboard") — គ្មាន token
        const data = await request("dashboard", "get");

        console.log("Dashboard API Response:", data);

        if (data && !data.errors) {
          setStats({
            totalSales:    parseFloat(data.stats?.totalSales    ?? 0),
            totalExpense:  parseFloat(data.stats?.totalExpense  ?? 0),
            totalOrders:   data.stats?.totalOrders   ?? 0,
            totalProducts: data.stats?.totalProducts ?? 0,
          });

          setCharts({
            sales:  {
              labels: data.weeklySales?.labels      ?? [],
              data:   data.weeklySales?.data        ?? [],
            },
            orders: {
              labels: data.ordersByCategory?.labels ?? [],
              data:   data.ordersByCategory?.data   ?? [],
            },
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const salesData = {
    labels: charts.sales.labels,
    datasets: [{
      label: "Sales ($)",
      data: charts.sales.data,
      borderColor: "#00c9a7",
      backgroundColor: "rgba(0,201,167,0.08)",
      borderWidth: 2.5,
      tension: 0.45,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#00c9a7",
      pointBorderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
    }],
  };

  const ordersData = {
    labels: charts.orders.labels,
    datasets: [{
      label: "Orders",
      data: charts.orders.data,
      backgroundColor: ["#60a5fa", "#f59e0b", "#f87171", "#a78bfa", "#34d399"],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartBaseOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#6b7280",
          font: { family: "Outfit", size: 12, weight: "600" },
          boxWidth: 12, boxHeight: 12, borderRadius: 4,
        },
      },
      tooltip: {
        backgroundColor: "#1a1d27",
        borderColor: "#2a2d3e",
        borderWidth: 1,
        titleColor: "#e8eaf6",
        bodyColor: "#9ca3af",
        titleFont: { family: "Outfit", size: 13, weight: "700" },
        bodyFont:  { family: "Outfit", size: 12 },
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid:  { color: "#1e2130", drawBorder: false },
        ticks: { color: "#6b7280", font: { family: "Outfit", size: 11 } },
        border: { dash: [4, 4] },
      },
      y: {
        grid:  { color: "#1e2130", drawBorder: false },
        ticks: { color: "#6b7280", font: { family: "Outfit", size: 11 } },
        border: { dash: [4, 4] },
      },
    },
  };

  return (
    <div className="db-root" style={{ minHeight: "100%", padding: "4px 0" }}>
{/* 
      <div className="db-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: T.txt1, margin: 0, letterSpacing: "-0.4px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: T.txt2, marginTop: 5, fontWeight: 500 }}>
          Welcome back — here's what's happening today.
        </p>
      </div> */}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        {CARDS.map((c, i) => (
          <StatCard key={c.key} config={c} value={stats[c.key]} delay={i + 1} />
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <ChartCard title="Weekly Sales" subtitle="Revenue trend over the past 7 days" flex={2} minWidth={400} delay={5}>
          <Line data={salesData} options={chartBaseOptions} />
        </ChartCard>
        <ChartCard title="Orders by Category" subtitle="Distribution across product categories" flex={1} minWidth={300} delay={6}>
          <Bar data={ordersData} options={chartBaseOptions} />
        </ChartCard>
      </div>

    </div>
  );
};

export default Dashboard;
