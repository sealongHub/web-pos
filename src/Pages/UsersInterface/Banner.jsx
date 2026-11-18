import React from 'react';
import { Button, Carousel, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import cover from '../../assets/COVER.JPG';
import banner from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';

const { Title, Text } = Typography;

const bannerResponsiveStyle = `
  .banner-slide { height: 500px; }
  .banner-content { padding: 0 60px; }
  .banner-subtitle { font-size: 12px !important; letter-spacing: 4px; margin-bottom: 10px; }
  .banner-title { font-size: 56px !important; margin: 0 0 20px !important; letter-spacing: -2px; line-height: 1.1 !important; }
  .banner-desc { font-size: 18px !important; margin-bottom: 30px; }
  .banner-btn { height: 54px !important; padding: 0 40px !important; font-size: 15px !important; }

  @media (max-width: 768px) {
    .banner-slide { height: 260px; }
    .banner-content { padding: 0 20px; }
    .banner-subtitle { font-size: 10px !important; letter-spacing: 2px; margin-bottom: 6px; }
    .banner-title { font-size: 22px !important; margin: 0 0 10px !important; letter-spacing: -0.5px; line-height: 1.15 !important; }
    .banner-desc { font-size: 12px !important; margin-bottom: 16px; }
    .banner-btn { height: 38px !important; padding: 0 20px !important; font-size: 12px !important; border-radius: 8px !important; }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .banner-slide { height: 380px; }
    .banner-content { padding: 0 40px; }
    .banner-title { font-size: 38px !important; letter-spacing: -1px; }
    .banner-desc { font-size: 15px !important; margin-bottom: 24px; }
    .banner-btn { height: 46px !important; padding: 0 30px !important; }
  }
`;

const Banner = () => {
  const bannerItems = [
    {
      id: 1,
      title: "SHEERLONG ELETRONICS",
      subtitle: "Best Quality Products",
      desc: "Luxury Computer best quality Macbook TuF Gaming Lenovo Dell.",
      image: banner,
      dark: true
    },
    {
      id: 2,
      title: "MODERN SMARTPHONES",
      subtitle: "New Collection",
      desc: "Experience the future with our latest range of smartphones.",
      image: banner2,
      dark: false
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <style>{bannerResponsiveStyle}</style>
      <Carousel autoplay effect="fade" speed={1000}>
        {bannerItems.map((item) => (
          <div key={item.id}>
            <div className="banner-slide" style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden'
            }}>
              {/* Overlay for text readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
                zIndex: 1
              }} />

              {/* Content */}
              <div className="banner-content" style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '1400px',
                width: '100%',
                color: '#fff'
              }}>
                <div style={{ maxWidth: '600px' }}>
                  <Text className="banner-subtitle" style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 'bold',
                    display: 'block',
                  }}>
                    {item.subtitle}
                  </Text>
                  <Title className="banner-title" style={{
                    color: '#fff',
                    fontWeight: '900',
                  }}>
                    {item.title}
                  </Title>
                  <Text className="banner-desc" style={{
                    color: 'rgba(255,255,255,0.9)',
                    display: 'block',
                    fontWeight: '300'
                  }}>
                    {item.desc}
                  </Text>

                  <Button
                    size="large"
                    className="banner-btn"
                    style={{
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    Shop Now <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
