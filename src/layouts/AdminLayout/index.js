import React, { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import ProLayout from '@ant-design/pro-layout';
import { Dropdown, Avatar, Spin, Menu, ConfigProvider, theme, Switch } from 'antd';
import viVN from 'antd/locale/vi_VN';
import {
  DashboardOutlined,
  QrcodeOutlined,
  VideoCameraOutlined,
  UserOutlined,
  ShopOutlined,
  TableOutlined,
  FileTextOutlined,
  CommentOutlined,
  CalendarOutlined,
  ContainerOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { SnackbarProvider } from 'notistack';

import usersApi from '../../api/usersApi';
import { LOGIN_FAIL, LOGIN_SUCCESS } from '../../reducers/constants/Auth';

const menuData = [
  {
    path: '/admin/dashboard',
    name: 'Thống kê',
    icon: <DashboardOutlined />,
  },
  {
    path: '/admin/check-ticket',
    name: 'Soát vé & In vé',
    icon: <QrcodeOutlined />,
  },
  {
    path: '/admin/movies',
    name: 'Quản lý phim',
    icon: <VideoCameraOutlined />,
  },
  {
    path: '/admin/users',
    name: 'Quản lý người dùng',
    icon: <UserOutlined />,
  },
  {
    path: '/admin/branch',
    name: 'Quản lý chi nhánh rạp',
    icon: <ShopOutlined />,
  },
  {
    path: '/admin/seat-config',
    name: 'Cấu hình sơ đồ ghế',
    icon: <TableOutlined />,
  },
  {
    path: '/admin/bills',
    name: 'Quản lý hóa đơn',
    icon: <FileTextOutlined />,
  },
  {
    path: '/admin/reviews',
    name: 'Quản lý Review',
    icon: <CommentOutlined />,
  },
  {
    path: '/admin/events',
    name: 'Quản lý sự kiện',
    icon: <CalendarOutlined />,
  },
  {
    path: '/admin/ticket',
    name: 'Quản lý vé',
    icon: <ContainerOutlined />,
  },
  {
    path: '/admin/showtimes',
    name: 'Quản lý lịch chiếu',
    icon: <ScheduleOutlined />,
  }
];

export default function AdminLayout(props) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authReducer);
  const [cUser, setCUser] = useState();
  
  // State quản lý Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    usersApi.getThongTinTaiKhoan()
      .then((response) => {
        setCUser(response?.data);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            data: response?.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_FAIL,
          payload: {
            error: error.response?.data?.data ? error.response?.data?.data : error.message,
          },
        });
      });
  }, [dispatch]);

  if (!currentUser?.data?.role?.includes("ROLE_ADMIN")) {
    return <>{props.children}</>;
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/taikhoan">Thông tin cá nhân</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");
        window.location.reload();
      },
    },
  ];

  return (
    <ConfigProvider 
      locale={viVN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <SnackbarProvider maxSnack={3}>
        <div style={{ minHeight: '100vh', background: isDarkMode ? '#141414' : '#f0f2f5' }}>
          <ProLayout
            title="Cinema Admin"
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            layout="mix"
            navTheme={isDarkMode ? 'realDark' : 'light'}
            fixSiderbar
            fixedHeader
            route={{ routes: menuData }}
            location={{
              pathname: location.pathname,
            }}
            menuItemRender={(item, dom) => (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  history.push(item.path);
                }}
              >
                {dom}
              </a>
            )}
            rightContentRender={() => (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: 16, gap: '16px' }}>
                <Switch 
                  checked={isDarkMode} 
                  onChange={(checked) => setIsDarkMode(checked)} 
                  checkedChildren={<BulbOutlined />} 
                  unCheckedChildren={<BulbFilled />}
                />
                
                {currentUser?.data ? (
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={currentUser?.data?.image || "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"} 
                        size="small" 
                        style={{ marginRight: 8 }}
                      />
                      <span style={{ color: isDarkMode ? '#fff' : 'inherit' }}>
                        {currentUser?.data?.name}
                      </span>
                    </div>
                  </Dropdown>
                ) : (
                  <Spin size="small" />
                )}
              </div>
            )}
          >
            <div style={{ 
              padding: 24, 
              background: isDarkMode ? '#141414' : '#fff', 
              minHeight: 'calc(100vh - 120px)' 
            }}>
              {props.children}
            </div>
          </ProLayout>
        </div>
      </SnackbarProvider>
    </ConfigProvider>
  );
}
