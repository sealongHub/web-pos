import React, { useEffect, useState } from 'react';
import { Table, Space, Input, DatePicker, Row, Col, Tooltip } from 'antd';
import {
  ReloadOutlined, FileTextOutlined, DatabaseOutlined,
  UserOutlined, HistoryOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import { request } from '../../util/request_fixed';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

/* ── Inject CSS once (shared id) ── */
if (typeof document !== 'undefined' && !document.getElementById('rp-role-css')) {
  const el = document.createElement('style');
  el.id = 'rp-role-css';
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Outfit:wght@400;500;600;700;800&display=swap');
.rp-root { font-family: 'Battambang', 'Outfit', sans-serif !important; }
.rp-root * { box-sizing: border-box; font-family: 'Battambang', 'Outfit', sans-serif !important; }
.rp-root .ant-table { background: transparent !important; }
.rp-root .ant-table-thead > tr > th {
  background: #0d0e14 !important; color: #4b5563 !important;
  border-bottom: 1px solid #1e2130 !important; font-size: 10.5px !important;
  letter-spacing: 1px !important; text-transform: uppercase !important;
  font-weight: 800 !important; padding: 12px 16px !important;
}
.rp-root .ant-table-tbody > tr > td {
  background: transparent !important; border-bottom: 1px solid #1a1d27 !important;
  color: #d1d5db !important; padding: 13px 16px !important; font-size: 13px !important;
}
.rp-root .ant-table-tbody > tr:hover > td { background: #13151e !important; }
.rp-root .ant-table-placeholder { background: transparent !important; }
.rp-root .ant-empty-description { color: #4b5563 !important; }
.rp-root .ant-pagination .ant-pagination-item a { color: #6b7280 !important; }
.rp-root .ant-pagination .ant-pagination-item-active { background: #5b6af0 !important; border-color: #5b6af0 !important; }
.rp-root .ant-pagination .ant-pagination-item-active a { color: #fff !important; }
.rp-root .ant-pagination-prev .ant-pagination-item-link,
.rp-root .ant-pagination-next .ant-pagination-item-link { color: #6b7280 !important; background: transparent !important; border-color: #1e2130 !important; }
.rp-root .ant-pagination-total-text { color: #4b5563 !important; font-size: 12px !important; }
.rp-root .ant-select-selector {
  background: #13151e !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important;
}
.rp-root .ant-select-selection-placeholder { color: #4b5563 !important; }
.rp-root .ant-select-arrow { color: #4b5563 !important; }
.rp-root .ant-picker {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; height: 38px !important;
}
.rp-root .ant-picker input { color: #d1d5db !important; font-size: 13px !important; }
.rp-root .ant-picker .ant-picker-suffix { color: #4b5563 !important; }
.rp-root .ant-picker .ant-picker-separator { color: #4b5563 !important; }
/* RangePicker specific overrides to ensure visible text and subtle placeholder */
.rp-root .rp-range-picker .ant-picker-input > input { color: #e8eaf6 !important; font-size: 13px !important; }
.rp-root .rp-range-picker .ant-picker-input > input::placeholder { color: #9ca3af !important; }
.rp-root .rp-range-picker .ant-picker-suffix, .rp-root .rp-range-picker .ant-picker-separator { color: #4b5563 !important; }
.rp-root .ant-picker:hover, .rp-root .ant-picker-focused { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-root .ant-picker-dropdown .ant-picker-panel-container { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.rp-root .ant-picker-dropdown .ant-picker-header { color: #e8eaf6 !important; border-bottom: 1px solid #1e2130 !important; }
.rp-root .ant-picker-dropdown .ant-picker-cell-in-view { color: #d1d5db !important; }
.rp-root .ant-picker-dropdown .ant-picker-cell-selected .ant-picker-cell-inner { background: #5b6af0 !important; }
.rp-root .ant-tooltip-inner { background: #1a1d27 !important; border: 1px solid #1e2130 !important; color: #d1d5db !important; font-size: 12px !important; }
@keyframes rp-bar {
  0% { left: -40%; width: 40%; } 50% { left: 20%; width: 60%; } 100% { left: 110%; width: 40%; }
}
.rp-progress-bar { position: relative; height: 3px; background: #1e2130; border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
.rp-progress-bar-inner {
  position: absolute; top: 0; height: 100%;
  background: linear-gradient(90deg, #5b6af0, #818cf8, #a78bfa);
  border-radius: 3px; animation: rp-bar 1.2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(129,140,248,0.6);
}
.rp-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 16px; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all 0.18s;
}
.rp-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.rp-btn-filter  { background: #13151e; color: #60a5fa; border: 1px solid #1e354a !important; }
.rp-btn-primary { background: linear-gradient(135deg,#5b6af0,#818cf8); color: #fff; box-shadow: 0 4px 14px rgba(91,106,240,0.3); }
@keyframes rp-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.rp-up { animation: rp-up 0.38s ease both; }
.rp-root ::-webkit-scrollbar { width: 4px; height: 4px; }
.rp-root ::-webkit-scrollbar-track { background: #0d0e14; }
.rp-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }
`;
  document.head.appendChild(el);
}

/* ─────────────── MAIN ─────────────── */
const StockHistory = () => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState([]);
  const [summary, setSummary] = useState({
    cost_in: 0, sale_out: 0, total_qty_in: 0, total_qty_out: 0, qty_balance: 0
  });
  const [filter, setFilter] = useState({ text_search: "", date_range: null });

  useEffect(() => { fetchHistory(); }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await request('stock-transaction', 'get');
      if (res && res.list) {
        const list = res.list;
        setData(list);
        const costIn  = list.filter(i => i.type === 'in').reduce((a, b) => a + (Number(b.quantity) * Number(b.cost_price)), 0);
        const saleOut = list.filter(i => i.type === 'out').reduce((a, b) => a + (Number(b.quantity) * Number(b.cost_price)), 0);
        const qtyIn   = list.filter(i => i.type === 'in').reduce((a, b) => a + Number(b.quantity), 0);
        const qtyOut  = list.filter(i => i.type === 'out').reduce((a, b) => a + Number(b.quantity), 0);
        setSummary({ cost_in: costIn, sale_out: saleOut, total_qty_in: qtyIn, total_qty_out: qtyOut, qty_balance: qtyIn - qtyOut });
      }
    } catch (error) {
      console.error("Fetch History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ── COLUMNS ── */
  const columns = [
    {
      title: 'Reference / Date', key: 'ref', width: 200,
      render: (record) => (
        <div>
          <div style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color: record.type === 'in' ? '#4ade80' : '#f87171' }}>
            {record.type === 'in' ? 'INV-IN-' : 'ORD-OUT-'}{record.id.toString().padStart(5, '0')}
          </div>
          <div style={{ fontSize:11, color:'#4b5563', marginTop:3, display:'flex', alignItems:'center', gap:4 }}>
            <HistoryOutlined style={{ fontSize:10 }} />
            {dayjs(record.created_at).format('DD MMM YYYY | hh:mm A')}
          </div>
        </div>
      ),
    },
    {
      title: 'Product', dataIndex: 'product', key: 'product',
      render: (product) => (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:'#818cf815', border:'1px solid #818cf825', display:'flex', alignItems:'center', justifyContent:'center', color:'#818cf8', fontSize:14, flexShrink:0 }}>
            <DatabaseOutlined />
          </div>
          <div>
            <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:13 }}>{product?.name}</div>
            <div style={{ fontSize:11, color:'#4b5563', marginTop:2 }}>SKU: {product?.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type', dataIndex: 'type', key: 'type', align: 'center',
      render: (type) => type === 'in'
        ? <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'#052e16',color:'#4ade80',border:'1px solid #14532d' }}><ArrowUpOutlined style={{fontSize:9}}/> STOCK-IN</span>
        : <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'#2d0707',color:'#f87171',border:'1px solid #7f1d1d' }}><ArrowDownOutlined style={{fontSize:9}}/> STOCK-OUT</span>,
    },
    {
      title: 'Movement', key: 'movement', align: 'right',
      render: (record) => (
        <div style={{ textAlign:'right' }}>
          <div style={{ fontWeight:800, fontSize:15, color: record.type === 'in' ? '#4ade80' : '#f87171' }}>
            {record.type === 'in' ? '+' : '-'}{record.quantity}
          </div>
          <div style={{ fontSize:11, color:'#4b5563' }}>Units</div>
        </div>
      ),
    },
    {
      title: 'Unit Price', dataIndex: 'cost_price', key: 'price', align: 'right',
      render: (v) => <span style={{ color:'#fbbf24', fontWeight:600, fontSize:13 }}>${Number(v).toFixed(2)}</span>,
    },
    {
      title: 'Total', key: 'total', align: 'right',
      render: (record) => (
        <span style={{ fontWeight:700, fontSize:13, color:'#e2e8f0' }}>
          ${(record.quantity * record.cost_price).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Operator', dataIndex: 'user', key: 'user', align: 'center',
      render: (user) => (
        <Tooltip title={user?.name || 'Authorized Admin'}>
          <div style={{
            width:30, height:30, borderRadius:'50%',
            background:'linear-gradient(135deg,#5b6af0,#818cf8)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontSize:13, fontWeight:700, cursor:'default',
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined style={{ fontSize:13 }} />}
          </div>
        </Tooltip>
      ),
    },
  ];

  /* ── STAT CARD ── */
  const StatCard = ({ icon, label, value, sub, color, extra }) => (
    <div style={{
      background:'#13151e', border:'1px solid #1e2130', borderRadius:16,
      padding:'20px 24px', borderLeft:`3px solid ${color}`,
      transition:'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:`${color}15`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:18 }}>
          {icon}
        </div>
        <div style={{ fontSize:11, color:'#4b5563', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
      </div>
      <div style={{ fontSize:24, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#4b5563', marginTop:8 }}>{sub}</div>}
      {extra && <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #1e2130' }}>{extra}</div>}
    </div>
  );

  /* ── RENDER ── */
  return (
    <div className="rp-root" style={{ background:'transparent', minHeight:'100%' }}>

      {/* ── LOADING BAR ── */}
      {loading && <div className="rp-progress-bar"><div className="rp-progress-bar-inner" /></div>}

      {/* ── PAGE HEADER ── */}
      <div className="rp-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'#818cf815', border:'1px solid #818cf825', display:'flex', alignItems:'center', justifyContent:'center', color:'#818cf8', fontSize:18 }}>
            <FileTextOutlined />
          </div>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#e8eaf6', margin:0, lineHeight:1 }}>Stock History</h2>
            <p style={{ fontSize:12, color:'#4b5563', margin:'4px 0 0', fontWeight:500 }}>
              {data.length} transaction{data.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <button className="rp-btn rp-btn-primary" onClick={fetchHistory}>
          <ReloadOutlined /> Sync Data
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <Row gutter={[16, 16]} style={{ marginBottom:20 }} className="rp-up">
        <Col xs={24} sm={8}>
          <StatCard
            icon={<ArrowUpOutlined />} color="#4ade80"
            label="Inventory Purchase (IN)"
            value={`$${summary.cost_in.toLocaleString()}`}
            sub="សរុបដើមទុនដែលបានទិញទំនិញចូល"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            icon={<ArrowDownOutlined />} color="#60a5fa"
            label="Sales Revenue (OUT)"
            value={`$${summary.sale_out.toLocaleString()}`}
            sub="សរុបទឹកប្រាក់ដែលលក់បាន"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            icon={<DatabaseOutlined />} color="#a78bfa"
            label="Net Stock Balance"
            value={`${summary.qty_balance} Units`}
            extra={
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>
                  <span style={{ color:'#4b5563', fontSize:11 }}>Total In: </span>
                  <span style={{ color:'#4ade80', fontWeight:700 }}>+{summary.total_qty_in}</span>
                </span>
                <span>
                  <span style={{ color:'#4b5563', fontSize:11 }}>Total Out: </span>
                  <span style={{ color:'#f87171', fontWeight:700 }}>-{summary.total_qty_out}</span>
                </span>
              </div>
            }
          />
        </Col>
      </Row>

      {/* ── FILTER + TABLE ── */}
      <div className="rp-up" style={{ background:'#13151e', border:'1px solid #1e2130', borderRadius:16, overflow:'hidden' }}>

        {/* Table header with filters */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #1e2130', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'#5b6af015', border:'1px solid #5b6af025', display:'flex', alignItems:'center', justifyContent:'center', color:'#818cf8', fontSize:14 }}>
              <FileTextOutlined />
            </div>
            <span style={{ fontWeight:800, fontSize:15, color:'#e8eaf6' }}>Transaction Ledger</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <Input
              placeholder="Search reference or product..."
              onChange={e => setFilter({ ...filter, text_search: e.target.value })}
              style={{ width:240, height:38, fontSize:13, borderRadius:10, boxShadow:'none' }}
              styles={{ input: { background:'#3c4eb7', color:'#d1d5db' } }}
            />
            <RangePicker
              className="rp-range-picker"
              style={{ width:260, minWidth:220, height:38, borderRadius:10, background: '#0d0e14', border: '1.5px solid #1e2130', color: '#d1d5db' }}
              placeholder={["Start date", "End date"]}
              onChange={(dates) => setFilter({ ...filter, date_range: dates })}
              allowClear
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => <span style={{ color:'#4b5563', fontSize:12 }}>Total {total} items</span>,
            showSizeChanger: true,
            style: { padding:'12px 16px', margin:0 },
          }}
          scroll={{ x: 1000 }}
          style={{ background:'transparent' }}
        />
      </div>

    </div>
  );
};

export default StockHistory;
