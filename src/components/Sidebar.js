import React, {useContext, useState} from 'react';
import { Layout, Menu, Avatar, Typography, Badge } from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    MessageOutlined,
    FileTextOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';
import {AuthContext} from "../providers/AuthProvider";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({
                     appName = "Admin Gouvernemental",
                     version = "2.2.1",
                     onLogout,
                     unreadMessages = 10,
                     pendingActions = 2
                 }) => {
    const [collapsed, ] = useState(false);
    const location = useLocation();
    const {user}= useContext(AuthContext);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Tableau de bord</Link>,
        },
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: <Link to="/users">Gestion des utilisateurs</Link>,
        },

        {
            key: 'rapports',
            icon: <FileTextOutlined />,
            label: <Link to="/rapports">Rapports</Link>,
        },
        {
            key: 'notifications',
            icon: (
                <Badge count={unreadMessages} size="small" offset={[5, 0]}>
                    <MessageOutlined />
                </Badge>
            ),
            label: <Link to="/notifications">Notifications</Link>,
        }
    ];

    return (
        <Sider
            width={265}
            collapsedWidth={80}
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="admin-sidebar"
            theme="light"
        >
            {/* Logo et bouton de réduction */}
            {/*<div className="sidebar-header">*/}
            {/*    <div className="sidebar-logo-container">*/}
            {/*        <Link to="/dashboard">*/}
            {/*            {!collapsed && (*/}
            {/*                <Text strong className="app-name">*/}
            {/*                    {appName}*/}
            {/*                </Text>*/}
            {/*            )}*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Profil utilisateur */}
            <div className={`sidebar-profile ${collapsed ? 'collapsed' : ''}`}>
                <Badge count={pendingActions} size="small" offset={[-10, 30]}>
                    <Avatar
                        size={collapsed ? 40 : 48}
                        icon={<UserOutlined />}
                        src={user.avatar}
                        className="profile-avatar"
                    />
                </Badge>
                {!collapsed && (
                    <div className="profile-info">
                        <Text strong className="profile-name">
                            {user.email}
                        </Text>
                        <Text type="secondary" className="profile-role">
                            {user.role}
                        </Text>
                    </div>
                )}
            </div>

            {/* Menu principal */}
            <Menu
                mode="inline"
                selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
                defaultOpenKeys={['sondages', 'parametres']}
                items={menuItems}
                className="sidebar-menu"
            />
        </Sider>
    );
};

export default Sidebar;