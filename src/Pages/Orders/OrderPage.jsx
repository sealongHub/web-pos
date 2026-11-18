import React, { useEffect, useState } from 'react';
import { Table, Space, Image, message, Row, Col, Tooltip, Popconfirm } from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, EyeOutlined,
  ShoppingCartOutlined, ClockCircleOutlined, CheckOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { request } from '../../util/request_fixed';
import Config from '../../util/config';

/* ── Inject CSS once ── */
if (typeof document !== 'undefined' && !document.getElementById('rp-role-css')) {
  const el = document.createElement('style');
  el.id = 'rp-role-css';
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
.rp-root { font-family: 'Outfit', sans-serif !important; }
.rp-root * { box-sizing: border-box; font-family: 'Outfit', sans-serif !important; }
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
.rp-root .ant-popover-inner { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.rp-root .ant-popover-title { color: #e8eaf6 !important; border-bottom: 1px solid #1e2130 !important; }
.rp-root .ant-popover-inner-content, .rp-root .ant-popconfirm-description { color: #9ca3af !important; }
.rp-root .ant-tooltip-inner { background: #1a1d27 !important; border: 1px solid #1e2130 !important; color: #d1d5db !important; }
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
@keyframes rp-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.rp-up { animation: rp-up 0.38s ease both; }
.rp-root ::-webkit-scrollbar { width: 4px; height: 4px; }
.rp-root ::-webkit-scrollbar-track { background: #0d0e14; }
.rp-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }
`;
  document.head.appendChild(el);
}

/* ─────────────── MAIN ─────────────── */
const OrderPage = () => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await request('orders', 'get');
    if (res) setData(res.list);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    try {
      const res = await request(`orders/${id}/status`, 'put', { status });
      if (res && res.success) { message.success(res.message); await fetchOrders(); }
      else message.error(res?.message || "មានបញ្ហាក្នុងការ Update");
    } catch { message.error("Error connection!"); }
    finally { setLoading(false); }
  };

  const stats = {
    total:     data.length,
    pending:   data.filter(i => !i.status || i.status === 'pending').length,
    approved:  data.filter(i => i.status === 'approved').length,
    cancelled: data.filter(i => i.status === 'cancelled').length,
  };

  /* ── STATUS BADGE ── */
  const StatusBadge = ({ status }) => {
    const s = status ? status.toLowerCase() : 'pending';
    if (s === 'approved')  return <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'#052e16',color:'#4ade80',border:'1px solid #14532d' }}><CheckOutlined style={{fontSize:10}}/> Approved</span>;
    if (s === 'cancelled') return <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'#2d0707',color:'#f87171',border:'1px solid #7f1d1d' }}><StopOutlined style={{fontSize:10}}/> Cancelled</span>;
    return <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'#3d2e00',color:'#fbbf24',border:'1px solid #78490a' }}><ClockCircleOutlined style={{fontSize:10}}/> Pending</span>;
  };

  /* ── COLUMNS ── */
  const columns = [
    {
      title: 'Order ID', dataIndex: 'id',
      render: (id) => <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, background:'#5b6af015', color:'#818cf8', padding:'3px 10px', borderRadius:6, border:'1px solid #5b6af025' }}>#{id}</span>,
    },
    {
      title: 'Customer', dataIndex: 'buyer_name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:13 }}>{name}</div>
          <div style={{ color:'#4b5563', fontSize:11, marginTop:2 }}>{record.buyer_phone}</div>
        </div>
      ),
    },
    {
      title: 'Total', dataIndex: 'total',
      render: (v) => <span style={{ fontWeight:700, color:'#4ade80', fontSize:14 }}>${Number(v).toLocaleString()}</span>,
    },
    {
      title: 'Payment Slip', dataIndex: 'transaction_image', align: 'center',
      render: (img) => {
        let src = null;
        if (img) {
          const value = String(img).trim();
          if (/^https?:\/\//i.test(value)) {
            src = Config.getImage(value);
          } else {
            const path = value.replace(/^\/+/, '').replace(/^storage\//, '');
            src = Config.getImage(path.startsWith('transactions/') ? path : 'transactions/' + path);
          }
        }
        return (
          <Image
            width={42} height={42}
            style={{ borderRadius:8, objectFit:'cover', border:'1px solid #1e2130' }}
            src={src}
            fallback="https://via.placeholder.com/45?text=NA"
          />
        );
      },

    },
    {
      title: 'Status', dataIndex: 'status',
      render: (s) => <StatusBadge status={s} />,
    },
    {
      title: 'Actions', align: 'right',
      render: (record) => (
        <Space size={8}>
          {(record.status === 'pending' || !record.status) && (
            <>
              <Tooltip title="Approve Order">
                <Popconfirm
                  title="Confirm Approval"
                  description="Are you sure payment has been received?"
                  onConfirm={() => handleUpdateStatus(record.id, 'approved')}
                  okText="Yes" cancelText="No"
                >
                  <button style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,border:'1px solid #14532d',background:'#052e16',color:'#4ade80',cursor:'pointer',fontSize:15 }}>
                    <CheckCircleOutlined />
                  </button>
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Cancel Order">
                <Popconfirm
                  title="Cancel Order?"
                  description="Items will be returned to stock!"
                  onConfirm={() => handleUpdateStatus(record.id, 'cancelled')}
                  okText="Cancel" cancelText="Back"
                  okButtonProps={{ danger: true }}
                >
                  <button style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,border:'1px solid #7f1d1d',background:'#2d0707',color:'#f87171',cursor:'pointer',fontSize:15 }}>
                    <CloseCircleOutlined />
                  </button>
                </Popconfirm>
              </Tooltip>
            </>
          )}
          <Tooltip title="View Details">
            <button style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,border:'1px solid #1e2130',background:'#13151e',color:'#9ca3af',cursor:'pointer',fontSize:15 }}
              onClick={() => {}}>
              <EyeOutlined />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* ── STAT CARD ── */
  const StatCard = ({ icon, label, value, color, glow }) => (
    <div style={{
      background: '#13151e', border: '1px solid #1e2130', borderRadius: 16,
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
      transition: 'transform 0.2s', cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color,
        boxShadow: `0 0 16px ${color}20`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#e8eaf6', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#4b5563', fontWeight: 600, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );

  /* ── RENDER ── */
  return (
    <div className="rp-root" style={{ background: 'transparent', minHeight: '100%' }}>

      {/* ── LOADING BAR ── */}
      {loading && <div className="rp-progress-bar"><div className="rp-progress-bar-inner" /></div>}

      {/* ── PAGE HEADER ── */}
      <div className="rp-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'#60a5fa15', border:'1px solid #60a5fa25', display:'flex', alignItems:'center', justifyContent:'center', color:'#60a5fa', fontSize:18 }}>
            <ShoppingCartOutlined />
          </div>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#e8eaf6', margin:0, lineHeight:1 }}>Order Management</h2>
            <p style={{ fontSize:12, color:'#4b5563', margin:'4px 0 0', fontWeight:500 }}>
              {data.length} order{data.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }} className="rp-up">
        <Col xs={12} sm={6}>
          <StatCard icon={<ShoppingCartOutlined />} label="Total Orders"  value={stats.total}     color="#60a5fa" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<ClockCircleOutlined />}  label="Pending"       value={stats.pending}   color="#fbbf24" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<CheckOutlined />}        label="Approved"      value={stats.approved}  color="#4ade80" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<StopOutlined />}         label="Cancelled"     value={stats.cancelled} color="#f87171" />
        </Col>
      </Row>

      {/* ── TABLE ── */}
      <div className="rp-up" style={{ background:'#13151e', border:'1px solid #1e2130', borderRadius:16, overflow:'hidden' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 8, style: { padding:'12px 16px', margin:0 } }}
          style={{ background:'transparent' }}
        />
      </div>

    </div>
  );
};

export default OrderPage;