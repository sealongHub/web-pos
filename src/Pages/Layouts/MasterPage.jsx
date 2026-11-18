import React, { useState } from 'react';
import {
  PieChartOutlined,
  DesktopOutlined,
  ShopOutlined,
  TagsOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,

  // ✅ ADD THESE ONLY
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Badge, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import pos_logo from '../../assets/pos_logo.jpg';
import profileStore from '../../Store/profileStore';
import { Dropdown, Space } from 'antd';
import config from '../../util/config';
import { useEffect } from 'react';

const { Content, Sider } = Layout;

/* ── inject CSS once ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  --bg-base:    #0d0e14;
  --bg-sider:   #111318;
  --bg-card:    #16181f;
  --bg-hover:   #1e2029;
  --border:     #1f2130;
  --accent:     #5b6af0;
  --accent-dim: #5b6af022;
  --txt-1:      #e8eaf6;
  --txt-2:      #6b7280;
  --txt-3:      #9ca3af;
}

.mp-root * { box-sizing: border-box; }
.mp-root, .mp-root * { font-family: 'Outfit', sans-serif !important; }

/* ── Scrollbar ── */
.mp-root ::-webkit-scrollbar { width: 4px; }
.mp-root ::-webkit-scrollbar-track { background: var(--bg-sider); }
.mp-root ::-webkit-scrollbar-thumb { background: #2a2d3e; border-radius: 10px; }

/* ── Sider override ── */
.mp-sider .ant-layout-sider { background: var(--bg-sider) !important; border-right: 1px solid var(--border) !important; }
.mp-sider .ant-layout-sider-trigger {
  background: #13151d !important;
  border-top: 1px solid var(--border) !important;
  color: var(--txt-2) !important;
  transition: color 0.2s;
}
.mp-sider .ant-layout-sider-trigger:hover { color: var(--accent) !important; }

/* ── Menu override ── */
.mp-menu.ant-menu { background: transparent !important; border: none !important; padding: 8px 10px; }
.mp-menu .ant-menu-item,
.mp-menu .ant-menu-submenu-title {
  border-radius: 10px !important;
  color: var(--txt-2) !important;
  margin: 2px 0 !important;
  height: 42px !important;
  line-height: 42px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  transition: all 0.18s ease !important;
}
.mp-menu .ant-menu-item:hover,
.mp-menu .ant-menu-submenu-title:hover {
  background: var(--bg-hover) !important;
  color: var(--txt-1) !important;
}
.mp-menu .ant-menu-item-selected {
  background: var(--accent-dim) !important;
  color: var(--accent) !important;
}
.mp-menu .ant-menu-item-selected .anticon { color: var(--accent) !important; }
.mp-menu .anticon { font-size: 15px !important; }
.mp-menu .ant-menu-sub { background: transparent !important; }
.mp-menu .ant-menu-submenu-arrow { color: var(--txt-2) !important; }

/* ── Sidebar active left bar ── */
.mp-menu .ant-menu-item-selected::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 60%;
  background: var(--accent);
  border-radius: 0 4px 4px 0;
}
.mp-menu .ant-menu-item { position: relative; overflow: visible; }

/* ── Header search ── */
.mp-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 10px; padding: 0 14px; height: 38px;
  transition: border-color 0.2s;
}
.mp-search:focus-within { border-color: var(--accent); }
.mp-search input {
  background: transparent; border: none; outline: none;
  color: var(--txt-1); font-size: 13px; font-family: 'Outfit', sans-serif;
  width: 160px;
}
.mp-search input::placeholder { color: var(--txt-2); }

/* ── Icon button ── */
.mp-icon-btn {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--bg-card); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--txt-2); font-size: 16px;
  transition: all 0.18s;
}
.mp-icon-btn:hover { background: var(--bg-hover); color: var(--accent); border-color: var(--accent); }

/* ── Avatar dropdown ── */
.mp-user {
  display: flex; align-items: center; gap: 10px;
  padding: 5px 12px 5px 5px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; cursor: pointer;
  transition: all 0.18s;
}
.mp-user:hover { background: var(--bg-hover); border-color: var(--accent); }

/* ── Fade-in ── */
@keyframes mp-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.mp-fadein { animation: mp-fadein 0.35s ease both; }

/* ── Content area ── */
.mp-content-inner {
  background: var(--bg-card) !important;
  border-radius: 16px !important;
  border: 1px solid var(--border);
  min-height: 360px;
  padding: 24px;
}
`;


if (typeof document !== 'undefined' && !document.getElementById('mp-css')) {
  const el = document.createElement('style');
  el.id = 'mp-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}



/* ── Helpers ── */
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  // 🔝 1. Dashboard
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),

  // 👥 2. User Management
  getItem('User Management', 'user-group', <UsergroupAddOutlined />, [
    getItem('Users', '/users', <UserOutlined />),
    getItem('Roles', '/role', <TeamOutlined />),
  ]),

  // 📦 3. Product Management
  getItem('Product Management', 'product-group', <AppstoreOutlined />, [
    getItem('Categories', '/category', <AppstoreOutlined />),
    getItem('Brands', '/brand', <TagsOutlined />),
    getItem('Products', '/products', <ShopOutlined />),
  ]),

  // 🚚 4. Supplier
  getItem('Supplier', '/supplier', <TeamOutlined />),

  // 🛒 5. Orders
  getItem('Orders', '/orders', <ShoppingCartOutlined />),

  // 📍 6. Location
  getItem('Location', 'location-group', <EnvironmentOutlined />, [
    getItem('Provinces', '/provinces', <EnvironmentOutlined />),
  ]),

  // 🕘 7. Stock
  getItem('Stock History', '/stock-transaction', <HistoryOutlined />),

  // 📄 8. Reports
  getItem('Reports', '/reports', <FileTextOutlined />),

  // ⚙️ 9. Settings
  getItem('Settings', 'settings', <SettingOutlined />, [
    getItem('Founder Image', '/founder', <PictureOutlined />),
  ]),
];

const items_dropdown = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        View Profile
      </a>
    ),
  },
  {
    key: 'logout',
    danger: true,
    label: 'Logout',
  },
];

/* ── Logo mark ── */
const LogoMark = ({ collapsed }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: collapsed ? '20px 0' : '20px 16px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderBottom: '1px solid #1f2130',
    marginBottom: 8,
    transition: 'all 0.25s',
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10, overflow: 'hidden',
      background: '#5b6af015', border: '1px solid #5b6af030',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <img src={pos_logo} alt="logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
    </div>
    {!collapsed && (
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#e8eaf6', lineHeight: 1, letterSpacing: '-0.3px' }}>
          SHEERLONG SHOP
        </div>
        <div style={{ fontSize: 10, color: '#5b6af0', fontWeight: 600, marginTop: 2, letterSpacing: '0.5px' }}>
          ADMIN PANEL
        </div>
      </div>
    )}
  </div>
);

/* ─────────────── MAIN ─────────────── */
const MasterPage = () => {
  const { profile, logout } = profileStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  

  useEffect(() => {
    if (
      location.pathname.startsWith('/category') ||
      location.pathname.startsWith('/products') ||
      location.pathname.startsWith('/brand')
    ) {
      setOpenKeys(['product-group']);
    } else if (
      location.pathname.startsWith('/users') ||
      location.pathname.startsWith('/role')
    ) {
      setOpenKeys(['user-group']);
    } 
     else if (
      location.pathname.startsWith('/founder')
    ) {
      setOpenKeys(['settings']);
    } else if (
      location.pathname.startsWith('/provinces')
    ) {
      setOpenKeys(['location-group']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  if (!profile) {
    return null;
  }
  const [collapsed, setCollapsed] = useState(false);

  const allowedForUserManagement = ['super_admin'];
  const isSuper = allowedForUserManagement.includes(profile?.type);
  const filteredItems = items.filter(i => {
    if (!isSuper && i.key === 'user-group') return false;
    if (!isSuper && i.key === 'settings') return false;
    return true;
  });

  return (
    <div className="mp-root" style={{ display: 'flex', minHeight: '100vh', background: '#0d0e14' }}>

      {/* ── SIDER ── */}
      <div className="mp-sider" style={{ position: 'relative' }}>
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            background: '#111318',
            borderRight: '1px solid #1f2130',
            position: 'sticky', top: 0,
            height: '100vh', overflow: 'auto',
          }}
          trigger={
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.5px',
            }}>
              {collapsed
                ? <><MenuUnfoldOutlined /> </>
                : <><MenuFoldOutlined /> Collapse</>
              }
            </div>
          }
        >
          <LogoMark collapsed={collapsed} />
          <Menu
            className="mp-menu"
            theme="dark"
            mode="inline"
            items={filteredItems}

            selectedKeys={[location.pathname]}   // ✅ active only current page
            openKeys={openKeys}                  // ✅ control submenu
            onOpenChange={(keys) => setOpenKeys(keys)}

            onClick={e => navigate(e.key)}
          />
        </Layout.Sider>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <header className="mp-fadein" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 64, flexShrink: 0,
          background: '#111318',
          borderBottom: '1px solid #1f2130',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          {/* Left: search */}
          <div className="mp-search">
            <SearchOutlined style={{ color: '#6b7280', fontSize: 14 }} />
            <input placeholder="Search anything..." />
          </div>

          {/* Right: actions + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* notification */}
            <Badge count={3} size="small" offset={[-4, 4]}
              styles={{ indicator: { background: '#5b6af0', boxShadow: 'none' } }}
            >
              <div className="mp-icon-btn"><BellOutlined /></div>
            </Badge>

            {/* settings (only visible to super admin) */}
            {isSuper ? (
              <div className="mp-icon-btn"><SettingOutlined /></div>
            ) : null}

            {/* divider */}
            <div style={{ width: 1, height: 28, background: '#1f2130', margin: '0 4px' }} />

            {/* user pill */}
            <div className="mp-user">
              <Avatar
                src={config.getImage(profile?.image) || null}
                style={{
                  background: 'linear-gradient(135deg,#5b6af0,#a78bfa)',
                  width: 32, height: 32, lineHeight: '32px',
                }}
              >
                {!profile?.image && (profile?.name?.[0]?.toUpperCase() || 'U')}
              </Avatar>
              <div>

                <Dropdown menu={{
                  items: items_dropdown,
                  onClick: (item) => {
                    if (item.key === "logout") {
                      logout();
                      navigate("/login");
                    }
                    else if (item.key === "view_profile") {
                      openModal();
                    }
                  }
                }}>
                  <a onClick={e => e.preventDefault()}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf6', lineHeight: 1 }}>
                      {profile.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, fontWeight: 500 }}>
                    {profile?.type ? profile.type.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'User'}
                    </div>
                  </a>
                </Dropdown>
              </div>
              <LogoutOutlined style={{ color: '#6b7280', fontSize: 13, marginLeft: 6 }} />
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, padding: '24px 28px', overflow: 'auto' }}>
          <div className="mp-content-inner mp-fadein">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MasterPage;