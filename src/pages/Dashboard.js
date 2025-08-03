import React, { useContext } from 'react';
import {Card, Row, Col, Progress, Table, Tag, Button, Divider, Statistic, Select, Popconfirm, Avatar,Space,Tooltip} from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserOutlined,
    FileTextOutlined,
    BarChartOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    MoreOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    TeamOutlined,
    NotificationOutlined,
    DeleteOutlined,
    EditOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import HeaderAdmin from "../components/HeaderAdmin";
import '../styles/admin-layout.css';
import { DeputyContext } from '../providers/UserProvider';

const { Option } = Select;

const licences = [
    {
        "DisplayName": "John Doe",
        "UserPrincipalName": "john.doe@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:ENTERPRISEPACK",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "EXCHANGE_S_ENTERPRISE",
                            "ProvisioningStatus": "Success"
                        }
                    },
                    {
                        "ServicePlan": {
                            "ServiceName": "SHAREPOINTWAC",
                            "ProvisioningStatus": "PendingInput"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Alice Smith",
        "UserPrincipalName": "alice.smith@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:BUSINESS_PREMIUM",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "MCOSTANDARD",
                            "ProvisioningStatus": "Success"
                        }
                    },
                    {
                        "ServicePlan": {
                            "ServiceName": "SHAREPOINTWAC",
                            "ProvisioningStatus": "Success"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Bob Johnson",
        "UserPrincipalName": "bob.johnson@entreprise.com",
        "isLicensed": false,
        "Licenses": []
    },
    {
        "DisplayName": "Chloe Brown",
        "UserPrincipalName": "chloe.brown@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:ENTERPRISEPREMIUM",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "EXCHANGE_S_ENTERPRISE",
                            "ProvisioningStatus": "Success"
                        }
                    },
                    {
                        "ServicePlan": {
                            "ServiceName": "OFFICESUBSCRIPTION",
                            "ProvisioningStatus": "Success"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Daniel Lee",
        "UserPrincipalName": "daniel.lee@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:F3",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "MCOSTANDARD",
                            "ProvisioningStatus": "Disabled"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Ella Davis",
        "UserPrincipalName": "ella.davis@entreprise.com",
        "isLicensed": false,
        "Licenses": []
    },
    {
        "DisplayName": "Frank Moore",
        "UserPrincipalName": "frank.moore@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:VISIOCLIENT",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "VISIOCLIENT",
                            "ProvisioningStatus": "Success"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Grace Wilson",
        "UserPrincipalName": "grace.wilson@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:PROJECTPLAN3",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "PROJECTWORKMANAGEMENT",
                            "ProvisioningStatus": "Success"
                        }
                    }
                ]
            }
        ]
    },
    {
        "DisplayName": "Henry Clark",
        "UserPrincipalName": "henry.clark@entreprise.com",
        "isLicensed": false,
        "Licenses": []
    },
    {
        "DisplayName": "Isabelle Martin",
        "UserPrincipalName": "isabelle.martin@entreprise.com",
        "isLicensed": true,
        "Licenses": [
            {
                "AccountSkuId": "microsoft:ENTERPRISEPACK",
                "ServiceStatus": [
                    {
                        "ServicePlan": {
                            "ServiceName": "EXCHANGE_S_ENTERPRISE",
                            "ProvisioningStatus": "Success"
                        }
                    },
                    {
                        "ServicePlan": {
                            "ServiceName": "MCOSTANDARD",
                            "ProvisioningStatus": "PendingInput"
                        }
                    }
                ]
            }
        ]
    }
]



export default function Dashboard() {

    function showUserDetails(record) {
        console.log("Afficher les détails de l'utilisateur :", record);
    }

    function assignLicense(record) {
        console.log("Attribution de licence à l'utilisateur :", record);
    }

    function removeLicense(record) {
        console.log("Suppression de licence pour l'utilisateur :", record);
    }

    function editUser(record) {
        console.log("Modification de l'utilisateur :", record);
    }

    function deleteUser(record) {
        console.log("Suppression de l'utilisateur :", record);
    }


    // Données pour les statistiques - maintenant dynamiques
    const statsData = [
        {
            id: 1,
            title: "Utilisateurs",
            value: licences?.length || 0,
            change: +3.1,
            icon: <TeamOutlined />,
            color: "#1890ff"
        },
        {
            id: 2,
            title: "Licences attribuées",
            value: licences?.filter(lic => lic.Licenses && lic.Licenses.length > 0).length || 0,
            change: +1.5,
            icon: <CheckCircleOutlined />,
            color: "#52c41a"
        },
        {
            id: 3,
            title: "Utilisateurs sans licence",
            value: licences?.filter(lic => !lic.Licenses || lic.Licenses.length === 0).length || 0,
            change: -0.7,
            icon: <CloseCircleOutlined />,
            color: "#fa541c"
        },
        {
            id: 4,
            title: "Licences expirées",
            value: licences?.filter(lic => lic.isLicenseExpired).length || 0,
            change: 0,
            icon: <ExclamationCircleOutlined />,
            color: "#722ed1"
        }
    ];

    const columns = [
        {
            title: 'Utilisateur',
            dataIndex: 'DisplayName',
            key: 'DisplayName',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#1a3a8f',
                            color: '#fff'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.UserPrincipalName}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Licencié',
            dataIndex: 'isLicensed',
            key: 'isLicensed',
            render: (licensed) => (
                <Tag color={licensed ? 'green' : 'red'}>
                    {licensed ? 'Oui' : 'Non'}
                </Tag>
            ),
            filters: [
                { text: 'Oui', value: true },
                { text: 'Non', value: false }
            ],
            onFilter: (value, record) => record.isLicensed === value
        },
        {
            title: 'Licences',
            dataIndex: 'Licenses',
            key: 'Licenses',
            render: (licenses) => {
                if (!licenses || licenses.length === 0) return <Tag color="default">Aucune</Tag>;
                return licenses.map((lic, idx) => (
                    <Tag color="blue" key={idx}>{lic.AccountSkuId}</Tag>
                ));
            }
        },
        {
            title: 'Services actifs',
            key: 'ServiceStatus',
            render: (_, record) => {
                const services = record.Licenses?.flatMap(lic =>
                    lic.ServiceStatus?.filter(s => s.ServicePlan.ProvisioningStatus === 'Success')
                ) || [];
                return services.map((s, i) => (
                    <Tag color="green" key={i}>{s.ServicePlan.ServiceName}</Tag>
                ));
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Détails utilisateur">
                        <Button
                            type="link"
                            icon={<InfoCircleOutlined />}
                            onClick={() => showUserDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Attribuer une licence">
                        <Button
                            type="link"
                            icon={<PlusCircleOutlined />}
                            onClick={() => assignLicense(record)}
                            disabled={record.isLicensed}
                        />
                    </Tooltip>
                    <Tooltip title="Retirer licence">
                        <Button
                            type="link"
                            icon={<MinusCircleOutlined />}
                            onClick={() => removeLicense(record)}
                            disabled={!record.isLicensed}
                            danger
                        />
                    </Tooltip>
                    <Tooltip title="Modifier l'utilisateur">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => editUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer l'utilisateur">
                        <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                            onConfirm={() => deleteUser(record)}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];


    // Données pour les sondages récents (statiques comme avant)
    const recentPolls = [
        // { id: 1, title: "Réforme constitutionnelle", date: "15/06/2023", participants: 1250, status: "active", target: "Députés" },
        // { id: 2, title: "Budget national 2024", date: "10/06/2023", participants: 892, status: "closed", target: "Public" },
        // { id: 3, title: "Politique éducative", date: "05/06/2023", participants: 756, status: "closed", target: "Députés" },
        // { id: 4, title: "Infrastructures urbaines", date: "01/06/2023", participants: 1843, status: "active", target: "Public" }
    ];

    // Activité récente (peut aussi être rendue dynamique si nécessaire)
    const recentActivity = [
        // { id: 1, time: "10:45", user: "Président Collégial", action: "a publié un nouveau projet de loi", entity: "Réforme constitutionnelle" },
        // { id: 2, time: "09:30", user: "Admin Technique", action: "a ajouté un nouveau député", entity: "Jean K. (Kinshasa)" },
        // { id: 3, time: "Hier", user: "Secrétaire Général", action: "a planifié une session", entity: "Session plénière du 20/06" },
        // { id: 4, time: "Hier", user: "Admin Content", action: "a publié une actualité", entity: "Communiqué officiel" }
    ];

    // Données pour les graphiques (restent statiques pour l'exemple)
    const activityData = [
        { name: 'Jan', participations: 400, utilisateurs: 240 },
        { name: 'Fév', participations: 300, utilisateurs: 139 },
        { name: 'Mar', participations: 600, utilisateurs: 380 },
        { name: 'Avr', participations: 200, utilisateurs: 120 },
        { name: 'Mai', participations: 500, utilisateurs: 280 },
        { name: 'Juin', participations: 800, utilisateurs: 450 },
    ];

    const participationData = [
        { name: 'Réforme', value: 1250, color: '#1890ff' },
        { name: 'Budget', value: 892, color: '#52c41a' },
        { name: 'Éducation', value: 756, color: '#faad14' },
        { name: 'Infrastructures', value: 1843, color: '#722ed1' },
    ];

    const COLORS = ['#1890ff', '#52c41a', '#faad14', '#722ed1'];

    // Colonnes pour le tableau des sondages (identique)
    const pollColumns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a href='https://localhost://'>{text}</a>,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Participants',
            dataIndex: 'participants',
            key: 'participants',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Cible',
            dataIndex: 'target',
            key: 'target',
            render: (text) => (
                <Tag color={text === 'Public' ? 'geekblue' : 'purple'}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    icon={status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    color={status === 'active' ? 'success' : 'default'}
                >
                    {status === 'active' ? 'Actif' : 'Clôturé'}
                </Tag>
            ),
        },
        {
            title: 'Progression',
            key: 'progress',
            render: (_, record) => (
                <Progress
                    percent={record.status === 'active' ? 65 : 100}
                    status={record.status === 'active' ? 'active' : 'normal'}
                    strokeColor={record.status === 'active' ? '#1890ff' : '#52c41a'}
                />
            ),
        },
        {
            title: '',
            key: 'action',
            render: () => (
                <Button type="text" icon={<MoreOutlined />} />
            ),
        },
    ];

    const handleLogout = () => {
        // Logique de déconnexion
    };

    return (
        <div className="admin-dashboard">
            <HeaderAdmin
                user={{ name: "Super Admin", role: "Administrateur Principal" }}
                version="1.1.0"
                onLogout={handleLogout}
            />

            <div className="dashboard-content">
                {/* En-tête du tableau de bord */}
                <div className="dashboard-header">
                    <div>
                        <h1>Tableau de Bord Administratif</h1>
                        <p className="text-muted">Aperçu complet des utilisations des licences MS 365 et leur etat actuel</p>
                    </div>
                    <div className="dashboard-actions">
                        <Button type="primary" icon={<DownloadOutlined />}>
                            Generer rapport
                        </Button>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <Row gutter={[16, 16]} className="stats-row">
                    {statsData.map((stat) => (
                        <Col xs={24} sm={12} md={12} lg={6} key={stat.id}>
                            <Card className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    valueStyle={{ fontSize: '28px' }}
                                />
                                <div className="stat-change">
                                    <span className={`change-indicator ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                                        {stat.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        {Math.abs(stat.change)}%
                                    </span>
                                    <span className="change-label">vs période précédente</span>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {/* Graphiques et activité */}
                <Row gutter={[16, 16]} className="charts-row mt-4">
                    <Col xs={24} lg={16}>
                        <Card
                            title="Activité des Consultations"
                            extra={
                                <Button.Group>
                                    <Button>Hebdomadaire</Button>
                                    <Button type="primary">Mensuel</Button>
                                </Button.Group>
                            }
                        >
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="participations"
                                            stroke="#1890ff"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="utilisateurs"
                                            stroke="#52c41a"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Participation par Thème">
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={participationData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {participationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value.toLocaleString(), 'Participants']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Activité récente et mini-statistiques */}
                <Row gutter={[16, 16]} className="activity-row mt-4 mb-4">
                    <Col xs={24} lg={16}>
                        <Card title="Activité Récente">
                            <div className="recent-activity">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-time">{activity.time}</div>
                                        <div className="activity-avatar">
                                            <div className="avatar-circle">
                                                {activity.user.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-user">{activity.user}</div>
                                            <div className="activity-action">{activity.action}</div>
                                            {activity.entity && (
                                                <div className="activity-entity">{activity.entity}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Divider />
                            <div className="text-center">
                                <Button type="link">Voir toutes les activités</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card className="metric-card">
                                    <div className="metric-content">
                                        <div className="metric-icon" style={{ backgroundColor: '#1890ff20', color: '#1890ff' }}>
                                            <UserOutlined />
                                        </div>
                                        <div className="metric-text">
                                            <div className="metric-title">Engagement</div>
                                            <div className="metric-value">0%</div>
                                            <div className="metric-description">Taux de participation moyen</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card className="metric-card">
                                    <div className="metric-content">
                                        <div className="metric-icon" style={{ backgroundColor: '#52c41a20', color: '#52c41a' }}>
                                            <FileTextOutlined />
                                        </div>
                                        <div className="metric-text">
                                            <div className="metric-title">Documents</div>
                                            <div className="metric-value">0</div>
                                            <div className="metric-description">Nouveaux cette semaine</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className="kpi-row mt-4 mb-4">
                    <Col span={24}>
                        <Card title="Indicateurs Clés">
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <div className="kpi-item">
                                        <div className="kpi-value">0%</div>
                                        <div className="kpi-label">Taux de réponse</div>
                                        <Progress percent={0} status="active" showInfo={false} strokeColor="#52c41a" />
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div className="kpi-item">
                                        <div className="kpi-value">0</div>
                                        <div className="kpi-label">Satisfaction (sur 0)</div>
                                        <Progress percent={0} status="active" showInfo={false} strokeColor="#1890ff" />
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div className="kpi-item">
                                        <div className="kpi-value">0h</div>
                                        <div className="kpi-label">Temps moyen de réponse</div>
                                        <Progress percent={0} status="active" showInfo={false} strokeColor="#faad14" />
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div className="kpi-item">
                                        <div className="kpi-value">0%</div>
                                        <div className="kpi-label">Engagement des députés</div>
                                        <Progress percent={0} status="active" showInfo={false} strokeColor="#722ed1" />
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Tableau des sondages */}
                <Card
                    title="Listes des utilisateurs"
                    className="polls-table"
                >
                    <Table
                        columns={columns}
                        dataSource={licences}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            showTotal: (total) => `${total} députés`,
                        }}
                        rowKey="id"
                    />
                </Card>
            </div>
        </div>
    );
}