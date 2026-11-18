import React, { useEffect, useState } from 'react';
import { Space, Input, Table, Modal, Form, Select, message, Image, Row, Col } from 'antd';
import { Upload } from 'antd';
import { request } from '../../util/request_fixed';
import profileStore from '../../Store/profileStore';
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/config';
import {
  PlusOutlined, FilterOutlined, ClearOutlined,
  EditOutlined, DeleteOutlined, CloseOutlined,
  UserOutlined, SearchOutlined, TeamOutlined,
  CopyOutlined, CheckOutlined, QrcodeOutlined,
  LockOutlined, PhoneOutlined, HomeOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

/* ── Inject CSS — unique id to avoid conflict with Products page ── */
if (typeof document !== 'undefined' && !document.getElementById('um-page-css')) {
  const el = document.createElement('style');
  el.id = 'um-page-css';
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

/* ── scope everything under .um-root ── */
.um-root { font-family: 'Outfit', sans-serif !important; }
.um-root * { box-sizing: border-box; font-family: 'Outfit', sans-serif !important; }

/* ── Table ── */
.um-root .ant-table { background: transparent !important; }
.um-root .ant-table-thead > tr > th {
  background: #0d0e14 !important; color: #4b5563 !important;
  border-bottom: 1px solid #1e2130 !important; font-size: 10.5px !important;
  letter-spacing: 1px !important; text-transform: uppercase !important;
  font-weight: 800 !important; padding: 12px 16px !important;
}
.um-root .ant-table-tbody > tr > td {
  background: transparent !important; border-bottom: 1px solid #1a1d27 !important;
  color: #d1d5db !important; padding: 13px 16px !important; font-size: 13px !important;
}
.um-root .ant-table-tbody > tr:hover > td { background: #13151e !important; }
.um-root .ant-table-placeholder { background: transparent !important; }
.um-root .ant-empty-description { color: #4b5563 !important; }
.um-root .ant-pagination .ant-pagination-item a { color: #6b7280 !important; }
.um-root .ant-pagination .ant-pagination-item-active { background: #5b6af0 !important; border-color: #5b6af0 !important; }
.um-root .ant-pagination .ant-pagination-item-active a { color: #fff !important; }
.um-root .ant-pagination-prev .ant-pagination-item-link,
.um-root .ant-pagination-next .ant-pagination-item-link { color: #6b7280 !important; background: transparent !important; border-color: #1e2130 !important; }

/* ── Select (filter bar only) ── */
.um-root .ant-select-selector {
  background: #13151e !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important;
}
.um-root .ant-select-selection-placeholder { color: #4b5563 !important; }
.um-root .ant-select-arrow { color: #4b5563 !important; }
.um-root .ant-select-dropdown { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.um-root .ant-select-item { color: #d1d5db !important; }
.um-root .ant-select-item-option-active { background: #5b6af015 !important; }
.um-root .ant-select-item-option-selected { background: #5b6af025 !important; color: #818cf8 !important; }

/* ── Search input (filter bar only, NOT modal) ── */
.um-filter-input .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.um-filter-input .ant-input::placeholder { color: #4b5563 !important; }
.um-filter-input .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.um-filter-input .ant-input-prefix { color: #4b5563 !important; }

/* ── Loading bar ── */
@keyframes um-bar {
  0% { left: -40%; width: 40%; } 50% { left: 20%; width: 60%; } 100% { left: 110%; width: 40%; }
}
.um-progress-bar { position: relative; height: 3px; background: #1e2130; border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
.um-progress-bar-inner {
  position: absolute; top: 0; height: 100%;
  background: linear-gradient(90deg, #5b6af0, #818cf8, #a78bfa);
  border-radius: 3px; animation: um-bar 1.2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(129,140,248,0.6);
}

/* ── Modal ── */
.um-modal .ant-modal-content {
  background: #13151e !important; border: 1px solid #1e2130;
  border-radius: 18px !important; padding: 0 !important;
}
.um-modal .ant-modal-header {
  background: #13151e !important; border-bottom: 1px solid #1e2130 !important;
  border-radius: 18px 18px 0 0 !important; padding: 20px 24px !important;
}
.um-modal .ant-modal-title { color: #e8eaf6 !important; font-size: 16px !important; font-weight: 800 !important; }
.um-modal .ant-modal-body { padding: 24px !important; }
.um-modal .ant-modal-close { color: #6b7280 !important; top: 16px !important; right: 16px !important; }
.um-modal .ant-modal-close:hover { color: #e8eaf6 !important; }

/* ── Modal Form Labels ── */
.um-modal .ant-form-item-label > label {
  color: #9ca3af !important; font-size: 12px !important;
  font-weight: 700 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important;
}

/* ── Modal Inputs — single layer, no duplication ── */
.um-modal .ant-input-affix-wrapper {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; box-shadow: none !important;
  padding: 0 11px !important; height: 40px !important;
  display: flex !important; align-items: center !important;
}
.um-modal .ant-input-affix-wrapper:hover { border-color: #5b6af0 !important; }
.um-modal .ant-input-affix-wrapper-focused { border-color: #5b6af0 !important; box-shadow: none !important; }

/* ── Inner input inside affix wrapper ── */
.um-modal .ant-input-affix-wrapper .ant-input {
  background: transparent !important; border: none !important;
  box-shadow: none !important; outline: none !important;
  color: #d1d5db !important; font-size: 13px !important;
  height: 100% !important; padding: 0 !important;
}
.um-modal .ant-input-affix-wrapper .ant-input::placeholder { color: #4b5563 !important; }

/* ── Standalone input (no prefix/suffix) ── */
.um-modal .ant-form-item .ant-input:not(.ant-input-affix-wrapper .ant-input) {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  font-size: 13px !important; box-shadow: none !important; height: 40px !important;
  padding: 0 12px !important;
}
.um-modal .ant-form-item .ant-input:not(.ant-input-affix-wrapper .ant-input):hover { border-color: #5b6af0 !important; }
.um-modal .ant-form-item .ant-input:not(.ant-input-affix-wrapper .ant-input):focus { border-color: #5b6af0 !important; box-shadow: none !important; }

/* Password input */
.um-modal .ant-input-password { background: #0d0e14 !important; border: 1.5px solid #1e2130 !important; border-radius: 10px !important; box-shadow: none !important; height: 40px !important; }
.um-modal .ant-input-password:hover { border-color: #5b6af0 !important; }
.um-modal .ant-input-password.ant-input-affix-wrapper-focused { border-color: #5b6af0 !important; }
.um-modal .ant-input-password .ant-input { background: transparent !important; border: none !important; box-shadow: none !important; color: #d1d5db !important; }
.um-modal .ant-input-password-icon { color: #6b7280 !important; }
.um-modal .ant-input-password-icon:hover { color: #818cf8 !important; }

/* Prefix icon */
.um-modal .ant-input-prefix { color: #6b7280 !important; margin-right: 8px !important; font-size: 13px !important; }

/* ── Modal Select ── */
.um-modal .ant-select-selector {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  font-size: 13px !important; height: 40px !important;
}
.um-modal .ant-select:hover .ant-select-selector { border-color: #5b6af0 !important; }
.um-modal .ant-select-focused .ant-select-selector { border-color: #5b6af0 !important; box-shadow: none !important; }
.um-modal .ant-select-selection-placeholder { color: #4b5563 !important; line-height: 38px !important; }
.um-modal .ant-select-selection-item { line-height: 38px !important; }
.um-modal .ant-select-arrow { color: #6b7280 !important; }
.um-modal .ant-select-dropdown { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.um-modal .ant-select-item { color: #d1d5db !important; }
.um-modal .ant-select-item-option-active { background: #5b6af015 !important; }
.um-modal .ant-select-item-option-selected { background: #5b6af025 !important; color: #818cf8 !important; }

/* ── Error messages ── */
.um-modal .ant-form-item-explain-error { color: #f87171 !important; font-size: 12px !important; }

/* ── Upload ── */
.um-modal .ant-upload-select {
  background: #0d0e14 !important; border: 1.5px dashed #1e2130 !important;
  border-radius: 10px !important;
}
.um-modal .ant-upload-select:hover { border-color: #5b6af0 !important; }
.um-modal .ant-upload button { color: #6b7280 !important; }
.um-modal .ant-upload button:hover { color: #818cf8 !important; }

/* ── Buttons ── */
.um-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 16px; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all 0.18s;
}
.um-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.um-btn-primary { background: linear-gradient(135deg,#5b6af0,#818cf8); color: #fff; box-shadow: 0 4px 14px rgba(91,106,240,0.3); }
.um-btn-danger  { background: #1a0d0d; color: #f87171; border: 1px solid #3a1515 !important; }
.um-btn-danger:hover { background: #f87171 !important; color: #fff !important; }
.um-btn-default { background: #13151e; color: #9ca3af; border: 1px solid #1e2130 !important; }
.um-btn-default:hover { border-color: #5b6af0 !important; color: #818cf8 !important; }
.um-btn-filter  { background: #13151e; color: #60a5fa; border: 1px solid #1e354a !important; }
.um-btn-add     { background: linear-gradient(135deg,#5b6af0,#818cf8); color: #fff; box-shadow: 0 4px 14px rgba(91,106,240,0.28); }

@keyframes um-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.um-up { animation: um-up 0.38s ease both; }
.um-root ::-webkit-scrollbar { width: 4px; height: 4px; }
.um-root ::-webkit-scrollbar-track { background: #0d0e14; }
.um-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }

/* ── QR Modal ── */
.um-qr-box { text-align: center; padding: 4px 0; }
.um-qr-success {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(0,201,167,0.1); border: 1.5px solid #00c9a7;
  display: flex; align-items: center; justify-content: center;
  color: #00c9a7; font-size: 22px; margin: 0 auto 14px;
}
.um-qr-title { font-size: 18px; font-weight: 800; color: #e8eaf6; margin-bottom: 6px; }
.um-qr-desc { font-size: 12px; color: #6b7280; line-height: 1.7; margin-bottom: 20px; }
.um-qr-steps { background: rgba(91,106,240,0.05); border: 1px solid #1e2130; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; text-align: left; }
.um-qr-step { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 12px; color: #9ca3af; line-height: 1.6; }
.um-qr-step:last-child { margin-bottom: 0; }
.um-qr-num { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; background: #5b6af015; border: 1px solid #5b6af0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #818cf8; font-weight: 700; }
.um-qr-img { width: 150px; height: 150px; padding: 10px; background: #fff; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; }
.um-qr-img img { width: 100%; height: 100%; object-fit: contain; }
.um-secret-box { display: flex; align-items: center; gap: 10px; background: #0d0e14; border: 1px solid #1e2130; border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; }
.um-secret-key { flex: 1; font-family: monospace; font-size: 12px; color: #818cf8; letter-spacing: 0.1em; word-break: break-all; text-align: left; }
.um-copy-btn { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 14px; padding: 0; transition: color 0.2s; flex-shrink: 0; }
.um-copy-btn:hover { color: #818cf8; }
`;
  document.head.appendChild(el);
}

/* ─────────────── MAIN ─────────────── */
const UserManagement = () => {

  const [fileList, setFileList] = useState([]);
  const handleFileChange = ({ fileList: newList }) => setFileList(newList);

  const [formRef]              = Form.useForm();
  const [validate, setValidate] = useState({});
  const [filter, setFilter]    = useState({ text_search: null, type: null });
  const [qrData, setQrData]    = useState({ open: false, qr_url: '', secret: '' });
  const [copied, setCopied]    = useState(false);
  const [editId, setEditId]    = useState(null); // ✅ track edit id separately (not from form)

  const [state, setState] = useState({
    list: [], open: false, loading: false,
    pagination: { current_page: 1, last_page: 1, total: 0 },
  });

  useEffect(() => {
    const delay = setTimeout(() => getLists(), 400);
    return () => clearTimeout(delay);
  }, [filter]);

  const getLists = async (page = 1) => {
    setState(p => ({ ...p, loading: true }));
    const params = new URLSearchParams({
      page,
      ...Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ''))
    });
    const res = await request('users?' + params.toString(), 'get');
    if (res && !res.errors) {
      setState(p => ({
        ...p,
        list: res.users || res.data || [],
        pagination: res.pagination || { current_page: 1, total: res.total || 0 },
        loading: false,
      }));
    } else {
      setState(p => ({ ...p, loading: false }));
    }
  };

  const { profile } = profileStore();

  const openModal = () => {
    if (profile?.type !== 'super_admin') return; // only super_admin can open add/edit
    setEditId(null);
    setState(p => ({ ...p, open: true }));
  };

  const closeModal = () => {
    setState(p => ({ ...p, open: false }));
    formRef.resetFields();
    setValidate({});
    setFileList([]);
    setEditId(null);
  };

  const onFinish = async (values) => {
    const isEdit = !!editId;
    const formData = new FormData();
    formData.append('name',    values.name    || '');
    formData.append('email',   values.email   || '');
    formData.append('phone',   values.phone   || '');
    formData.append('address', values.address || '');
    formData.append('type',    values.type    || 'staff');
    if (!isEdit) {
      formData.append('password',              values.password              || '');
      formData.append('password_confirmation', values.password_confirmation || '');
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    let url = 'register', method = 'post';
    if (isEdit) {
      url = 'users/' + editId;
      formData.append('_method', 'put');
    }

    setState(p => ({ ...p, loading: true }));
    try {
      const res = await request(url, method, formData);
      if (res && !res.errors) {
        message.success(isEdit ? 'User updated successfully' : 'User created successfully');
        closeModal();
        getLists();
        if (!isEdit && res.qr_code_url) {
          setQrData({ open: true, qr_url: res.qr_code_url, secret: res.secret || '' });
        }
      } else {
        setValidate(res?.errors || {});
        if (res?.message) message.error(res.message);
      }
    } catch (err) {
      message.error('Server error. Please check Laravel logs.');
    } finally {
      setState(p => ({ ...p, loading: false }));
    }
  };

  const onDelete = (data) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure to delete "${data.name}"?`,
      okText: 'Delete', okType: 'danger',
      onOk: async () => {
        const res = await request('users/' + data.id, 'delete');
        if (res && !res.errors) { message.success('User deleted'); getLists(); }
      },
    });
  };

  const onEdit = (data) => {
    setEditId(data.id); // ✅ store id separately
    setState(p => ({ ...p, open: true }));
    const imagee = data.profiles?.imagee;
    if (imagee) {
      setFileList([{ uid: data.id, name: imagee, status: 'done', url: Config.getImage(imagee) }]);
    } else {
      setFileList([]);
    }
    formRef.setFieldsValue({
      name:    data.name,
      email:   data.email,
      phone:   data.profiles?.phone   || '',
      address: data.profiles?.address || '',
    type:    data.type || data.profiles?.type || 'sales_staff',
    });
  };

  const copySecret = () => {
    navigator.clipboard.writeText(qrData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = qrData.qr_url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData.qr_url)}`
    : '';

  const uploadButton = (
    <div style={{ color: '#6b7280' }}>
      <PlusOutlined style={{ fontSize: 18 }} />
      <div style={{ marginTop: 6, fontSize: 12 }}>Upload</div>
    </div>
  );

  const columns = [
    {
      key: 'name', title: 'User', dataIndex: 'name',
      render: (v, row) => {
        const imagee = row.profiles?.imagee;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imagee
              ? <Image width={38} height={38} src={Config.getImage(imagee)} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#5b6af0,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                  {v?.charAt(0)?.toUpperCase()}
                </div>
            }
            <div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{v}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{row.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone', title: 'Phone',
      render: (_, row) => <span style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>{row.profiles?.phone || '—'}</span>,
    },
    {
      key: 'address', title: 'Address',
      render: (_, row) => <span style={{ color: '#6b7280', fontSize: 12 }}>{row.profiles?.address || '—'}</span>,
    },
    {
      key: 'type', title: 'Role', dataIndex: 'type',
      render: (v) => {
        const map = {
          super_admin:   { bg: '#2d1b69', color: '#fcd34d', border: '#b45309' },
          manager:       { bg: '#1f2937', color: '#60a5fa', border: '#0ea5a3' },
          product_staff: { bg: '#1e3a5f', color: '#60a5fa', border: '#1e3a8a' },
          sales_staff:   { bg: '#052e16', color: '#4ade80', border: '#14532d' },
        };
        const s = map[v] || map.product_staff;
        const label = v ? v.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Product Staff';
        return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{label}</span>;
      },
    },
    {
      key: '2fa', title: '2FA',
      render: (_, row) => row.two_factor_enabled
        ? <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#052e16',color:'#4ade80',border:'1px solid #14532d' }}><SafetyOutlined /> ON</span>
        : <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#1c1917',color:'#6b7280',border:'1px solid #292524' }}>OFF</span>,
    },
    {
      key: 'created_at', title: 'Created At', dataIndex: 'created_at',
      render: (v) => <span style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>{dayjs(v).format('DD MMM YYYY')}</span>,
    },
    {
      key: 'action', title: 'Action', align: 'right',
      render: (_, row) => (
        <Space size={8}>
          {profile?.type === 'super_admin' ? (
            <>
              <button className="um-btn um-btn-default" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onEdit(row)}>
                <EditOutlined /> Edit
              </button>
              <button className="um-btn um-btn-danger" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onDelete(row)}>
                <DeleteOutlined /> Delete
              </button>
            </>
          ) : (
            <span style={{ color: '#6b7280', fontSize: 12 }}>No permission</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="um-root" style={{ background: 'transparent', minHeight: '100%' }}>

      {state.loading && <div className="um-progress-bar"><div className="um-progress-bar-inner" /></div>}

      {/* ── PAGE HEADER ── */}
      <div className="um-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#a78bfa15', border: '1px solid #a78bfa25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontSize: 18 }}>
            <TeamOutlined />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eaf6', margin: 0, lineHeight: 1 }}>User Management</h2>
            <p style={{ fontSize: 12, color: '#4b5563', margin: '4px 0 0', fontWeight: 500 }}>
              {state.pagination.total || state.list.length} users total
            </p>
          </div>
        </div>
        <button className="um-btn um-btn-add" onClick={openModal} disabled={profile?.type !== 'super_admin'}>
          <PlusOutlined /> Add User
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="um-up" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: '#13151e', border: '1px solid #1e2130', borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
        <div className="um-filter-input">
          <Input
            placeholder="Search users..."
            value={filter.text_search}
            onChange={e => setFilter(p => ({ ...p, text_search: e.target.value || null }))}
            style={{ width: 200, height: 38, fontSize: 13, borderRadius: 10, boxShadow: 'none' }}
            styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
            variant="outlined"
          />
        </div>
        <Select
          placeholder="Role"
          style={{ width: 160 }}
          allowClear
          value={filter.type}
          options={[
            { label: '👑  Super Admin', value: 'super_admin' },
            { label: '🧑‍💼  Manager',    value: 'manager' },
            { label: '📦 Product Staff', value: 'product_staff' },
            { label: '🛒 Sales Staff',    value: 'sales_staff' },
          ]}
          onChange={v => setFilter(p => ({ ...p, type: v }))}
        />
        <button className="um-btn um-btn-filter" onClick={() => getLists()}><FilterOutlined /> Filter</button>
        <button className="um-btn um-btn-default" onClick={() => setFilter({ text_search: null, type: null })}><ClearOutlined /> Clear</button>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background: '#13151e', border: '1px solid #1e2130', borderRadius: 16, overflow: 'hidden' }}>
        <Table
          dataSource={state.list}
          columns={columns}
          rowKey="id"
          pagination={{
            current:  state.pagination.current_page,
            pageSize: 10,
            total:    state.pagination.total,
            onChange: (page) => getLists(page),
            showSizeChanger: false,
            style: { padding: '12px 16px', margin: 0 },
          }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* ── MODAL: Add / Edit User ── */}
      <Modal
        className="um-modal"
        open={state.open}
        onCancel={closeModal}
        footer={null}
        centered                      
        destroyOnClose                
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        width={560}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#a78bfa15', border: '1px solid #a78bfa25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontSize: 14 }}>
              <UserOutlined />
            </div>
            {editId ? 'Edit User' : 'Add New User'}
          </div>
        }
      >
        <Form layout="vertical" form={formRef} onFinish={onFinish} style={{ marginTop: 4 }}>
          <Row gutter={12}>

            {/* Avatar */}
            <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Col>

            {/* Name */}
            <Col span={12}>
              <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Required!' }]} {...validate.name}>
                <Input prefix={<UserOutlined style={{ color: '#4b5563' }} />} placeholder="Full name" />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required!' }, { type: 'email', message: 'Invalid email!' }]} {...validate.email}>
                <Input prefix={<span style={{ color: '#4b5563', fontSize: 13 }}>@</span>} placeholder="email@example.com" />
              </Form.Item>
            </Col>

            {/* Password — only on create ✅ use editId not formRef.getFieldValue */}
            {!editId && (
              <>
                <Col span={12}>
                  <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Required!' }, { min: 6, message: 'Min 6 chars!' }]} {...validate.password}>
                    <Input.Password prefix={<LockOutlined style={{ color: '#4b5563' }} />} placeholder="Min. 6 characters" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Confirm Password" name="password_confirmation" rules={[{ required: true, message: 'Required!' }]}>
                    <Input.Password prefix={<LockOutlined style={{ color: '#4b5563' }} />} placeholder="Repeat password" />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* Phone */}
            <Col span={12}>
              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Required!' }]} {...validate.phone}>
                <Input prefix={<PhoneOutlined style={{ color: '#4b5563' }} />} placeholder="+855 xx xxx xxxx" />
              </Form.Item>
            </Col>

            {/* Role */}
            <Col span={12}>
              <Form.Item label="Role" name="type" rules={[{ required: true, message: 'Required!' }]}>
                <Select placeholder="Select Role" options={[
                  { label: '👑  Super Admin', value: 'super_admin' },
                  { label: '🧑‍💼  Manager',     value: 'manager' },
                  { label: '📦 Product Staff', value: 'product_staff' },
                  { label: '🛒 Sales Staff',    value: 'sales_staff' },
                ]} />
              </Form.Item>
            </Col>

            {/* Address */}
            <Col span={24}>
              <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Required!' }]} {...validate.address}>
                <Input prefix={<HomeOutlined style={{ color: '#4b5563' }} />} placeholder="Address" />
              </Form.Item>
            </Col>

          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #1e2130', marginTop: 4 }}>
            <button type="button" className="um-btn um-btn-default" onClick={closeModal}>Cancel</button>
            <button type="submit" className="um-btn um-btn-primary">
              {editId ? <><EditOutlined /> Update User</> : <><PlusOutlined /> Create User</>}
            </button>
          </div>
        </Form>
      </Modal>

      {/* ── MODAL: QR Code ── */}
      <Modal
        className="um-modal"
        open={qrData.open}
        onCancel={() => setQrData(p => ({ ...p, open: false }))}
        footer={null}
        centered
        destroyOnClose
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        width={420}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#00c9a715', border: '1px solid #00c9a730', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c9a7', fontSize: 14 }}>
              <SafetyOutlined />
            </div>
            Setup 2FA — Google Authenticator
          </div>
        }
      >
        <div className="um-qr-box">
          <div className="um-qr-success">✓</div>
          <div className="um-qr-title">Account Created!</div>
          <div className="um-qr-desc">User ត្រូវវាយ QR code នេះ ដោយប្រើ<br /><strong style={{ color: '#818cf8' }}>Google Authenticator</strong> app</div>
          <div className="um-qr-steps">
            <div className="um-qr-step"><div className="um-qr-num">1</div><div>Download <strong style={{color:'#818cf8'}}>Google Authenticator</strong> នៅ App Store / Play Store</div></div>
            <div className="um-qr-step"><div className="um-qr-num">2</div><div>ចុច <strong style={{color:'#818cf8'}}>"+"</strong> → <strong style={{color:'#818cf8'}}>"Scan QR code"</strong> → Scan QR ខាងក្រោម</div></div>
            <div className="um-qr-step"><div className="um-qr-num">3</div><div>Login ជាមួយ <strong style={{color:'#818cf8'}}>6-digit code</strong> ពី app</div></div>
          </div>
          {qrImageUrl && <div className="um-qr-img"><img src={qrImageUrl} alt="QR Code" /></div>}
          {qrData.secret && (
            <>
              <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, textAlign: 'left' }}>Backup Secret Key</div>
              <div className="um-secret-box">
                <span className="um-secret-key">{qrData.secret}</span>
                <button className="um-copy-btn" onClick={copySecret}>
                  {copied ? <CheckOutlined style={{ color: '#00c9a7' }} /> : <CopyOutlined />}
                </button>
              </div>
            </>
          )}
          <button className="um-btn um-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setQrData(p => ({ ...p, open: false }))}>
            <QrcodeOutlined /> Done
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default UserManagement;
