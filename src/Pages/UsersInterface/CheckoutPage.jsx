import React, { useEffect, useState, useRef } from 'react';
import {
  Row, Col, Input, Button, Divider, Radio, Space,
  Image, Checkbox, Select, Form, Modal, Upload, message, Spin
} from 'antd';
import {
  ShoppingOutlined, CreditCardOutlined,
  MinusOutlined, PlusOutlined, UploadOutlined, LoadingOutlined
} from '@ant-design/icons';
import { cartStore } from "../../Store/productCardStore";
import { useNavigate } from 'react-router-dom';
import Config from "../../util/config";
import { request } from '../../util/request_fixed';
import QRCode from '../../assets/QRCode.PNG';
import html2canvas from 'html2canvas';

const CheckoutPage = () => {
  const { cart, addToCart, decreaseQty, removeFromCart } = cartStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 40 ? 0 : 1.5;
  const total = subtotal + deliveryFee;

  const [state, setState] = useState({
    list: [],
    category: []
  });

  const [filter, setFilter] = useState({
    province_id: null,
  });

  const [formRef] = Form.useForm();
  const [qrVisible, setQrVisible] = useState(false);
  const [qrInfo, setQrInfo] = useState({ method: "", qrUrl: "" });
  const [fileList, setFileList] = useState([]);

  // ✅ NEW: invoice modal state
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    try {
      const res = await request('provinces', 'get');
      if (!res.errors) {
        setState(p => ({
          ...p,
          list: res.provinces || [],
          category: res.category || []
        }));
      }
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const onFinish = (values) => {
    console.log("Form values:", values);

    const selectedMethod = values.payment_method;
    let qrImage = "";

    if (selectedMethod === "aba") {
      qrImage = "https://www.ababank.com/uploads/qr/aba_qr_example.png";
    } else if (selectedMethod === "acleda") {
      qrImage = "https://www.acledabank.com.kh/kh/assets/qrcode_sample.png";
    }

    setQrInfo({ method: selectedMethod, qrUrl: qrImage });
    setQrVisible(true);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const { clearCart } = cartStore();

  const handleTransactionSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Please upload your transaction screenshot.");
      return;
    }

    const values = formRef.getFieldsValue();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("buyer_name", values.buyer_name);
    formData.append("buyer_phone", values.buyer_phone);
    formData.append("address", values.address);
    formData.append("province_id", values.province_id);
    formData.append("note", values.note || "");
    formData.append("payment_method", values.payment_method);
    formData.append("total", total);
    formData.append("delivery_fee", deliveryFee);
    formData.append("cart", JSON.stringify(cart));
    formData.append(
      "items",
      JSON.stringify(
        cart.map(item => ({
          id: item.id,
          qty: item.qty
        }))
      )
    );

    if (fileList[0]?.originFileObj) {
      formData.append("transaction_image", fileList[0].originFileObj);
    }

    try {
      const res = await request("purchase", "post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.success) {
        message.success("Transaction submitted successfully!");

        const province = state.list.find(p => p.id === values.province_id);
        setInvoiceData({
          order_id: res.order_id,
          buyer_name: values.buyer_name,
          buyer_phone: values.buyer_phone,
          address: values.address,
          province: province ? province.name : "",
          payment_method: values.payment_method,
          note: values.note || "",
          items: [...cart],
          subtotal,
          delivery_fee: deliveryFee,
          total,
          date: new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
          }),
        });

        clearCart();
        setQrVisible(false);
        formRef.resetFields();
        setFileList([]);
        setSubmitting(false);

        setTimeout(() => setInvoiceVisible(true), 100);

      } else {
        setSubmitting(false);
        message.error(res.message || "Failed to submit order.");
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      message.error("Server error. Please try again.");
    }
  };

  // ✅ Download invoice as image
  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `invoice_${invoiceData?.order_id || 'order'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      message.error("Failed to download invoice.");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      {/* 1. Shopping Bag Section */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>
          <ShoppingOutlined style={{ marginRight: 8 }} /> Shopping Bag
        </h2>
        <Divider style={{ borderStyle: 'dashed' }} />

        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Space size="large">
              <Image
                src={Config.getImage(item.image)}
                width={50}
                preview={false}
                style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '500' }}>{item.name}</div>
                <Space style={{ border: '1px solid #eee', padding: '2px 4px', borderRadius: 4, marginTop: 5 }}>
                  <Button type="text" size="small" icon={<MinusOutlined />} onClick={() => decreaseQty(item.id)} />
                  <span style={{ width: 25, textAlign: 'center', display: 'inline-block', fontWeight: 'bold' }}>{item.qty}</span>
                  <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => addToCart(item)} />
                </Space>
              </div>
            </Space>
            <Button type="link" danger onClick={() => removeFromCart(item.id)} style={{ fontSize: 12 }}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 30 }}>
        <CreditCardOutlined style={{ marginRight: 8 }} /> Checkout
      </h2>

      <Form layout="vertical" onFinish={onFinish} form={formRef}>
        <Row gutter={40}>
          {/* 1. Left Side: Buyer & Delivery Info */}
          <Col xs={24} md={14}>
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: 15 }}>Buyer Information</h3>

              <Form.Item
                label="Name"
                name="buyer_name"
                rules={[{ required: true, message: 'Please enter buyer name' }]}
              >
                <Input placeholder="Ex: LEE SHEERLONG" prefix={<span style={{ color: '#ccc' }}>👤</span>} style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="buyer_phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Ex: 0xx xxx xxx" prefix={<span style={{ color: '#ccc' }}>📞</span>} style={{ borderRadius: 6 }} />
              </Form.Item>
            </div>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: 5 }}>Delivery Information</h3>
              <p style={{ fontSize: 12, color: '#666' }}>
                We will provide to <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>J&T</span>
              </p>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Ex: Chbar Ampov" prefix={<span style={{ color: '#ccc' }}>📍</span>} style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item
                label="Province"
                name="province_id"
                rules={[{ required: true, message: 'Please select province' }]}
              >
                <Select
                  placeholder="Select Provinces"
                  style={{ width: '100%' }}
                  options={state.list.map(item => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Note" name="note">
                <Input.TextArea rows={3} placeholder="Please help write.." style={{ borderRadius: 6 }} />
              </Form.Item>
            </div>

            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: 15 }}>Payment Method</h3>
              <Form.Item
                name="payment_method"
                rules={[{ required: true, message: 'Please select payment method' }]}
                initialValue="aba"
              >
                <Radio.Group style={{ width: '100%' }}>
                  {[
                    {
                      key: 'aba',
                      title: 'ABA Bakong',
                      desc: 'Scan to pay with upload transaction',
                      img: 'https://play-lh.googleusercontent.com/WU6sZMD1UspzwqYnlACtmN60rckp8hoINSgsR21mKLJBbsHPwXtzwvOocpjC7FcO1g=w240-h480-rw',
                    },
                    {
                      key: 'acleda',
                      title: 'Acleda Bank',
                      desc: 'Scan to pay with upload transaction',
                      img: 'https://www.acledasecurities.com.kh/as/assets/listed_company/ABC/logo.png',
                    },
                  ].map((option) => (
                    <Form.Item noStyle shouldUpdate key={option.key}>
                      {({ getFieldValue, setFieldsValue }) => {
                        const isActive = getFieldValue('payment_method') === option.key;
                        return (
                          <div
                            onClick={() => setFieldsValue({ payment_method: option.key })}
                            style={{
                              border: isActive ? '2px solid #1677ff' : '1px solid #f0f0f0',
                              padding: '12px 15px',
                              borderRadius: 8,
                              marginBottom: 10,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              background: isActive ? '#e6f4ff' : '#fff',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Space>
                              <img src={option.img} alt={option.title} style={{ width: 40, height: 40 }} />
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: 13 }}>{option.title}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{option.desc}</div>
                              </div>
                            </Space>
                            <Radio value={option.key} checked={isActive} />
                          </div>
                        );
                      }}
                    </Form.Item>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>

          {/* 2. Right Side: Summary */}
          <Col xs={24} md={10}>
            <div
              style={{
                border: '1px dashed #d9d9d9',
                padding: 20,
                borderRadius: 12,
                background: '#fff',
              }}
            >
              <h3 style={{ fontWeight: 'bold', marginBottom: 20 }}>Summary</h3>

              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    color: '#555',
                  }}
                >
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  color: '#555',
                }}
              >
                <span>Delivery fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>

              <Divider style={{ borderStyle: 'dashed', margin: '15px 0' }} />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                <span>Total:</span>
                <span style={{ color: '#000' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              style={{
                background: '#141414',
                color: '#fff',
                marginTop: 20,
                height: 50,
                borderRadius: 8,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <CreditCardOutlined /> Purchase
            </Button>
          </Col>
        </Row>
      </Form>

      {/* ✅ QR Modal — unchanged layout, same logic */}
      <Modal
        title={null}
        open={qrVisible}
        onCancel={() => setQrVisible(false)}
        footer={null}
        centered
        width={380}
        bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}
      >
        <div
          style={{
            background: '#fff',
            textAlign: 'center',
            padding: '30px 20px',
            borderRadius: 16,
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: 5 }}>
            Pay with {qrInfo.method?.toUpperCase()}
          </h3>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
            Please scan the QR code below to complete your payment.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              background: '#fafafa',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Image
              src={qrInfo.qrUrl}
              width={220}
              height={300}
              preview={false}
              style={{
                border: '2px solid #e6e6e6',
                borderRadius: 12,
                background: '#fff',
                objectFit: 'cover',
                marginBottom: 10,
              }}
              fallback={QRCode}
            />
            <span style={{ fontSize: 12, color: '#999' }}>Scan using your mobile banking app</span>
          </div>

          <div
            style={{
              background: '#f9f9f9',
              padding: '10px 15px',
              borderRadius: 8,
              marginBottom: 20,
              textAlign: 'left',
            }}
          >
            <p style={{ marginBottom: 5 }}>
              <strong>Buyer:</strong> {formRef.getFieldValue('buyer_name') || '—'}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Total:</strong>{' '}
              <span style={{ color: '#1677ff', fontWeight: 'bold' }}>
                ${total.toFixed(2)}
              </span>
            </p>
          </div>

          <div
            style={{
              background: '#f9f9f9',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleUploadChange}
              fileList={fileList}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Transaction Screenshot</Button>
            </Upload>
          </div>

          <Button
            type="primary"
            block
            style={{
              height: 45,
              borderRadius: 8,
              fontWeight: 'bold',
              background: submitting ? '#555' : '#141414',
              transition: 'background 0.2s',
            }}
            onClick={handleTransactionSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Space>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: '#fff' }} spin />} />
                <span>Processing...</span>
              </Space>
            ) : (
              'Submit Transaction'
            )}
          </Button>
        </div>
      </Modal>

      {/* ✅ NEW: Invoice Modal */}
      <Modal
        title={null}
        open={invoiceVisible}
        onCancel={() => setInvoiceVisible(false)}
        footer={null}
        centered
        width={440}
        bodyStyle={{ padding: 0, borderRadius: 20, overflow: 'hidden' }}
      >
        <div style={{ background: '#f5f5f5', padding: '24px 20px 20px' }}>

          {/* ── Downloadable invoice card ── */}
          <div
            ref={invoiceRef}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              overflow: 'hidden',
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            <div
              style={{
                background: '#141414',
                padding: '20px 24px 16px',
                color: '#fff',
                position: 'relative',
              }}
            >
              {/* Bank logo row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: '#fff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 11, color: '#141414',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    SHOP
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Sheerlong Shop</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>ABA Bakong · QR Payment</div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 20, padding: '3px 12px',
                    fontSize: 11, fontWeight: 600,
                  }}
                >
                  PAID
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'center', paddingBottom: 4 }}>
                <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>Total Amount</div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1px' }}>
                  ${invoiceData?.total?.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{invoiceData?.date}</div>
              </div>

              {/* Decorative circles */}
              <div style={{
                position: 'absolute', bottom: -22, left: -22,
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }} />
              <div style={{
                position: 'absolute', top: -18, right: -18,
                width: 70, height: 70, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
              }} />
            </div>

            {/* Jagged edge */}
            <div style={{ display: 'flex', background: '#f5f5f5', height: 18, overflow: 'hidden' }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '5.5%', height: 18,
                    background: '#ffffff',
                    clipPath: 'ellipse(50% 100% at 50% 0%)',
                  }}
                />
              ))}
            </div>

            {/* Order Info */}
            <div style={{ padding: '6px 24px 0' }}>
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 11, color: '#999' }}>Order ID</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#141414' }}>
                  #{invoiceData?.order_id}
                </span>
              </div>

              {/* Buyer row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Buyer</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{invoiceData?.buyer_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Phone</span>
                <span style={{ fontSize: 12, color: '#1a1a1a' }}>{invoiceData?.buyer_phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Address</span>
                <span style={{ fontSize: 12, color: '#1a1a1a', textAlign: 'right', maxWidth: '58%' }}>
                  {invoiceData?.address}{invoiceData?.province ? `, ${invoiceData.province}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Payment</span>
                <span
                  style={{
                    fontSize: 11, fontWeight: 700,
                    background: '#f0f0f0', color: '#141414',
                    borderRadius: 4, padding: '2px 8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {invoiceData?.payment_method}
                </span>
              </div>

              {/* Dashed separator */}
              <div style={{ borderTop: '1.5px dashed #e8e8e8', margin: '12px 0' }} />

              {/* Items */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Items
                </div>
                {invoiceData?.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#444' }}>
                      {item.name}
                      <span style={{ color: '#aaa', marginLeft: 4 }}>×{item.qty}</span>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dashed separator */}
              <div style={{ borderTop: '1.5px dashed #e8e8e8', margin: '10px 0' }} />

              {/* Subtotals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Subtotal</span>
                <span style={{ fontSize: 12, color: '#1a1a1a' }}>${invoiceData?.subtotal?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Delivery fee</span>
                <span style={{ fontSize: 12, color: '#1a1a1a' }}>${invoiceData?.delivery_fee?.toFixed(2)}</span>
              </div>

              {/* Total row */}
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f5f5f5',
                  borderRadius: 8, padding: '10px 14px',
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#141414' }}>
                  ${invoiceData?.total?.toFixed(2)}
                </span>
              </div>

              {/* Footer note */}
              <div style={{ textAlign: 'center', paddingBottom: 18 }}>
                <div style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.3px' }}>
                  Thank you for your purchase · Sheerlong Shop
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Buttons (outside downloadable area) ── */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button
              block
              onClick={handleDownloadInvoice}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                background: '#141414',
                color: '#fff',
                border: 'none',
              }}
            >
              ⬇ Download Invoice
            </Button>
            <Button
              block
              onClick={() => {
                setInvoiceVisible(false);
                navigate('/');
              }}
              style={{
                height: 44,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                background: '#555',
                color: '#fff',
                border: 'none',
              }}
            >
              🏠 Back to Home
            </Button>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default CheckoutPage;
