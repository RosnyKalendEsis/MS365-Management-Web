import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Input,
    Modal,
    Form,
    Select,
    DatePicker,
    Divider,
    Row,
    Col,
    Tabs,
    Badge,
    Switch,
    Statistic,
    Progress,
    List,
    Tooltip,
    message,
    Popconfirm,
    Typography,
    Alert
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BarChartOutlined,
    CommentOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import moment from 'moment';
import 'moment/locale/fr';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Données mockées
const mockSurveys = [
    {
        id: 1,
        title: "Évaluation des Services Publics du Lualaba",
        category: "Santé",
        dateRange: ["2025-04-15", "2025-04-30"],
        status: "active",
        totalVotes: 11350,
        isPublic: true,
        questions: [
            {
                id: 1,
                question: "Comment évaluez-vous les services de santé dans le Lualaba ?",
                type: "multiple_choice",
                options: [
                    { id: 1, text: "Excellents", votes: 1250, color: "#2ecc71" },
                    { id: 2, text: "Satisfaisants", votes: 3200, color: "#3498db" },
                    { id: 3, text: "Moyens", votes: 4100, color: "#f39c12" },
                    { id: 4, text: "Insuffisants", votes: 2800, color: "#e74c3c" }
                ],
                comments: [
                    { user: "Jean K.", text: "Les hôpitaux manquent cruellement de médicaments", date: "20/04/2025", approved: true },
                    { user: "Marie T.", text: "Le personnel soignant fait de son mieux avec les moyens disponibles", date: "18/04/2025", approved: true },
                    { user: "Paul M.", text: "Il faut plus d'investissements dans les infrastructures", date: "19/04/2025", approved: false }
                ]
            },
            {
                id: 2,
                question: "Quels sont les principaux défis du système de santé ?",
                type: "multiple_choice",
                options: [
                    { id: 1, text: "Manque de médicaments", votes: 4200, color: "#e74c3c" },
                    { id: 2, text: "Personnel insuffisant", votes: 3100, color: "#f39c12" },
                    { id: 3, text: "Équipements obsolètes", votes: 2800, color: "#9b59b6" },
                    { id: 4, text: "Accessibilité géographique", votes: 1250, color: "#34495e" }
                ],
                comments: []
            }
        ]
    },
    {
        id: 2,
        title: "Infrastructure et Transport Provincial",
        category: "Infrastructure",
        dateRange: ["2025-05-01", "2025-05-15"],
        status: "draft",
        totalVotes: 0,
        isPublic: false,
        questions: [
            {
                id: 1,
                question: "Comment jugez-vous l'état des routes dans votre région ?",
                type: "multiple_choice",
                options: [
                    { id: 1, text: "Très bon", votes: 0, color: "#2ecc71" },
                    { id: 2, text: "Bon", votes: 0, color: "#3498db" },
                    { id: 3, text: "Moyen", votes: 0, color: "#f39c12" },
                    { id: 4, text: "Mauvais", votes: 0, color: "#e74c3c" }
                ],
                comments: []
            }
        ]
    }
];

const SURVEY_CATEGORIES = [
    { value: "sante", label: "Santé", color: "red" },
    { value: "education", label: "Éducation", color: "blue" },
    { value: "infrastructure", label: "Infrastructure", color: "green" },
    { value: "economie", label: "Économie", color: "orange" },
    { value: "environnement", label: "Environnement", color: "cyan" },
    { value: "securite", label: "Sécurité", color: "purple" }
];

const SURVEY_STATUS = [
    { value: "draft", label: "Brouillon", color: "default", icon: <EditOutlined /> },
    { value: "active", label: "Actif", color: "success", icon: <CheckCircleOutlined /> },
    { value: "paused", label: "En pause", color: "warning", icon: <ClockCircleOutlined /> },
    { value: "closed", label: "Fermé", color: "error", icon: <StopOutlined /> }
];

const SurveyAdmin = () => {
    moment.locale('fr');

    const [surveys, setSurveys] = useState(mockSurveys);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [form] = Form.useForm();

    // Colonnes du tableau principal
    const columns = [
        {
            title: 'Sondage',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
                    <Tag color={SURVEY_CATEGORIES.find(c => c.value === record.category.toLowerCase())?.color}>
                        {record.category}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Période',
            dataIndex: 'dateRange',
            key: 'dateRange',
            render: (dates) => (
                <div style={{ color: '#595959' }}>
                    <div>{moment(dates[0]).format('DD/MM/YYYY')}</div>
                    <div style={{ fontSize: 12 }}>
                        au {moment(dates[1]).format('DD/MM/YYYY')}
                    </div>
                </div>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusInfo = SURVEY_STATUS.find(s => s.value === status);
                return (
                    <Tag color={statusInfo.color} icon={statusInfo.icon}>
                        {statusInfo.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Participation',
            dataIndex: 'totalVotes',
            key: 'totalVotes',
            render: (votes, record) => (
                <div>
                    <Statistic
                        value={votes}
                        suffix="votes"
                        valueStyle={{ fontSize: 16 }}
                    />
                    <Tag color={record.isPublic ? 'green' : 'orange'}>
                        {record.isPublic ? 'Public' : 'Interne'}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Statistiques">
                        <Button
                            icon={<BarChartOutlined />}
                            onClick={() => handleViewStats(record)}
                            style={{ color: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Commentaires">
                        <Button
                            icon={<CommentOutlined />}
                            onClick={() => handleViewComments(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce sondage ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // Handlers
    const handleAdd = () => {
        setCurrentSurvey(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (survey) => {
        setCurrentSurvey(survey);
        form.setFieldsValue({
            ...survey,
            dateRange: [moment(survey.dateRange[0]), moment(survey.dateRange[1])]
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        setSurveys(surveys.filter(s => s.id !== id));
        message.success('Sondage supprimé avec succès');
    };

    const handleViewStats = (survey) => {
        setSelectedSurvey(survey);
        setActiveTab('statistics');
    };

    const handleViewComments = (survey) => {
        setSelectedSurvey(survey);
        setActiveTab('comments');
    };

    const handleSubmit = (values) => {
        const surveyData = {
            ...values,
            id: currentSurvey ? currentSurvey.id : Date.now(),
            dateRange: [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')],
            totalVotes: currentSurvey ? currentSurvey.totalVotes : 0,
            questions: currentSurvey ? currentSurvey.questions : []
        };

        if (currentSurvey) {
            setSurveys(surveys.map(s => s.id === currentSurvey.id ? surveyData : s));
            message.success('Sondage mis à jour avec succès');
        } else {
            setSurveys([...surveys, surveyData]);
            message.success('Sondage créé avec succès');
        }

        setIsModalVisible(false);
    };

    // Statistiques générales
    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter(s => s.status === 'active').length;
    const totalVotes = surveys.reduce((sum, s) => sum + s.totalVotes, 0);
    const avgVotesPerSurvey = totalSurveys > 0 ? Math.round(totalVotes / totalSurveys) : 0;

    // Données pour les graphiques
    const categoryData = SURVEY_CATEGORIES.map(cat => ({
        category: cat.label,
        count: surveys.filter(s => s.category.toLowerCase() === cat.value).length
    }));

    const statusData = SURVEY_STATUS.map(status => ({
        status: status.label,
        count: surveys.filter(s => s.status === status.value).length
    }));

    // Configuration des graphiques
    const getPieConfig = (data, angleField, colorField, colors) => ({
        data,
        angleField,
        colorField,
        radius: 0.8,
        height: 300,
        color: colors,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
            title: false,
            content: {
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
                content: 'Total',
            },
        },
    });

    const getColumnConfig = (data, xField, yField) => ({
        data,
        xField,
        yField,
        height: 300,
        color: '#1890ff',
        columnStyle: {
            radius: [6, 6, 0, 0],
            cursor: 'pointer'
        },
        xAxis: {
            label: {
                style: {
                    fill: '#595959',
                    fontSize: 12
                }
            }
        },
        yAxis: {
            label: {
                style: {
                    fill: '#595959',
                    fontSize: 12
                }
            }
        },
        tooltip: {
            showTitle: false,
            domStyles: {
                'g2-tooltip': {
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
            }
        }
    });

    return (
        <div style={{ padding: 24, backgroundColor: '#f0f2f5' }}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginBottom: 16 }}
            >
                Retour
            </Button>

            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <BarChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <span>Gestion des Sondages Publics</span>
                    </div>
                }
                bordered={false}
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Nouveau Sondage
                    </Button>
                }
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabBarStyle={{ marginBottom: 24 }}
                >
                    <TabPane tab="Liste des Sondages" key="list">
                        {/* Statistiques générales */}
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            {[
                                {
                                    title: "Total Sondages",
                                    value: totalSurveys,
                                    icon: <BarChartOutlined style={{ color: '#1890ff' }} />,
                                    color: '#1890ff'
                                },
                                {
                                    title: "Sondages Actifs",
                                    value: activeSurveys,
                                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                                    color: '#52c41a'
                                },
                                {
                                    title: "Total Votes",
                                    value: totalVotes,
                                    icon: <CommentOutlined style={{ color: '#faad14' }} />,
                                    color: '#faad14'
                                },
                                {
                                    title: "Moyenne Votes/Sondage",
                                    value: avgVotesPerSurvey,
                                    icon: null,
                                    color: '#722ed1'
                                }
                            ].map((item, index) => (
                                <Col span={6} key={index}>
                                    <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {item.icon && (
                                                <div style={{
                                                    fontSize: 24,
                                                    marginRight: 16,
                                                    padding: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: `${item.color}10`
                                                }}>
                                                    {item.icon}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ color: '#8c8c8c', fontSize: 14 }}>{item.title}</div>
                                                <div style={{
                                                    fontSize: 24,
                                                    fontWeight: 500,
                                                    color: item.color,
                                                    marginTop: 4
                                                }}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={surveys}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            bordered
                        />
                    </TabPane>

                    <TabPane tab="Statistiques Détaillées" key="statistics">
                        {selectedSurvey ? (
                            <div>
                                <Title level={3} style={{ marginBottom: 16 }}>
                                    {selectedSurvey.title}
                                </Title>

                                <Alert
                                    message={`${selectedSurvey.totalVotes} votes collectés`}
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />

                                {selectedSurvey.questions.map((question, qIndex) => (
                                    <Card
                                        key={question.id}
                                        style={{ marginBottom: 24, borderRadius: 8 }}
                                        headStyle={{ borderBottom: 0 }}
                                        title={
                                            <Title level={4} style={{ margin: 0 }}>
                                                {question.question}
                                            </Title>
                                        }
                                    >
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Pie
                                                    data={question.options.map(opt => ({
                                                        type: opt.text,
                                                        value: opt.votes
                                                    }))}
                                                    angleField="value"
                                                    colorField="type"
                                                    radius={0.8}
                                                    height={300}
                                                    color={question.options.map(opt => opt.color)}
                                                    label={{
                                                        type: 'inner',
                                                        offset: '-30%',
                                                        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                                                        style: {
                                                            fontSize: 14,
                                                            textAlign: 'center',
                                                        },
                                                    }}
                                                    interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
                                                    statistic={{
                                                        title: false,
                                                        content: {
                                                            style: {
                                                                fontSize: '16px',
                                                                fontWeight: 'bold',
                                                            },
                                                            content: 'Total',
                                                        },
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <div style={{ padding: '16px 0' }}>
                                                    {question.options.map(option => {
                                                        const percentage = selectedSurvey.totalVotes > 0
                                                            ? Math.round((option.votes / selectedSurvey.totalVotes) * 100)
                                                            : 0;
                                                        return (
                                                            <div key={option.id} style={{ marginBottom: 16 }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    marginBottom: 8
                                                                }}>
                                                                    <Text>{option.text}</Text>
                                                                    <Text strong>{option.votes} votes ({percentage}%)</Text>
                                                                </div>
                                                                <Progress
                                                                    percent={percentage}
                                                                    strokeColor={option.color}
                                                                    showInfo={false}
                                                                    strokeWidth={8}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '50px',
                                borderRadius: 8,
                                backgroundColor: '#fafafa'
                            }}>
                                <Text type="secondary">
                                    Sélectionnez un sondage pour voir les statistiques détaillées
                                </Text>
                            </div>
                        )}
                    </TabPane>

                    <TabPane tab="Commentaires" key="comments">
                        {selectedSurvey ? (
                            <div>
                                <Title level={3} style={{ marginBottom: 16 }}>
                                    Commentaires - {selectedSurvey.title}
                                </Title>

                                {selectedSurvey.questions.map((question, qIndex) => {
                                    const allComments = question.comments || [];
                                    const pendingComments = allComments.filter(c => !c.approved);
                                    const approvedComments = allComments.filter(c => c.approved);

                                    return (
                                        <Card
                                            key={question.id}
                                            style={{ marginBottom: 24, borderRadius: 8 }}
                                            headStyle={{ borderBottom: 0 }}
                                            title={
                                                <Title level={4} style={{ margin: 0 }}>
                                                    {question.question}
                                                </Title>
                                            }
                                        >
                                            {pendingComments.length > 0 && (
                                                <div style={{ marginBottom: 24 }}>
                                                    <Badge
                                                        count={pendingComments.length}
                                                        offset={[10, 0]}
                                                        style={{ backgroundColor: '#faad14' }}
                                                    >
                                                        <Title level={5} style={{ marginBottom: 16 }}>
                                                            Commentaires en attente
                                                        </Title>
                                                    </Badge>
                                                    <List
                                                        dataSource={pendingComments}
                                                        renderItem={comment => (
                                                            <List.Item
                                                                style={{ padding: '16px 0' }}
                                                                actions={[
                                                                    <Button
                                                                        type="primary"
                                                                        size="small"
                                                                        style={{ marginRight: 8 }}
                                                                    >
                                                                        Approuver
                                                                    </Button>,
                                                                    <Button
                                                                        danger
                                                                        size="small"
                                                                    >
                                                                        Rejeter
                                                                    </Button>
                                                                ]}
                                                            >
                                                                <div style={{ width: '100%' }}>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        marginBottom: 8
                                                                    }}>
                                                                        <Text strong>{comment.user}</Text>
                                                                        <Text type="secondary">{comment.date}</Text>
                                                                    </div>
                                                                    <Text>{comment.text}</Text>
                                                                </div>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <Title level={5} style={{ marginBottom: 16 }}>
                                                Commentaires approuvés ({approvedComments.length})
                                            </Title>
                                            <List
                                                dataSource={approvedComments}
                                                renderItem={comment => (
                                                    <List.Item style={{ padding: '16px 0' }}>
                                                        <div style={{ width: '100%' }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                marginBottom: 8
                                                            }}>
                                                                <Text strong>{comment.user}</Text>
                                                                <Text type="secondary">{comment.date}</Text>
                                                            </div>
                                                            <Text>{comment.text}</Text>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '50px',
                                borderRadius: 8,
                                backgroundColor: '#fafafa'
                            }}>
                                <Text type="secondary">
                                    Sélectionnez un sondage pour gérer les commentaires
                                </Text>
                            </div>
                        )}
                    </TabPane>

                    <TabPane tab="Vue d'ensemble" key="overview">
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Card
                                    title="Répartition par Catégorie"
                                    bordered={false}
                                    headStyle={{ borderBottom: 0 }}
                                    style={{ borderRadius: 8 }}
                                >
                                    <Column
                                        data={categoryData}
                                        xField="category"
                                        yField="count"
                                        height={300}
                                        color="#1890ff"
                                        columnStyle={{
                                            radius: [6, 6, 0, 0],
                                            cursor: 'pointer'
                                        }}
                                        xAxis={{
                                            label: {
                                                style: {
                                                    fill: '#595959',
                                                    fontSize: 12
                                                }
                                            }
                                        }}
                                        yAxis={{
                                            label: {
                                                style: {
                                                    fill: '#595959',
                                                    fontSize: 12
                                                }
                                            }
                                        }}
                                        tooltip={{
                                            showTitle: false,
                                            domStyles: {
                                                'g2-tooltip': {
                                                    borderRadius: 8,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }
                                        }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    title="Répartition par Statut"
                                    bordered={false}
                                    headStyle={{ borderBottom: 0 }}
                                    style={{ borderRadius: 8 }}
                                >
                                    <Pie
                                        data={statusData}
                                        angleField="count"
                                        colorField="status"
                                        radius={0.8}
                                        height={300}
                                        color={['#8c8c8c', '#52c41a', '#faad14', '#ff4d4f']}
                                        label={{
                                            type: 'inner',
                                            offset: '-30%',
                                            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                                            style: {
                                                fontSize: 14,
                                                textAlign: 'center',
                                            },
                                        }}
                                        interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
                                        statistic={{
                                            title: false,
                                            content: {
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                },
                                                content: 'Total',
                                            },
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Modal de création/édition */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {currentSurvey ? (
                            <>
                                <EditOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span>Modifier le sondage</span>
                            </>
                        ) : (
                            <>
                                <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span>Créer un nouveau sondage</span>
                            </>
                        )}
                    </div>
                }
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
                bodyStyle={{ padding: '24px 0' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: 'draft',
                        isPublic: true
                    }}
                >
                    <div style={{ padding: '0 24px' }}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="title"
                                    label="Titre du sondage"
                                    rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                >
                                    <Input
                                        placeholder="Ex: Évaluation des Services Publics du Lualaba"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="category"
                                    label="Catégorie"
                                    rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                >
                                    <Select
                                        placeholder="Sélectionnez une catégorie"
                                        size="large"
                                    >
                                        {SURVEY_CATEGORIES.map(cat => (
                                            <Option key={cat.value} value={cat.label}>
                                                <Tag color={cat.color}>{cat.label}</Tag>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Statut"
                                    rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                >
                                    <Select
                                        placeholder="Sélectionnez un statut"
                                        size="large"
                                    >
                                        {SURVEY_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                <Space>
                                                    {status.icon}
                                                    {status.label}
                                                </Space>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="dateRange"
                                    label="Période du sondage"
                                    rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                >
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Description du sondage"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="isPublic"
                                    label="Visibilité"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Public"
                                        unCheckedChildren="Interne"
                                        defaultChecked
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <div style={{
                        padding: '0 24px',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Space>
                            <Button
                                onClick={() => setIsModalVisible(false)}
                                size="large"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                {currentSurvey ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default SurveyAdmin;