import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge } from 'antd';
import {
    DashboardOutlined,
    BarChartOutlined,
    TeamOutlined,
    NotificationOutlined,
    MessageOutlined,
    FileTextOutlined,
    VideoCameraOutlined,
    UserOutlined,
    AppstoreAddOutlined, CalendarOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({
                     appName = "Admin Gouvernemental",
                     version = "2.2.0",
                     user = {
                         name: "Admin RDC",
                         role: "Super Administrateur",
                         avatar: null
                     },
                     onLogout,
                     unreadMessages = 3,
                     pendingActions = 2
                 }) => {
    const [collapsed, ] = useState(false);
    const location = useLocation();

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Tableau de bord</Link>,
        },
        {
            key: 'deputes',
            icon: <TeamOutlined />,
            label: <Link to="/deputes">Gestion des Députés</Link>,
        },
        {
            key: 'assemblee',
            icon: <AppstoreAddOutlined />,
            label: <Link to="/assemblee">Création Assemblée</Link>,
        },
        {
            key: 'agenda',
            icon: <CalendarOutlined />,  // Nouvelle icône
            label: <Link to="/agenda">Agenda Parlementaire</Link>,
        },
        {
            key: 'sondages',
            icon: <BarChartOutlined />,
            label: <Link to="/sondages">Consultations</Link>,
            children: [
                {
                    key: 'sondages-publics',
                    label: <Link to="/sondages/publics">Publics</Link>,
                },
                {
                    key: 'sondages-internes',
                    label: <Link to="/sondages/internes">Internes</Link>,
                },
            ],
        },
        {
            key: 'actualites',
            icon: <NotificationOutlined />,
            label: <Link to="/actualites">Actualités</Link>,
        },
        {
            key: 'sessions',
            icon: <VideoCameraOutlined />,
            label: <Link to="/sessions">Sessions en Direct</Link>,
        },
        {
            key: 'documents',
            icon: <FileTextOutlined />,
            label: <Link to="/documents">Documents Officiels</Link>,
        },
        {
            key: 'messages',
            icon: (
                <Badge count={unreadMessages} size="small" offset={[5, 0]}>
                    <MessageOutlined />
                </Badge>
            ),
            label: <Link to="/messages">Messagerie</Link>,
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
                            {user.name}
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