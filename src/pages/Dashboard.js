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


    // Données pour les graphiques (restent statiques pour l'exemple)
    const activityData = [
        {
            name: "Licensed Users",
            participations: licences.filter(l => l.isLicensed).length,
            utilisateurs: licences.length,
        },
        {
            name: "Unlicensed Users",
            participations: licences.filter(l => !l.isLicensed).length,
            utilisateurs: licences.length,
        },
    ];

    const participationData = [
        { name: 'Réforme', value: 1250, color: '#1890ff' },
        { name: 'Budget', value: 892, color: '#52c41a' },
        { name: 'Éducation', value: 756, color: '#faad14' },
        { name: 'Infrastructures', value: 1843, color: '#722ed1' },
    ];

    const COLORS = ['#1890ff', '#52c41a', '#faad14', '#722ed1'];

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
                <Row gutter={[16, 16]} className="charts-row mt-4 mb-4">
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