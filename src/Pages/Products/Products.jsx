import React, { useEffect, useState } from 'react'
import { Space, Input, Table, Modal, Form, Select, message, Image, Row, Col, InputNumber } from 'antd';
import { Upload } from 'antd';
import { request } from '../../util/request_fixed'
import profileStore from '../../Store/profileStore';
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/config';
import StockInAction from '../Stockin/StockInAction';
import {
  PlusOutlined, FilterOutlined, ClearOutlined,
  EditOutlined, DeleteOutlined, CloseOutlined,
  AppstoreOutlined, SearchOutlined,
} from '@ant-design/icons';

/* ── Inject CSS once (shared id) ── */
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
.rp-root .ant-select-selector {
  background: #13151e !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important;
}
.rp-root .ant-select-selection-placeholder { color: #4b5563 !important; }
.rp-root .ant-select-arrow, .rp-root .ant-select-clear { color: #4b5563 !important; }
.rp-root .ant-select-dropdown { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.rp-root .ant-select-item { color: #d1d5db !important; }
.rp-root .ant-select-item-option-active { background: #5b6af015 !important; }
.rp-root .ant-select-item-option-selected { background: #5b6af025 !important; color: #818cf8 !important; }
.rp-root .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-root .ant-input::placeholder { color: #4b5563 !important; }
.rp-root .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-root .ant-input-number {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; width: 100% !important;
}
.rp-root .ant-input-number .ant-input-number-input {
  background: transparent !important; color: #d1d5db !important; height: 38px !important;
}
.rp-root .ant-input-number:focus-within { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-root .ant-input-number-handler-wrap,
.rp-modal .ant-input-number-handler-wrap { background: #13151e !important; border-left: 1px solid #1e2130 !important; border-radius: 0 9px 9px 0 !important; }
.rp-root .ant-input-number-handler,
.rp-modal .ant-input-number-handler { color: #6b7280 !important; border-color: #1e2130 !important; }
/* StockIn button override — match rp-btn-filter exactly */
.rp-stockin-wrap button,
.rp-stockin-wrap .ant-btn,
.rp-stockin-wrap .ant-btn-primary,
.rp-stockin-wrap .ant-btn-default {
  height: 38px !important; border-radius: 10px !important;
  font-family: 'Outfit', sans-serif !important; font-size: 13px !important;
  font-weight: 700 !important; padding: 0 16px !important;
  background: #13151e !important; border: 1px solid #1e354a !important;
  color: #60a5fa !important; box-shadow: none !important;
  display: inline-flex !important; align-items: center !important; gap: 6px !important;
  cursor: pointer !important;
}
.rp-stockin-wrap button:hover,
.rp-stockin-wrap .ant-btn:hover { background: #13151e !important; border-color: #5b6af0 !important; color: #818cf8 !important; transform: translateY(-1px); }
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
.rp-modal .ant-modal-title { color: #e8eaf6 !important; font-size: 16px !important; font-weight: 800 !important; }
.rp-modal .ant-modal-body { padding: 24px !important; }
.rp-modal .ant-modal-close { color: #6b7280 !important; top: 16px !important; right: 16px !important; }
.rp-modal .ant-modal-close:hover { color: #e8eaf6 !important; }
.rp-modal .ant-form-item-label > label { color: #9ca3af !important; font-size: 12px !important; font-weight: 700 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; }
.rp-modal .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  font-size: 13px !important; box-shadow: none !important; height: 38px !important;
}
.rp-modal .ant-input::placeholder { color: #4b5563 !important; }
.rp-modal .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-modal .ant-select-selector {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important; font-size: 13px !important;
}
.rp-modal .ant-select-dropdown { background: #1a1d27 !important; border: 1px solid #1e2130 !important; }
.rp-modal .ant-select-item { color: #d1d5db !important; }
.rp-modal .ant-select-item-option-active { background: #5b6af015 !important; }
.rp-modal .ant-select-item-option-selected { background: #5b6af025 !important; color: #818cf8 !important; }
.rp-modal .ant-input-number {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; width: 100% !important; box-shadow: none !important;
}
.rp-modal .ant-input-number .ant-input-number-input {
  background: transparent !important; color: #d1d5db !important;
  height: 36px !important; font-size: 13px !important;
}
.rp-modal .ant-input-number:focus-within { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-modal .ant-input-number-handler-wrap { background: #13151e !important; border-left: 1px solid #1e2130 !important; border-radius: 0 10px 10px 0 !important; }
.rp-modal .ant-input-number-handler { color: #6b7280 !important; }
.rp-modal .ant-form-item-explain-error { color: #f87171 !important; font-size: 12px !important; }
.rp-modal .ant-form-item-extra { color: #4b5563 !important; font-size: 11px !important; }
.rp-modal .ant-upload.ant-upload-select-picture-card,
.rp-modal .ant-upload-list-picture-card .ant-upload-list-item {
  background: #0d0e14 !important; border: 1.5px dashed #1e2130 !important;
  border-radius: 10px !important;
}
.rp-modal .ant-upload.ant-upload-select-picture-card:hover { border-color: #5b6af0 !important; }
.rp-modal .ant-upload button { color: #6b7280 !important; }
.rp-modal .ant-upload button:hover { color: #818cf8 !important; }
.rp-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 16px; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all 0.18s;
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
  document.head.appendChild(el);
}

/* ─────────────── MAIN ─────────────── */
const Products = () => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
const { profile } = profileStore();

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const [fileList, setFileList] = useState([]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div style={{ color: '#6b7280' }}>
      <PlusOutlined style={{ fontSize: 18 }} />
      <div style={{ marginTop: 6, fontSize: 12 }}>Upload</div>
    </div>
  );

  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [filter, setFilter] = useState({ text_search: null, status: null, category_id: null, brand_id: null });
  const [state, setState] = useState({
    list: [], brand: [], category: [], open: false, loading: false,
    pagination: { current_page: 1, last_page: 1, total: 0 }
  });

  useEffect(() => {
    if (!filter.text_search && !filter.status && !filter.category_id && !filter.brand_id) {
      getLists(); return;
    }
    const delay = setTimeout(() => { getLists(); }, 400);
    return () => clearTimeout(delay);
  }, [filter]);

  const getLists = async (page = 1) => {
    setState(p => ({ ...p, loading: true }));
    const params = new URLSearchParams({
      page,
      ...Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ''))
    });
    const res = await request('product?' + params.toString(), 'get');
    if (res && !res.errors) {
      setState(p => ({
        ...p,
        list: res.proList,
        category: res.category?.length > 0 ? res.category : p.category,
        brand: res.brand?.length > 0 ? res.brand : p.brand,
        supplier: res.supplier?.length > 0 ? res.supplier : p.supplier,
        pagination: res.pagination,
        loading: false
      }));
    } else {
      setState(p => ({ ...p, loading: false }));
    }
  };

  const handlePageChange = (page) => { getLists(page); };
  const openModal  = () => {
    // Only allow users with product/manager/super_admin roles to add products
    if (!['product_staff','manager','super_admin'].includes(profile?.type)) return;
    setState(p => ({ ...p, open: true }));
  };
  const closeModal = () => { setState(p => ({ ...p, open: false })); formRef.resetFields(); setValidate({}); setFileList([]); };

  const onFinish = async (value) => {
    const formData = new FormData();
    formData.append('name', value.name || "");
    formData.append('code', value.code || "");
    formData.append('price', value.price || 0);
    formData.append('quantity', value.quantity || 0);
    formData.append('category_id', value.category_id || "");
    formData.append('brand_id', value.brand_id || "");
    formData.append('status', value.status);
    if (value.supplier_id) formData.append('supplier_id', value.supplier_id);
    if (value.image && value.image.file) {
      if (value.image.file.originFileObj) formData.append("image", value.image.file.originFileObj);
      else if (value.image.file.status === "removed") formData.append("image_remove", "true");
    }
    let url = 'product', method = "post";
    const productId = formRef.getFieldValue('id');
    if (productId) { url += '/' + productId; formData.append('_method', 'put'); }
    setState(p => ({ ...p, loading: true }));
    try {
      const res = await request(url, method, formData);
      if (res && !res.errors) { message.success(res.message || "Product saved successfully"); closeModal(); getLists(); }
      else { setValidate(res.errors || {}); if (res.message) message.error(res.message); }
    } catch (error) {
      message.error("Internal Server Error (500). Please check Laravel logs.");
    } finally {
      setState(p => ({ ...p, loading: false }));
    }
  };

  const onDelete = async (data) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure to delete "${data.name}"?`,
      okText: 'Delete', okType: 'danger',
      onOk: async () => {
        const res = await request('product/' + data.id, 'delete');
        if (res && !res.undifined) { message.success(res.message); getLists(); }
      }
    });
  };

  const onEdit = (data) => {
    openModal();
    if (data.image) {
      setFileList([{ uid: data.id, name: data.image, status: 'done', url: Config.getImage(data.image) }]);
    } else { setFileList([]); }
    formRef.setFieldsValue({ ...data });
  };

  const onFilter = () => getLists();
  const onClear  = () => setFilter({ text_search: null, status: null, category_id: null, brand_id: null });

  /* ── TABLE COLUMNS ── */
  const columns = [
    {
      key: 'name', title: 'Name', dataIndex: 'name',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.image
            ? <Image width={38} height={38} src={Config.getImage(row.image)} style={{ borderRadius: 8, objectFit: 'cover' }} />
            : <div style={{ width: 38, height: 38, borderRadius: 8, background: '#5b6af015', border: '1px solid #5b6af025', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 16 }}>
                <AppstoreOutlined />
              </div>
          }
          <div>
            <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{v}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'code', title: 'Code', dataIndex: 'code',
      render: (v) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, background: '#5b6af015', color: '#818cf8', padding: '3px 10px', borderRadius: 6, border: '1px solid #5b6af025' }}>{v}</span>
      ),
    },
    {
      key: 'category', title: 'Category', dataIndex: 'category',
      render: (v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v?.name || '—'}</span>,
    },
    {
      key: 'brand', title: 'Brand', dataIndex: 'brand',
      render: (v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v?.name || '—'}</span>,
    },
    {
      key: 'supplier', title: 'Supplier', dataIndex: 'supplier',
      render: (v) => <span style={{ color: '#6b7280', fontSize: 12 }}>{v?.name || '—'}</span>,
    },
    {
      key: 'quantity', title: 'Qty', dataIndex: 'quantity',
      render: (v) => (
        <span style={{ fontWeight: 700, color: v > 0 ? '#34d399' : '#f87171', fontSize: 13 }}>{v}</span>
      ),
    },
    {
      key: 'price', title: 'Price', dataIndex: 'price',
      render: (v) => (
        <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: 13 }}>${parseFloat(v).toFixed(2)}</span>
      ),
    },
    {
      key: 'status', title: 'Status', dataIndex: 'status',
      render: (v) => v
        ? <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#052e16',color:'#4ade80',border:'1px solid #14532d' }}><span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}/> Active</span>
        : <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#2d0707',color:'#f87171',border:'1px solid #7f1d1d' }}><span style={{width:6,height:6,borderRadius:'50%',background:'#f87171',display:'inline-block'}}/> Inactive</span>,
    },
    {
      key: 'created_at', title: 'Created At', dataIndex: 'created_at',
      render: (v) => <span style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>{dayjs(v).format('DD MMM YYYY')}</span>,
    },
    {
      key: 'action', title: 'Action', align: 'right',
      render: (data) => {
        const canEdit = ['product_staff','manager','super_admin'].includes(profile?.type);
        const canDelete = profile?.type === 'super_admin';
        return (
          <Space size={8}>
            {canEdit ? (
              <button className="rp-btn rp-btn-default" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onEdit(data)}>
                <EditOutlined /> Edit
              </button>
            ) : (
              <span style={{ color: '#6b7280', fontSize: 12 }}>No Edit</span>
            )}

            {canDelete ? (
              <button className="rp-btn rp-btn-danger" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onDelete(data)}>
                <DeleteOutlined /> Delete
              </button>
            ) : (
              <span style={{ color: '#6b7280', fontSize: 12 }}>No Delete</span>
            )}
          </Space>
        );
      },
    },

  ];

  /* ── RENDER ── */
  return (
    <div className="rp-root" style={{ background: 'transparent', minHeight: '100%' }}>

      {/* ── LOADING BAR ── */}
      {state.loading && (
        <div className="rp-progress-bar"><div className="rp-progress-bar-inner" /></div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="rp-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#818cf815', border: '1px solid #818cf825', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 18 }}>
            <AppstoreOutlined />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eaf6', margin: 0, lineHeight: 1 }}>Product Management</h2>
            <p style={{ fontSize: 12, color: '#4b5563', margin: '4px 0 0', fontWeight: 500 }}>
              {state.pagination.total || state.list.length} products total
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            height: 38, borderRadius: 10, overflow: 'hidden',
          }} className="rp-stockin-wrap">
          {['product_staff','manager','super_admin'].includes(profile?.type) && (
            <StockInAction onRefresh={getLists} />
          )}
          </div>
          {['product_staff','manager','super_admin'].includes(profile?.type) ? (
          <button className="rp-btn rp-btn-add" onClick={openModal}>
            <PlusOutlined /> Add Product
          </button>
          ) : (
          <button className="rp-btn rp-btn-add" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <PlusOutlined /> Add Product
          </button>
          )}
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="rp-up" style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: '#13151e', border: '1px solid #1e2130',
        borderRadius: 14, padding: '12px 16px', marginBottom: 20,
      }}>
        <Input
          placeholder="Search products..."
          value={filter.text_search}
          onChange={e => setFilter(p => ({ ...p, text_search: e.target.value || null }))}
          style={{ width: 200, height: 38, fontSize: 13, borderRadius: 10, boxShadow: 'none' }}
          styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
          variant="outlined"
        />
        <Select
          placeholder="Status"
          style={{ width: 120 }}
          allowClear
          value={filter.status}
          options={[
            { label: '✅  Active',   value: 'active' },
            { label: '❌  Inactive', value: 'inactive' },
          ]}
          onChange={v => setFilter(p => ({ ...p, status: v }))}
        />
        <Select
          placeholder="Category"
          style={{ width: 130 }}
          allowClear
          value={filter.category_id}
          options={state.category.map(i => ({ label: i.name, value: i.id }))}
          onChange={v => setFilter(p => ({ ...p, category_id: v }))}
        />
        <Select
          placeholder="Brand"
          style={{ width: 120 }}
          allowClear
          value={filter.brand_id}
          options={state.brand.map(i => ({ label: i.name, value: i.id }))}
          onChange={v => setFilter(p => ({ ...p, brand_id: v }))}
        />
        <button className="rp-btn rp-btn-filter" onClick={onFilter}>
          <FilterOutlined /> Filter
        </button>
        <button className="rp-btn rp-btn-default" onClick={onClear}>
          <ClearOutlined /> Clear
        </button>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background: '#13151e', border: '1px solid #1e2130', borderRadius: 16, overflow: 'hidden' }}>
        <Table
          dataSource={state.list}
          columns={columns}
          rowKey="id"
          pagination={{
            current: state.pagination.current_page,
            pageSize: 10,
            total: state.pagination.total,
            onChange: (page) => getLists(page),
            showSizeChanger: false,
            style: { padding: '12px 16px', margin: 0 },
          }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* ── MODAL ── */}
      <Modal
        className="rp-modal"
        open={state.open}
        onCancel={closeModal}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        width={620}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#818cf815', border: '1px solid #818cf825', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 14 }}>
              <AppstoreOutlined />
            </div>
            {formRef.getFieldValue('id') ? 'Edit Product' : 'Add New Product'}
          </div>
        }
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef} initialValues={{ status: 1, quantity: 0 }} style={{ marginTop: 4 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input product name!' }]} {...validate.name}>
                <Input placeholder="Product Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please input product code!' }]} {...validate.code}>
                <Input placeholder="Product Code" style={{ fontFamily: 'monospace' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quantity (Initial)" name="quantity" {...validate.quantity} extra="Optional: Set 0 if you will Stock In later">
                <InputNumber
                  style={{ width: '100%', background: '#0d0e14', borderColor: '#1e2130', borderRadius: 10, color: '#d1d5db' }}
                  styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
                  placeholder="0" min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Unit Price ($)" name="price" rules={[{ required: true, message: 'Please input price!' }]} {...validate.price}>
                <InputNumber
                  style={{ width: '100%', background: '#0d0e14', borderColor: '#1e2130', borderRadius: 10, color: '#d1d5db' }}
                  styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
                  placeholder="0.00" min={0} step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Category" name="category_id" {...validate.category_id}>
                <Select placeholder="Select Category" options={state.category.map(i => ({ label: i.name, value: i.id }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Brand" name="brand_id" {...validate.brand_id}>
                <Select placeholder="Select Brand" options={state.brand.map(i => ({ label: i.name, value: i.id }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Status" name="status" {...validate.status}>
                <Select placeholder="Select Status" options={[{ label: '✅  Active', value: 1 }, { label: '❌  Inactive', value: 0 }]} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Supplier" name="supplier_id" {...validate.supplier_id}>
                <Select placeholder="Select Supplier" options={state.supplier?.map(i => ({ label: i.name, value: i.id }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="image" label="Product Image">
                <Upload
                  listType="picture-card"
                  customRequest={e => e.onSuccess()}
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #1e2130', marginTop: 4 }}>
            <button type="button" className="rp-btn rp-btn-default" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="rp-btn rp-btn-primary">
              {formRef.getFieldValue('id') ? <><EditOutlined /> Update Product</> : <><PlusOutlined /> Save Product</>}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default Products;
