import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Modal, Form, message, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  ShopOutlined,
  SearchOutlined,
  CloseOutlined,
  FilterOutlined,
  ClearOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { request } from '../../util/request_fixed';
import profileStore from '../../Store/profileStore';

/* ── Inject CSS once (shared id with Role/Category) ── */
if (typeof document !== 'undefined' && !document.getElementById('rp-role-css')) {
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
.rp-root { font-family: 'Outfit', sans-serif !important; }
.rp-root * { box-sizing: border-box; }
.rp-root, .rp-root * { font-family: 'Outfit', sans-serif !important; }
.rp-root .ant-table { background: transparent !important; }
.rp-root .ant-table-thead > tr > th {
  background: #0d0e14 !important; color: #4b5563 !important;
  border-bottom: 1px solid #1e2130 !important;
  font-size: 10.5px !important; letter-spacing: 1px !important;
  text-transform: uppercase !important; font-weight: 800 !important;
  padding: 12px 16px !important;
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
.rp-root .ant-select-selector {
  background: #13151e !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important;
}
.rp-root .ant-select-selection-placeholder { color: #4b5563 !important; }
.rp-root .ant-select-arrow, .rp-root .ant-select-clear { color: #4b5563 !important; }
.rp-root .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-root .ant-input::placeholder { color: #4b5563 !important; }
.rp-root .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-root .ant-input-textarea textarea {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  font-size: 13px !important; box-shadow: none !important; resize: none !important;
}
.rp-root .ant-input-textarea textarea::placeholder { color: #4b5563 !important; }
.rp-root .ant-input-textarea textarea:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
@keyframes rp-spin { to { transform: rotate(360deg); } }
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
.rp-modal .ant-modal-content { background: #13151e !important; border: 1px solid #1e2130; border-radius: 18px !important; padding: 0 !important; }
.rp-modal .ant-modal-header { background: #13151e !important; border-bottom: 1px solid #1e2130 !important; border-radius: 18px 18px 0 0 !important; padding: 20px 24px !important; }
.rp-modal .ant-modal-title { color: #e8eaf6 !important; font-size: 16px !important; font-weight: 800 !important; font-family: 'Outfit', sans-serif !important; }
.rp-modal .ant-modal-body { padding: 24px !important; }
.rp-modal .ant-modal-footer { display: none !important; }
.rp-modal .ant-modal-close { color: #6b7280 !important; top: 16px !important; right: 16px !important; }
.rp-modal .ant-modal-close:hover { color: #e8eaf6 !important; }
.rp-modal .ant-form-item-label > label { color: #9ca3af !important; font-size: 12px !important; font-weight: 700 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; }
.rp-root .ant-input-affix-wrapper {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; height: 38px !important;
  box-shadow: none !important; transition: border-color 0.2s !important;
  padding: 0 11px !important;
}
.rp-root .ant-input-affix-wrapper .ant-input {
  background: transparent !important; border: none !important;
  box-shadow: none !important; height: 100% !important;
  color: #d1d5db !important; font-size: 13px !important; padding: 0 !important;
}
.rp-root .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-root .ant-input::placeholder { color: #4b5563 !important; }
.rp-root .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
/* Modal inputs */
.rp-modal .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-modal .ant-input::placeholder { color: #4b5563 !important; }
.rp-modal .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-modal .ant-select-selector {
  background: #0d0e14 !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important; font-size: 13px !important;
}
.rp-modal textarea {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  font-size: 13px !important; box-shadow: none !important; padding: 8px 12px !important;
}
.rp-modal textarea::placeholder { color: #4b5563 !important; }
.rp-modal textarea:focus { border-color: #5b6af0 !important; box-shadow: none !important; outline: none !important; }
.rp-modal .ant-form-item-explain-error { color: #f87171 !important; font-size: 12px !important; }
.rp-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 16px; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all 0.18s; letter-spacing: 0.2px;
}
.rp-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.rp-btn-primary { background: linear-gradient(135deg,#5b6af0,#818cf8); color: #fff; box-shadow: 0 4px 14px rgba(91,106,240,0.3); }
.rp-btn-danger  { background: #1a0d0d; color: #f87171; border: 1px solid #3a1515 !important; }
.rp-btn-danger:hover { background: #f87171 !important; color: #fff !important; }
.rp-btn-default { background: #13151e; color: #9ca3af; border: 1px solid #1e2130 !important; }
.rp-btn-default:hover { border-color: #5b6af0 !important; color: #818cf8 !important; }
.rp-btn-filter  { background: #13151e; color: #60a5fa; border: 1px solid #1e354a !important; }
.rp-btn-add     { background: linear-gradient(135deg,#5b6af0,#818cf8); color: #fff; box-shadow: 0 4px 14px rgba(91,106,240,0.28); }
@keyframes rp-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.rp-up { animation: rp-up 0.38s ease both; }
.rp-root ::-webkit-scrollbar { width: 4px; height: 4px; }
.rp-root ::-webkit-scrollbar-track { background: #0d0e14; }
.rp-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }
`;
  const el = document.createElement('style');
  el.id = 'rp-role-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─────────────── MAIN ─────────────── */
const SupplierPage = () => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch]           = useState('');
  const [form] = Form.useForm();

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await request('supplier', 'get');
    if (res) setData(res.list);
    setLoading(false);
  };

  const onFinish = async (values) => {
    const method = values.id ? 'put' : 'post';
    const url    = values.id ? `supplier/${values.id}` : 'supplier';
    const res    = await request(url, method, values);
    if (res) {
      message.success(values.id ? "Updated successfully!" : "Supplier added successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchSuppliers();
    }
  };

  /* ── filtered data ── */
  const filtered = data.filter(s =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)
  );

  /* ── TABLE COLUMNS ── */
  const columns = [
    {
      title: 'Supplier Name', dataIndex: 'name', key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#5b6af0,#818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
            boxShadow: '0 2px 8px rgba(91,106,240,0.28)',
          }}>
            {text ? text.charAt(0).toUpperCase() : 'S'}
          </div>
          <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Representative', dataIndex: 'contact_name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: '#1e40af22', border: '1px solid #1e40af44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#60a5fa', fontSize: 12,
          }}>
            <UserOutlined />
          </div>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>{text || '—'}</span>
        </div>
      ),
    },
    {
      title: 'Phone', dataIndex: 'phone',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <PhoneOutlined style={{ color: '#34d399', fontSize: 13 }} />
          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 12 }}>{text || '—'}</span>
        </div>
      ),
    },
    {
      title: 'Address', dataIndex: 'address', ellipsis: true,
      render: (text) => (
        <Tooltip title={text} color="#1a1d27">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <HomeOutlined style={{ color: '#f59e0b', fontSize: 13, flexShrink: 0 }} />
            <span style={{ color: '#6b7280', fontSize: 12 }}>{text || '—'}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Action', align: 'right',
      render: (record) => {
        const canEdit = ['product_staff','manager','super_admin'].includes(profile?.type);
        return canEdit ? (
          <button
            className="rp-btn rp-btn-default"
            style={{ height: 32, padding: '0 14px', fontSize: 12 }}
            onClick={() => { form.setFieldsValue(record); setIsModalOpen(true); }}
          >
            <EditOutlined /> Edit
          </button>
        ) : (
          <span style={{ color: '#6b7280', fontSize: 12 }}>No Edit</span>
        );
      },
    },
  ];

  /* ── RENDER ── */
  const { profile } = profileStore();
  return (
    <div className="rp-root" style={{ background: 'transparent', minHeight: '100%' }}>

      {/* ── LOADING BAR ── */}
      {loading && (
        <div className="rp-progress-bar">
          <div className="rp-progress-bar-inner" />
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="rp-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: '#f59e0b15', border: '1px solid #f59e0b25',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fbbf24', fontSize: 18,
          }}>
            <ShopOutlined />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eaf6', margin: 0, lineHeight: 1 }}>
              Supplier Management
            </h2>
            <p style={{ fontSize: 12, color: '#4b5563', margin: '4px 0 0', fontWeight: 500 }}>
              {filtered.length} supplier{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        {['sales_staff','product_staff','manager','super_admin'].includes(profile?.type) ? (
          <button className="rp-btn rp-btn-add" onClick={() => { form.resetFields(); setIsModalOpen(true); }}>
            <PlusOutlined /> Add Supplier
          </button>
        ) : (
          <button className="rp-btn rp-btn-add" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <PlusOutlined /> Add Supplier
          </button>
        )}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="rp-up" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#13151e', border: '1px solid #1e2130',
        borderRadius: 14, padding: '12px 16px', marginBottom: 20,
      }}>
        <Input
          placeholder="Search suppliers..."
          value={search}
          onChange={e => setSearch(e.target.value || '')}
          style={{ width: 260, height: 38, fontSize: 13, borderRadius: 10, boxShadow: 'none' }}
          styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
        />
        <button className="rp-btn rp-btn-filter" onClick={() => setSearch(search)}>
          <FilterOutlined /> Filter
        </button>
        <button className="rp-btn rp-btn-default" onClick={() => setSearch('')}>
          <ClearOutlined /> Clear
        </button>
        <span style={{ fontSize: 12, color: '#4b5563', marginLeft: 'auto', fontWeight: 600 }}>
          {filtered.length} / {data.length} records
        </span>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background: '#13151e', border: '1px solid #1e2130', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, style: { padding: '12px 16px', margin: 0 } }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* ── MODAL ── */}
      <Modal
        className="rp-modal"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        width={500}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#f59e0b15', border: '1px solid #f59e0b25',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fbbf24', fontSize: 14,
            }}>
              <ShopOutlined />
            </div>
            {form.getFieldValue('id') ? 'Edit Supplier' : 'Add New Supplier'}
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 4 }}>
          <Form.Item name="id" hidden><Input /></Form.Item>

          <Form.Item
            name="name" label="Company / Supplier Name"
            rules={[{ required: true, message: 'Please input company name!' }]}
          >
            <Input placeholder="e.g. Coca Cola Co., Ltd" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item name="contact_name" label="Representative" style={{ flex: 1 }}>
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number" style={{ flex: 1 }}>
              <Input placeholder="012 345 678" />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Office Address">
            <Input.TextArea placeholder="Enter full address details" rows={3} />
          </Form.Item>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            paddingTop: 8, borderTop: '1px solid #1e2130', marginTop: 4,
          }}>
            <button type="button" className="rp-btn rp-btn-default" onClick={() => { setIsModalOpen(false); form.resetFields(); }}>
              Cancel
            </button>
            <button type="submit" className="rp-btn rp-btn-primary">
              {form.getFieldValue('id') ? <><EditOutlined /> Update</> : <><PlusOutlined /> Save</>}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default SupplierPage;