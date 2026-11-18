import React, { useEffect, useState } from 'react'
import { Input, Table, Modal, Form, Select, message, Image, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined, PictureOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { request } from '../../util/request_fixed'
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/config';

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
.rp-root .ant-select-arrow { color: #4b5563 !important; }
.rp-root .ant-input {
  background: #0d0e14 !important; border: 1.5px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important;
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-root .ant-input::placeholder { color: #4b5563 !important; }
.rp-root .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
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
  height: 38px !important; font-size: 13px !important; box-shadow: none !important;
}
.rp-modal .ant-input::placeholder { color: #4b5563 !important; }
.rp-modal .ant-input:focus { border-color: #5b6af0 !important; box-shadow: none !important; }
.rp-modal .ant-select-selector {
  background: #0d0e14 !important; border: 1px solid #1e2130 !important;
  border-radius: 10px !important; color: #d1d5db !important; font-size: 13px !important;
}
.rp-modal .ant-form-item-explain-error { color: #f87171 !important; font-size: 12px !important; }
/* Upload dark */
.rp-modal .ant-upload-select { background: #0d0e14 !important; border: 1.5px dashed #1e2130 !important; border-radius: 12px !important; }
.rp-modal .ant-upload-select:hover { border-color: #5b6af0 !important; }
.rp-modal .ant-upload-list-item { background: #0d0e14 !important; border: 1px solid #1e2130 !important; border-radius: 10px !important; }
.rp-modal .ant-upload-list-item-name { color: #d1d5db !important; }
.rp-modal .ant-upload-list-item-action { color: #6b7280 !important; }
.rp-modal .ant-upload-wrapper .ant-upload-list-item-container { border-radius: 12px !important; }
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
const FounderImage = () => {

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const [fileList, setFileList]   = useState([]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const [formRef] = Form.useForm();
  const [validate, setValidate]   = useState({});
  const [filter, setFilter]       = useState({ text_search: null, status: null });
  const [state, setState]         = useState({ list: [], open: false, loading: false });

  useEffect(() => {
    const delay = setTimeout(() => { getLists(); }, 100);
    return () => clearTimeout(delay);
  }, [filter]);

  const getLists = async () => {
    setState(p => ({ ...p, loading: true }));
    const res = await request('founderimage', 'get');
    if (res) setState(p => ({ ...p, list: res.founderImageList, loading: false }));
  };

  const openModal  = () => setState(p => ({ ...p, open: true }));
  const closeModal = () => {
    setState(p => ({ ...p, open: false }));
    formRef.resetFields();
    setValidate({});
    setFileList([]);
  };

  const onFinish = async (value) => {
    const formData = new FormData();
    formData.append('title', value.title?.trim() ?? '');
    formData.append('description', value.description ?? '');
    const imageFile = fileList.find(file => file.originFileObj)?.originFileObj;
    if (imageFile) formData.append('image', imageFile);

    let url = 'founderimage', method = "post";
    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id');
      formData.append('_method', 'put');
    }
    const res = await request(url, method, formData);
    if (res && !res.errors) { message.success(res.message); closeModal(); getLists(); }
    else setValidate(res.errors);
  };

  const onDelete = async (data) => {
    Modal.confirm({
      title: "Delete Founder Image",
      content: `Are you sure to delete "${data.title}"?`,
      okText: 'Delete', okType: 'danger',
      onOk: async () => {
        const res = await request('founderimage/' + data.id, 'delete');
        if (res && !res.undifined) { message.success(res.message); getLists(); }
      }
    });
  };

  const onEdit = (data) => {
    openModal();
    if (data.image) {
      setFileList([{
        uid: data.id, name: data.image, status: 'done',
        url: Config.getImage(data.image), originFileObj: null,
      }]);
    } else { setFileList([]); }
    formRef.setFieldsValue({
      ...data, id: data.id,
      image: data.image ? { file: { status: 'done', url: data.image } } : null
    });
  };

  const onFilter = () => getLists();
  const onClear  = () => setFilter({ text_search: null, status: null });

  /* ── COLUMNS ── */
  const columns = [
    {
      key: 'title', title: 'Title', dataIndex: 'title',
      render: (v) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: '#818cf815', border: '1px solid #818cf825',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#818cf8', fontSize: 13,
          }}>
            <PictureOutlined />
          </div>
          <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{v}</span>
        </div>
      ),
    },
    {
      key: 'image', title: 'Image', dataIndex: 'image',
      render: (v) => v
        ? <Image width={52} height={52} src={Config.getImage(v)}
            style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid #1e2130' }} />
        : <span style={{ color: '#4b5563', fontSize: 12 }}>No Image</span>,
    },
    {
      key: 'description', title: 'Description', dataIndex: 'description',
      render: (v) => <span style={{ color: '#6b7280', fontSize: 12 }}>{v || '—'}</span>,
    },
    {
      key: 'created_at', title: 'Created At', dataIndex: 'created_at',
      render: (v) => <span style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>{dayjs(v).format('DD MMM YYYY')}</span>,
    },
    {
      key: 'action', title: 'Action', align: 'right',
      render: (data) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="rp-btn rp-btn-default" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onEdit(data)}>
            <EditOutlined /> Edit
          </button>
          <button className="rp-btn rp-btn-danger" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => onDelete(data)}>
            <DeleteOutlined /> Delete
          </button>
        </div>
      ),
    },
  ];

  /* ── UPLOAD BUTTON ── */
  const uploadButton = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 0', color: '#4b5563' }}>
      <PlusOutlined style={{ fontSize: 18, color: '#5b6af0' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Upload</span>
    </div>
  );

  /* ── RENDER ── */
  return (
    <div className="rp-root" style={{ background: 'transparent', minHeight: '100%' }}>

      {/* ── LOADING BAR ── */}
      {state.loading && <div className="rp-progress-bar"><div className="rp-progress-bar-inner" /></div>}

      {/* ── PAGE HEADER ── */}
      <div className="rp-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: '#818cf815', border: '1px solid #818cf825',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#818cf8', fontSize: 18,
          }}>
            <PictureOutlined />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eaf6', margin: 0, lineHeight: 1 }}>
              Founder Images
            </h2>
            <p style={{ fontSize: 12, color: '#4b5563', margin: '4px 0 0', fontWeight: 500 }}>
              {state.list?.length || 0} image{state.list?.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <button className="rp-btn rp-btn-add" onClick={openModal}>
          <PlusOutlined /> Add Founder Image
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="rp-up" style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: '#13151e', border: '1px solid #1e2130',
        borderRadius: 14, padding: '12px 16px', marginBottom: 20,
      }}>
        <Input
          placeholder="Search founder images..."
          value={filter.text_search}
          onChange={e => setFilter(p => ({ ...p, text_search: e.target.value || null }))}
          style={{ width: 240, height: 38, fontSize: 13, borderRadius: 10, boxShadow: 'none' }}
          styles={{ input: { background: '#0d0e14', color: '#d1d5db' } }}
        />
        <Select
          placeholder="Status"
          value={filter.status}
          style={{ width: 130 }}
          options={[
            { label: 'Active',   value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          onChange={v => setFilter(p => ({ ...p, status: v }))}
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
          pagination={{ pageSize: 10, style: { padding: '12px 16px', margin: 0 } }}
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
        width={460}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#818cf815', border: '1px solid #818cf825',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#818cf8', fontSize: 14,
            }}>
              <PictureOutlined />
            </div>
            {formRef.getFieldValue('id') ? 'Edit Founder Image' : 'Add Founder Image'}
          </div>
        }
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef} style={{ marginTop: 4 }}>
          <Form.Item name="id" hidden><Input /></Form.Item>

          <Form.Item label="Title" name="title" {...validate.title}>
            <Input placeholder="Founder Image Title" />
          </Form.Item>

          <Form.Item label="Description" name="description" {...validate.description}>
            <Input placeholder="Founder Image Description" />
          </Form.Item>

          <Form.Item name="image" label="Image">
            <Upload
              listType="picture-card"
              customRequest={e => e.onSuccess()}
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length === 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            paddingTop: 8, borderTop: '1px solid #1e2130', marginTop: 4,
          }}>
            <button type="button" className="rp-btn rp-btn-default" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="rp-btn rp-btn-primary">
              {formRef.getFieldValue('id') ? <><EditOutlined /> Update</> : <><PlusOutlined /> Save</>}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default FounderImage;
