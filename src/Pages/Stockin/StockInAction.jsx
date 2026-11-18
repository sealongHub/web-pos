import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Select, message } from 'antd';
import { request } from '../../util/request_fixed';
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';

const StockInAction = ({ onRefresh }) => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [form] = Form.useForm();

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const [resPro, resSup] = await Promise.all([
        request('product', 'get'),
        request('supplier', 'get'),
      ]);
      if (resPro && resPro.proList) setProducts(resPro.proList);
      if (resSup && resSup.list)   setSuppliers(resSup.list);
    } catch {
      message.error("មិនអាចទាញយកទិន្នន័យបានទេ!");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (open) fetchInitialData(); }, [open]);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await request('stock-in', 'post', values);
    if (res && !res.error) {
      message.success("បញ្ចូលស្តុកជោគជ័យ!");
      setOpen(false);
      form.resetFields();
      if (onRefresh) onRefresh();
    }
    setLoading(false);
  };

  /* ── INLINE MODAL CSS (no duplicate injection if Products CSS already loaded) ── */
  if (typeof document !== 'undefined' && !document.getElementById('stockin-css')) {
    const el = document.createElement('style');
    el.id = 'stockin-css';
    el.textContent = `
.si-modal .ant-modal-content { background: #13151e !important; border: 1px solid #1e2130; border-radius: 18px !important; padding: 0 !important; }
.si-modal .ant-modal-header  { background: #13151e !important; border-bottom: 1px solid #1e2130 !important; border-radius: 18px 18px 0 0 !important; padding: 20px 24px !important; }
.si-modal .ant-modal-title   { color: #e8eaf6 !important; font-size: 16px !important; font-weight: 800 !important; font-family: 'Outfit', sans-serif !important; }
.si-modal .ant-modal-body    { padding: 24px !important; }
.si-modal .ant-modal-footer  { display: none !important; }
.si-modal .ant-modal-close   { color: #6b7280 !important; top: 16px !important; right: 16px !important; }
.si-modal .ant-modal-close:hover { color: #e8eaf6 !important; }
.si-modal .ant-form-item-label > label { color: #9ca3af !important; font-size: 12px !important; font-weight: 700 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; }
.si-modal .ant-input { background: #0d0e14 !important; border: 1.5px solid #1e2130 !important; border-radius: 10px !important; color: #d1d5db !important; font-size: 13px !important; box-shadow: none !important; }
.si-modal .ant-select-selector { background: #0d0e14 !important; border: 1.5px solid #1e2130 !important; border-radius: 10px !important; color: #d1d5db !important; font-size: 13px !important; }
.si-modal .ant-select-dropdown { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.si-modal .ant-select-item { color: #d1d5db !important; }
.si-modal .ant-select-item-option-active { background: #5b6af015 !important; }
.si-modal .ant-select-item-option-selected { background: #5b6af025 !important; color: #818cf8 !important; }
.si-modal .ant-input-number { background: #0d0e14 !important; border: 1.5px solid #1e2130 !important; border-radius: 10px !important; width: 100% !important; box-shadow: none !important; }
.si-modal .ant-input-number .ant-input-number-input { background: #0d0e14 !important; color: #d1d5db !important; height: 36px !important; font-size: 13px !important; }
.si-modal .ant-input-number:focus-within { border-color: #5b6af0 !important; box-shadow: none !important; }
.si-modal .ant-input-number-handler-wrap { background: #13151e !important; border-left: 1px solid #1e2130 !important; border-radius: 0 9px 9px 0 !important; }
.si-modal .ant-input-number-handler { color: #6b7280 !important; }
.si-modal .ant-input-number-prefix { color: #6b7280 !important; }
.si-modal .ant-form-item-explain-error { color: #f87171 !important; font-size: 12px !important; }
.si-modal .ant-spin-dot-item { background: #5b6af0 !important; }
`;
    document.head.appendChild(el);
  }

  return (
    <>
      {/* ── BUTTON — exact same size/style as Add Product ── */}
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 38, padding: '0 16px', borderRadius: 10,
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
          cursor: 'pointer', border: '1px solid #1e354a',
          background: '#13151e', color: '#60a5fa',
          transition: 'all 0.18s', letterSpacing: 0.2,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#5b6af0'; e.currentTarget.style.color = '#818cf8'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e354a'; e.currentTarget.style.color = '#60a5fa'; }}
        onClick={() => setOpen(true)}
      >
        <InboxOutlined style={{ fontSize: 15 }} />
        Stock In
      </button>

      {/* ── MODAL ── */}
      <Modal
        className="si-modal"
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        width={480}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#60a5fa15', border: '1px solid #60a5fa25',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#60a5fa', fontSize: 14,
            }}>
              <InboxOutlined />
            </div>
            Stock In
          </div>
        }
      >
        {fetching ? (
          <div style={{ padding: '8px 0 24px' }}>
            <div style={{ position:'relative', height:3, background:'#1e2130', borderRadius:3, overflow:'hidden' }}>
              <div style={{
                position:'absolute', top:0, height:'100%',
                background:'linear-gradient(90deg,#5b6af0,#818cf8,#a78bfa)',
                borderRadius:3, boxShadow:'0 0 8px rgba(129,140,248,0.6)',
                animation:'rp-bar 1.2s ease-in-out infinite',
              }}/>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 4 }}>

            <Form.Item name="supplier_id" label="Supplier"
              rules={[{ required: true, message: 'Please select a supplier' }]}
            >
              <Select
                showSearch placeholder="Select supplier..."
                optionFilterProp="label"
                options={suppliers.map(s => ({ label: s.name, value: s.id }))}
              />
            </Form.Item>

            <Form.Item name="product_id" label="Product"
              rules={[{ required: true, message: 'Please select a product' }]}
            >
              <Select
                showSearch placeholder="Search product..."
                optionFilterProp="label"
                options={products.map(p => ({ label: `${p.name} (${p.code})`, value: p.id }))}
              />
            </Form.Item>

            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item name="qty" label="Quantity" style={{ flex: 1 }}
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  style={{ width: '100%', background: '#0d0e14', borderColor: '#1e2130', borderRadius: 10 }}
                  styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
                  min={1} placeholder="0"
                />
              </Form.Item>

              <Form.Item name="cost_price" label="Cost Price / Unit" style={{ flex: 1 }}
                rules={[{ required: true, message: 'Please enter cost price' }]}
              >
                <InputNumber
                  style={{ width: '100%', background: '#0d0e14', borderColor: '#1e2130', borderRadius: 10 }}
                  styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
                  min={0} step={0.01} prefix="$" placeholder="0.00"
                />
              </Form.Item>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              paddingTop: 8, borderTop: '1px solid #1e2130', marginTop: 4,
            }}>
              <button type="button"
                style={{ display:'inline-flex',alignItems:'center',gap:6,height:38,padding:'0 16px',borderRadius:10,fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,cursor:'pointer',background:'#13151e',color:'#9ca3af',border:'1px solid #1e2130' }}
                onClick={() => { setOpen(false); form.resetFields(); }}
              >
                Cancel
              </button>
              <button type="submit"
                style={{ display:'inline-flex',alignItems:'center',gap:6,height:38,padding:'0 16px',borderRadius:10,fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,cursor:'pointer',background:'linear-gradient(135deg,#5b6af0,#818cf8)',color:'#fff',border:'none',boxShadow:'0 4px 14px rgba(91,106,240,0.3)',opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                <InboxOutlined /> {loading ? 'Saving...' : 'Stock In'}
              </button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default StockInAction;