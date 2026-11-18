import React, { useEffect, useState } from "react";
import {
    DatePicker,
    Select,
    Button,
    Table,
    Space
} from "antd";
import { Line, Pie } from "@ant-design/plots";
import { request } from "../../util/request";
// ── EXPORT (unchanged logic) ──
import Config from "../../util/config";
import profileStore from "../../Store/profileStore";

import {
    ShoppingCartOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    SearchOutlined,
    RiseOutlined
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

/* ─────────────────────────────────────────
   INLINE STYLES  (no extra CSS file needed)
───────────────────────────────────────── */
const S = {
    page: {
        minHeight: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e8eaf0",
    },

    /* ── Top bar ── */
    topBar: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: "-0.5px",
        color: "#fff",
        margin: 0,
        lineHeight: 1,
    },
    pageSub: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 6,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
    },

    /* ── Filter bar ── */
    filterBar: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#1a1d27",
        border: "1px solid #2a2d3d",
        borderRadius: 12,
        padding: "14px 20px",
        marginBottom: 28,
    },
    filterLabel: {
        fontSize: 11,
        color: "#6b7280",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginRight: 8,
        whiteSpace: "nowrap",
    },
    divider: {
        width: 1,
        height: 28,
        background: "#2a2d3d",
        margin: "0 8px",
    },

    /* ── Stat cards ── */
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
    },
    statCard: (accent) => ({
        background: "#1a1d27",
        border: "1px solid #2a2d3d",
        borderRadius: 14,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        borderTop: `3px solid ${accent}`,
        transition: "transform 0.2s",
        cursor: "default",
    }),
    statAccentBlob: (accent) => ({
        position: "absolute",
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: accent,
        opacity: 0.08,
        pointerEvents: "none",
    }),
    statIcon: (accent) => ({
        width: 38,
        height: 38,
        borderRadius: 10,
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: accent,
        marginBottom: 14,
    }),
    statValue: {
        fontSize: 26,
        fontWeight: 800,
        color: "#fff",
        lineHeight: 1,
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 11,
        color: "#6b7280",
        letterSpacing: "0.8px",
        textTransform: "uppercase",
    },

    /* ── Charts row ── */
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: 24,
    },
    chartCard: {
        background: "#1a1d27",
        border: "1px solid #2a2d3d",
        borderRadius: 14,
        padding: "22px 24px",
    },
    chartTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.3px",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    chartTitleDot: (color) => ({
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
    }),

    /* ── Table card ── */
    tableCard: {
        background: "#1a1d27",
        border: "1px solid #2a2d3d",
        borderRadius: 14,
        padding: "22px 24px",
    },
    tableHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    tableTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: "#fff",
    },
    tableCount: {
        fontSize: 11,
        color: "#6b7280",
        background: "#0f1117",
        border: "1px solid #2a2d3d",
        borderRadius: 20,
        padding: "3px 12px",
    },

    /* ── Badges ── */
    badge: (bg, color) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color: color,
        textTransform: "capitalize",
    }),

    /* ── Buttons ── */
    btnPrimary: {
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none",
        borderRadius: 8,
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
        height: 36,
        padding: "0 18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    btnPdf: {
        background: "#1e293b",
        border: "1px solid #ef4444",
        borderRadius: 8,
        color: "#ef4444",
        fontWeight: 600,
        fontSize: 13,
        height: 36,
        padding: "0 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    btnExcel: {
        background: "#1e293b",
        border: "1px solid #22c55e",
        borderRadius: 8,
        color: "#22c55e",
        fontWeight: 600,
        fontSize: 13,
        height: 36,
        padding: "0 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
};

/* ─────────────────────────────────────────
   ANT DESIGN DARK OVERRIDES (injected once)
───────────────────────────────────────── */
const darkStyles = `
  .report-dark .ant-table { background: transparent !important; }
  .report-dark .ant-table-thead > tr > th {
    background: #0f1117 !important;
    color: #6b7280 !important;
    border-bottom: 1px solid #2a2d3d !important;
    font-size: 11px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .report-dark .ant-table-tbody > tr > td {
    background: transparent !important;
    border-bottom: 1px solid #1f2235 !important;
    color: #d1d5db !important;
    font-size: 13px;
  }
  .report-dark .ant-table-tbody > tr:hover > td {
    background: #1f2235 !important;
  }
  .report-dark .ant-pagination .ant-pagination-item a { color: #6b7280; }
  .report-dark .ant-pagination .ant-pagination-item-active { border-color: #6366f1; }
  .report-dark .ant-pagination .ant-pagination-item-active a { color: #6366f1; }
  .report-dark .ant-select-selector {
    background: #0f1117 !important;
    border-color: #2a2d3d !important;
    color: #d1d5db !important;
    border-radius: 8px !important;
    height: 36px !important;
  }
  .report-dark .ant-select-selection-placeholder { color: #6b7280 !important; }
  .report-dark .ant-picker {
    background: #0f1117 !important;
    border-color: #2a2d3d !important;
    color: #d1d5db !important;
    border-radius: 8px !important;
    height: 36px !important;
  }
  .report-dark .ant-picker input { color: #d1d5db !important; }
  .report-dark .ant-picker-separator,
  .report-dark .ant-picker-suffix { color: #6b7280 !important; }
`;

/* inject once */
if (typeof document !== "undefined" && !document.getElementById("report-dark-css")) {
    const el = document.createElement("style");
    el.id = "report-dark-css";
    el.textContent = darkStyles;
    document.head.appendChild(el);
}

/* ─────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────── */
const StatCard = ({ icon, label, value, accent, prefix = "" }) => (
    <div style={S.statCard(accent)}>
        <div style={S.statAccentBlob(accent)} />
        <div style={S.statIcon(accent)}>{icon}</div>
        <div style={S.statValue}>{prefix}{typeof value === "number" ? value.toLocaleString() : value}</div>
        <div style={S.statLabel}>{label}</div>
    </div>
);

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        approved:  { bg: "#14532d33", color: "#4ade80", dot: "#4ade80" },
        pending:   { bg: "#78350f33", color: "#fbbf24", dot: "#fbbf24" },
        cancelled: { bg: "#7f1d1d33", color: "#f87171", dot: "#f87171" },
    };
    const s = map[status] || { bg: "#1f2235", color: "#9ca3af", dot: "#9ca3af" };
    return (
        <span style={S.badge(s.bg, s.color)}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
            {status}
        </span>
    );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const ReportPage = () => {
    // ── STATE (unchanged logic) ──
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [weeklySales, setWeeklySales] = useState([]);
    const [statusChart, setStatusChart] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchReport(); }, []);

    // ── FETCH (unchanged logic) ──
    const fetchReport = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (status) params.append("status", status);
        const url = `reports${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await request(url, "get");
        if (res) {
            setData(res.list || []);
            setSummary(res.summary || {});
            setWeeklySales(res.weeklySales || []);
            setStatusChart(res.statusChart || []);
        }
        setLoading(false);
    };

    const exportPdf = () => {
        const token = profileStore.getState().access_token;
        let params = [];
        if (from) params.push(`from=${from}`);
        if (to) params.push(`to=${to}`);
        if (status) params.push(`status=${status}`);
        // ✅ pass token ក្នុង query string
        params.push(`token=${token}`);
        const url = Config.base_url + "reports/pdf" + (params.length ? "?" + params.join("&") : "");
        window.open(url, "_blank");
    };

    const exportExcel = () => {
        const token = profileStore.getState().access_token;
        let params = [];
        if (from) params.push(`from=${from}`);
        if (to) params.push(`to=${to}`);
        if (status) params.push(`status=${status}`);
        params.push(`token=${token}`);
        const url = Config.base_url + "reports/excel" + (params.length ? "?" + params.join("&") : "");
        window.open(url, "_blank");
    };

    // ── TABLE COLUMNS ──
    const columns = [
        {
            title: "Order ID",
            dataIndex: "id",
            width: 90,
            render: (id) => (
                <span style={{ fontWeight: 700, color: "#818cf8", fontFamily: "monospace", fontSize: 13 }}>
                    #{id}
                </span>
            ),
        },
        {
            title: "Customer",
            dataIndex: "buyer_name",
            render: (name) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {name ? name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{name}</span>
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "buyer_phone",
            render: (v) => <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{v}</span>,
        },
        {
            title: "Total",
            dataIndex: "total",
            render: (t) => (
                <span style={{ fontWeight: 700, color: "#4ade80", fontSize: 13 }}>
                    ${Number(t).toLocaleString()}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s) => <StatusBadge status={s} />,
        },
        {
            title: "Date",
            dataIndex: "created_at",
            render: (d) => <span style={{ color: "#64748b", fontSize: 12 }}>{d?.slice(0, 10)}</span>,
        },
    ];

    // ── CHART CONFIGS ──
    const salesConfig = {
        data: weeklySales,
        xField: "date",
        yField: "total",
        smooth: true,
        point: { size: 4, style: { fill: "#6366f1", stroke: "#818cf8", lineWidth: 2 } },
        line: { style: { stroke: "#6366f1", lineWidth: 2.5 } },
        area: { style: { fill: "l(270) 0:#6366f100 1:#6366f130" } },
        xAxis: { label: { style: { fill: "#6b7280", fontSize: 11 } }, line: { style: { stroke: "#2a2d3d" } } },
        yAxis: { label: { style: { fill: "#6b7280", fontSize: 11 } }, grid: { line: { style: { stroke: "#1f2235" } } } },
        tooltip: { domStyles: { "g2-tooltip": { background: "#1a1d27", border: "1px solid #2a2d3d", color: "#e2e8f0", borderRadius: 8 } } },
        theme: "dark",
    };

    const pieConfig = {
        data: statusChart,
        angleField: "value",
        colorField: "type",
        radius: 0.82,
        innerRadius: 0.55,
        color: ["#4ade80", "#fbbf24", "#f87171"],
        label: { type: "outer", style: { fill: "#9ca3af", fontSize: 11 } },
        legend: { position: "bottom", itemName: { style: { fill: "#9ca3af", fontSize: 12 } } },
        statistic: {
            title: { style: { color: "#fff", fontSize: 13, fontWeight: 700 }, content: "Orders" },
            content: { style: { color: "#6b7280", fontSize: 12 } },
        },
        tooltip: { domStyles: { "g2-tooltip": { background: "#1a1d27", border: "1px solid #2a2d3d", color: "#e2e8f0", borderRadius: 8 } } },
        theme: "dark",
    };

    // ── RENDER ──
    return (
        <div style={S.page} className="report-dark">

            {/* ── TOP BAR ── */}
            <div style={S.topBar}>
                <div>
                    <h1 style={S.pageTitle}>Order Report</h1>
                    <p style={S.pageSub}>Analytics &amp; performance overview</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button style={S.btnPdf} onClick={exportPdf}>
                        <FilePdfOutlined /> Export PDF
                    </button>
                    <button style={S.btnExcel} onClick={exportExcel}>
                        <FileExcelOutlined /> Export Excel
                    </button>
                </div>
            </div>

            {/* ── FILTER BAR ── */}
            <div style={S.filterBar}>
                <span style={S.filterLabel}>Filter</span>
                <RangePicker
                    style={{ background: "#0f1117", borderColor: "#2a2d3d" }}
                    onChange={(dates, dateStrings) => {
                        setFrom(dateStrings[0]);
                        setTo(dateStrings[1]);
                    }}
                />
                <Select
                    placeholder="All Status"
                    style={{ width: 140 }}
                    allowClear
                    onChange={(v) => setStatus(v || "")}
                >
                    <Option value="approved">Approved</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
                <button style={S.btnPrimary} onClick={fetchReport}>
                    <SearchOutlined /> Search
                </button>
            </div>

            {/* ── STAT CARDS ── */}
            <div style={S.statsGrid}>
                <StatCard
                    icon={<ShoppingCartOutlined />}
                    label="Total Orders"
                    value={summary.totalOrders || 0}
                    accent="#6366f1"
                />
                <StatCard
                    icon={<DollarOutlined />}
                    label="Total Revenue"
                    value={`$${Number(summary.revenue || 0).toLocaleString()}`}
                    accent="#f59e0b"
                />
                <StatCard
                    icon={<CheckCircleOutlined />}
                    label="Approved"
                    value={summary.approved || 0}
                    accent="#22c55e"
                />
                <StatCard
                    icon={<CloseCircleOutlined />}
                    label="Cancelled"
                    value={summary.cancelled || 0}
                    accent="#ef4444"
                />
            </div>

            {/* ── CHARTS ── */}
            <div style={S.chartsRow}>
                <div style={S.chartCard}>
                    <div style={S.chartTitle}>
                        <span style={S.chartTitleDot("#6366f1")} />
                        Weekly Sales Trend
                        <RiseOutlined style={{ color: "#6366f1", marginLeft: "auto", fontSize: 14 }} />
                    </div>
                    <Line {...salesConfig} height={220} />
                </div>
                <div style={S.chartCard}>
                    <div style={S.chartTitle}>
                        <span style={S.chartTitleDot("#f59e0b")} />
                        Order Status Distribution
                    </div>
                    <Pie {...pieConfig} height={220} />
                </div>
            </div>

            {/* ── TABLE ── */}
            <div style={S.tableCard}>
                <div style={S.tableHeader}>
                    <span style={S.tableTitle}>Order Details</span>
                    <span style={S.tableCount}>{data.length} records</span>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        style: { marginTop: 16 },
                    }}
                    style={{ background: "transparent" }}
                />
            </div>

        </div>
    );
};

export default ReportPage;