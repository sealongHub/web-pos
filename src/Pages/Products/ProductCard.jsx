import React, { useEffect, useState } from "react";
import { Row, Col, Button, Image, Typography, Space, Badge, Tag, Divider, Spin } from "antd";
import { ShoppingOutlined, MinusOutlined, PlusOutlined, ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { request } from "../../util/request";
import Config from "../../util/config";
import { cartStore } from "../../Store/productCardStore";
import Banner from '../UsersInterface/Banner';

const { Text, Title } = Typography;

const cardResponsiveStyle = `
  .product-card-img { height: 240px; padding: 20px; }
  .product-card-img img { max-height: 180px; }
  .product-card-body { padding: 16px; }
  .product-card-name { font-size: 16px !important; }
  .product-card-price { font-size: 18px !important; }
  .product-card-btn { height: 44px !important; font-size: 14px !important; }
  .product-card-qty-btn { width: 32px !important; height: 32px !important; }
  .product-card-qty-text { font-size: 14px; }
  .product-card-tag { font-size: 12px !important; padding: 0 7px !important; }

  @media (max-width: 768px) {
    .product-card-img { height: 150px; padding: 12px; }
    .product-card-img img { max-height: 110px; }
    .product-card-body { padding: 10px; }
    .product-card-name { font-size: 12px !important; line-height: 1.3 !important; }
    .product-card-price { font-size: 14px !important; }
    .product-card-btn { height: 34px !important; font-size: 11px !important; }
    .product-card-qty-btn { width: 26px !important; height: 26px !important; min-width: 26px !important; }
    .product-card-qty-text { font-size: 12px; }
    .product-card-tag { font-size: 10px !important; padding: 0 4px !important; line-height: 18px !important; }
  }
`;

const ProductCard = () => {
  const [data, setData] = useState({ proList: [], category: [], brand: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty } = cartStore();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    const res = await request("product?page=1", "get");
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading Shop..." />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f4f4f4" }}>
        <Banner/>
      <style>{cardResponsiveStyle}</style>
      {/* 1. Promo Bar */}
      <div style={{ background: "#000", color: "#fff", textAlign: "center", padding: "10px 0", fontSize: "11px", letterSpacing: "1px" }}>
        FREE DELIVERY ON ALL ORDERS OVER $40
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 20px" }}>
        
        {data.category.map((cat) => {
          const categoryProducts = data.proList.filter(p => p.category_id === cat.id);

          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat.id}>
              <div style={{ marginBottom: "20px", borderLeft: "4px solid #000", paddingLeft: "15px" }}>
                <Title level={2} style={{ margin: 0, textTransform: 'uppercase', fontWeight: '800' }}>
                  {cat.name}
                </Title>
              </div>

              <Row gutter={[16, 16]}>
                {categoryProducts.map((pro) => {
                  const cartItem = cart.find((i) => i.id === pro.id);
                  const isOutOfStock = pro.quantity <= 0;

                  return (
                    // ✅ xs={12} sm={12} → 2 cards per row on mobile & iPad, original size on desktop
                    <Col xs={12} sm={12} md={8} lg={6} key={pro.id}>
                      <div style={{ 
                        background: "#fff", 
                        borderRadius: "12px", 
                        border: "1px solid #e8e8e8",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        height: "100%",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        {/* --- IMAGE SECTION --- */}
                        <div className="product-card-img" style={{ 
                          background: "#fff", 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          borderBottom: "1px solid #f0f0f0"
                        }}>
                          <Image
                            src={Config.getImage(pro.image)}
                            preview={false}
                            style={{ width: "100%", objectFit: "contain" }}
                          />
                          
                          <div style={{ position: "absolute", top: 8, left: 8 }}>
                            {isOutOfStock ? (
                              <Tag color="default" className="product-card-tag" style={{ borderRadius: "4px", margin: 0 }}>Out of Stock</Tag>
                            ) : (
                              <Tag color="success" icon={<CheckCircleFilled />} className="product-card-tag" style={{ borderRadius: "4px", margin: 0 }}>
                                In Stock
                              </Tag>
                            )}
                          </div>
                        </div>

                        {/* --- CONTENT SECTION --- */}
                        <div className="product-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <div style={{ marginBottom: "12px" }}>
                            <Title level={5} className="product-card-name" style={{ margin: "0 0 4px 0", fontWeight: "600", lineHeight: "1.4" }}>
                              {pro.name}
                            </Title>
                            <Text className="product-card-price" style={{ fontWeight: "800", color: "#000" }}>
                              ${pro.price}
                            </Text>
                          </div>

                          <div style={{ marginTop: "auto" }}>
                            {cartItem ? (
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                background: "#f5f5f5", 
                                borderRadius: "8px", 
                                padding: "4px"
                              }}>
                                <Button className="product-card-qty-btn" type="text" shape="circle" icon={<MinusOutlined />} onClick={() => decreaseQty(pro.id)} />
                                <Text strong className="product-card-qty-text">{cartItem.qty}</Text>
                                <Button className="product-card-qty-btn" type="text" shape="circle" icon={<PlusOutlined />} onClick={() => addToCart(pro)} />
                              </div>
                            ) : (
                              <Button
                                block
                                size="large"
                                disabled={isOutOfStock}
                                className="product-card-btn"
                                style={{ 
                                  borderRadius: "8px", 
                                  fontWeight: "600", 
                                  background: isOutOfStock ? "#d9d9d9" : "#000", 
                                  color: "#fff",
                                  border: "none",
                                }}
                                onClick={() => addToCart(pro)}
                              >
                                {isOutOfStock ? "Unavailable" : "Add to Bag"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              <Divider />
            </div>
          );
        })}
      </div>

      {/* --- FLOATING CART ISLAND --- */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "420px", zIndex: 1000 }}>
          <div 
            onClick={() => navigate("/checkout")}
            style={{
              background: "#1a1a1a", padding: "14px 24px", borderRadius: "100px", 
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
              boxShadow: "0 15px 30px rgba(0,0,0,0.3)"
            }}
          >
            <Space size="middle">
              <Badge count={totalQty} color="#fff" style={{ color: '#000' }}>
                <ShoppingOutlined style={{ fontSize: "22px", color: "#fff" }} />
              </Badge>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Checkout</Text>
            </Space>
            <Space>
              <Text style={{ color: "#fff", fontSize: "18px", fontWeight: "700" }}>${totalPrice.toFixed(2)}</Text>
              <ArrowRightOutlined style={{ color: "#fff" }} />
            </Space>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
