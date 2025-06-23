import React, { useState, useRef } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Input,
    Popconfirm,
    message,
    Modal,
    Form,
    Select,
    Divider,
    Row,
    Col,
    Tabs,
    Badge,
    Avatar,
    Tooltip,
    Descriptions,
    Switch,
    Alert, DatePicker, TimePicker, Radio
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    VideoCameraOutlined,
    CalendarOutlined,
    SyncOutlined,
    PlayCircleOutlined,
    StopOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    FacebookOutlined,
    YoutubeOutlined, UserOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import moment from 'moment';
import '../styles/SessionsDirect.css';
import Search from "antd/es/input/Search";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SessionsDirect = () => {
    // États
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);
    const [activeTab, setActiveTab] = useState('a_venir');
    const [previewPlatform, setPreviewPlatform] = useState('youtube');
    const [form] = Form.useForm();
    const previewRef = useRef(null);

    // Données des sessions
    const [sessions, setSessions] = useState([
        {
            id: 1,
            titre: "Session plénière - Budget national",
            date: "2023-07-15",
            heure: "10:00",
            duree: "02:30",
            statut: "programme",
            type: "pleniere",
            liens: {
                youtube: "https://youtube.com/live/abc123",
                facebook: "https://facebook.com/live/xyz456"
            },
            participants: ["Président", "Ministre Budget", "Rapporteur"],
            description: "Examen et vote du projet de loi de finances 2024",
            published: false
        },
        {
            id: 2,
            titre: "Commission des Affaires Étrangères",
            date: "2023-07-10",
            heure: "14:00",
            duree: "01:45",
            statut: "en_cours",
            type: "commission",
            liens: {
                youtube: "https://youtube.com/live/def456",
                facebook: "https://facebook.com/live/uvw789"
            },
            participants: ["Président Commission", "Ministre AE"],
            description: "Audition du ministre des Affaires Étrangères",
            published: true
        }
    ]);

    // Options
    const typesSession = [
        { value: 'pleniere', label: 'Plénière', icon: <VideoCameraOutlined /> },
        { value: 'commission', label: 'Commission', icon: <UserOutlined /> },
        { value: 'extraordinaire', label: 'Extraordinaire', icon: <ClockCircleOutlined /> },
        { value: 'urgence', label: 'Urgence', icon: <StopOutlined /> }
    ];

    const statuts = [
        { value: 'programme', label: 'Programmé', color: 'blue', icon: <CalendarOutlined /> },
        { value: 'en_cours', label: 'En cours', color: 'green', icon: <PlayCircleOutlined /> },
        { value: 'termine', label: 'Terminé', color: 'gray', icon: <CheckOutlined /> },
        { value: 'annule', label: 'Annulé', color: 'red', icon: <CloseOutlined /> }
    ];

    // Colonnes du tableau
    const columns = [
        {
            title: 'Session',
            dataIndex: 'titre',
            key: 'titre',
            render: (text, record) => (
                <Space>
                    <span style={{
                        color: getTypeColor(record.type),
                        fontSize: 18,
                        verticalAlign: 'middle'
                    }}>
                        {typesSession.find(t => t.value === record.type)?.icon}
                    </span>
                    <span>{text}</span>
                    {record.statut === 'en_cours' && (
                        <Tag icon={<PlayCircleOutlined />} color="red">
                            LIVE
                        </Tag>
                    )}
                    {record.published && (
                        <Tag icon={<CheckOutlined />} color="green">
                            Publié
                        </Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Date et Heure',
            dataIndex: 'date',
            key: 'date',
            render: (date, record) => (
                <Space>
                    <CalendarOutlined />
                    {moment(date).format('DD/MM/YYYY')}
                    <ClockCircleOutlined />
                    {record.heure}
                </Space>
            ),
            sorter: (a, b) => moment(a.date).diff(moment(b.date))
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={getTypeColor(type)}>
                    {typesSession.find(t => t.value === type)?.label}
                </Tag>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => {
                const status = statuts.find(s => s.value === statut);
                return (
                    <Space>
                        <Badge color={status.color} />
                        {status.label}
                    </Space>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {record.statut === 'en_cours' && (
                        <Tooltip title="Rejoindre le direct">
                            <Button
                                type="primary"
                                icon={<PlayCircleOutlined />}
                                onClick={() => window.open(record.liens.youtube, '_blank')}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Prévisualiser">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => showPreview(record)}
                            disabled={!record.liens?.youtube && !record.liens?.facebook}
                        />
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => editSession(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer cette session ?"
                            onConfirm={() => deleteSession(record.id)}
                        >
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    // Fonctions utilitaires
    const getTypeColor = (type) => {
        const colors = {
            pleniere: 'blue',
            commission: 'green',
            extraordinaire: 'purple',
            urgence: 'red'
        };
        return colors[type] || 'gray';
    };

    const editSession = (session) => {
        setCurrentSession(session);
        form.setFieldsValue({
            ...session,
            date: session.date ? moment(session.date) : null,
            heure: session.heure ? moment(session.heure, 'HH:mm') : null
        });
        setIsModalVisible(true);
    };

    const showPreview = (session) => {
        setCurrentSession(session);
        setIsPreviewVisible(true);
    };

    const deleteSession = (id) => {
        setSessions(sessions.filter(session => session.id !== id));
        message.success('Session supprimée avec succès');
    };

    const handleSubmit = (values) => {
        const updatedValues = {
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            heure: values.heure.format('HH:mm'),
            published: values.published || false,
            statut: 'programme'
        };

        if (currentSession) {
            setSessions(sessions.map(session =>
                session.id === currentSession.id ? { ...session, ...updatedValues } : session
            ));
            message.success('Session mise à jour avec succès');
        } else {
            const newSession = {
                id: Math.max(...sessions.map(s => s.id), 0) + 1,
                statut: 'programme',
                published: false,
                ...updatedValues
            };
            setSessions([...sessions, newSession]);
            message.success('Session créée avec succès');
        }

        setIsModalVisible(false);
        form.resetFields();
        setCurrentSession(null);
    };

    const startSession = (id) => {
        setSessions(sessions.map(session =>
            session.id === id ? { ...session, statut: 'en_cours' } : session
        ));
        message.success('Session démarrée avec succès');
    };

    const endSession = (id) => {
        setSessions(sessions.map(session =>
            session.id === id ? { ...session, statut: 'termine' } : session
        ));
        message.success('Session terminée avec succès');
    };

    const publishSession = (id) => {
        setSessions(sessions.map(session =>
            session.id === id ? { ...session, published: true } : session
        ));
        message.success('Session publiée avec succès');
    };

    const unpublishSession = (id) => {
        setSessions(sessions.map(session =>
            session.id === id ? { ...session, published: false } : session
        ));
        message.success('Publication retirée avec succès');
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.titre.toLowerCase().includes(searchText.toLowerCase());

        switch (activeTab) {
            case 'a_venir': return matchesSearch && session.statut === 'programme';
            case 'en_cours': return matchesSearch && session.statut === 'en_cours';
            case 'termines': return matchesSearch && session.statut === 'termine';
            case 'publiees': return matchesSearch && session.published;
            default: return matchesSearch;
        }
    });

    const embedUrl = (url) => {
        if (!url) return null;

        // Convert YouTube live URL to embed format
        if (url.includes('youtube.com')) {
            const videoId = url.split('/live/')[1]?.split('?')[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }

        // Convert Facebook live URL to embed format
        if (url.includes('facebook.com')) {
            const videoId = url.split('/live/')[1]?.split('?')[0];
            return videoId ? `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Flive%2F${videoId}&show_text=0&width=560` : url;
        }

        return url;
    };

    return (
        <div className="page-sessions">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>
            <Card
                title="Gestion des Sessions en Direct"
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCurrentSession(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Nouvelle Session
                    </Button>
                }
            >
                {/* Barre de recherche et filtres */}
                <div className="filters-bar">
                    <Row gutter={16} align="middle">
                        <Col xs={24} md={12} lg={8}>
                            <Search
                                placeholder="Rechercher des sessions..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={12} lg={16} style={{ textAlign: 'right' }}>
                            <Space>
                                <Select
                                    placeholder="Type de session"
                                    style={{ width: 180 }}
                                    allowClear
                                >
                                    {typesSession.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            <Space>
                                                {type.icon}
                                                {type.label}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                                <Button icon={<SyncOutlined />}>Réinitialiser</Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Onglets */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ margin: '16px 0' }}
                >
                    <TabPane tab="À venir" key="a_venir" />
                    <TabPane tab="En cours" key="en_cours" />
                    <TabPane tab="Terminés" key="termines" />
                    <TabPane tab="Publiées" key="publiees" />
                    <TabPane tab="Toutes" key="toutes" />
                </Tabs>

                {/* Tableau des sessions */}
                <Table
                    columns={columns}
                    dataSource={filteredSessions}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    expandable={{
                        expandedRowRender: record => (
                            <div className="session-details">
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="Description">{record.description}</Descriptions.Item>
                                    <Descriptions.Item label="Durée">{record.duree}</Descriptions.Item>
                                    <Descriptions.Item label="Participants">
                                        <Avatar.Group maxCount={3}>
                                            {record.participants.map((p, i) => (
                                                <Tooltip key={i} title={p}>
                                                    <Avatar>{p.charAt(0)}</Avatar>
                                                </Tooltip>
                                            ))}
                                        </Avatar.Group>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Liens de diffusion" span={2}>
                                        <Space>
                                            {record.liens?.youtube && (
                                                <Button
                                                    icon={<YoutubeOutlined />}
                                                    onClick={() => window.open(record.liens.youtube, '_blank')}
                                                >
                                                    YouTube
                                                </Button>
                                            )}
                                            {record.liens?.facebook && (
                                                <Button
                                                    icon={<FacebookOutlined />}
                                                    onClick={() => window.open(record.liens.facebook, '_blank')}
                                                >
                                                    Facebook
                                                </Button>
                                            )}
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>

                                <div style={{ marginTop: 16, textAlign: 'right' }}>
                                    <Space>
                                        {!record.published && (
                                            <Button
                                                type="primary"
                                                onClick={() => publishSession(record.id)}
                                                disabled={!record.liens?.youtube && !record.liens?.facebook}
                                            >
                                                Publier
                                            </Button>
                                        )}
                                        {record.published && (
                                            <Button
                                                danger
                                                onClick={() => unpublishSession(record.id)}
                                            >
                                                Retirer la publication
                                            </Button>
                                        )}
                                        {record.statut === 'programme' && (
                                            <Button
                                                type="primary"
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => startSession(record.id)}
                                                disabled={!record.published}
                                            >
                                                Démarrer la session
                                            </Button>
                                        )}
                                        {record.statut === 'en_cours' && (
                                            <Button
                                                danger
                                                icon={<StopOutlined />}
                                                onClick={() => endSession(record.id)}
                                            >
                                                Terminer la session
                                            </Button>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        )
                    }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentSession ? 'Modifier la session' : 'Créer une nouvelle session'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setCurrentSession(null);
                }}
                footer={null}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        type: 'pleniere',
                        statut: 'programme',
                        duree: '01:30',
                        liens: {
                            youtube: '',
                            facebook: ''
                        }
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="titre"
                                label="Titre de la session"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Session plénière - Budget national..." />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="heure"
                                label="Heure de début"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type de session"
                            >
                                <Select>
                                    {typesSession.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            <Space>
                                                {type.icon}
                                                {type.label}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="duree"
                                label="Durée estimée"
                            >
                                <Select>
                                    <Option value="00:30">30 minutes</Option>
                                    <Option value="01:00">1 heure</Option>
                                    <Option value="01:30">1 heure 30</Option>
                                    <Option value="02:00">2 heures</Option>
                                    <Option value="02:30">2 heures 30</Option>
                                    <Option value="03:00">3 heures</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name={['liens', 'youtube']}
                                label="Lien YouTube Live"
                            >
                                <Input
                                    placeholder="https://youtube.com/live/..."
                                    prefix={<YoutubeOutlined />}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name={['liens', 'facebook']}
                                label="Lien Facebook Live"
                            >
                                <Input
                                    placeholder="https://facebook.com/live/..."
                                    prefix={<FacebookOutlined />}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="participants"
                                label="Participants principaux"
                            >
                                <Select mode="tags" placeholder="Ajouter des participants">
                                    {['Président', 'Rapporteur', 'Ministre', 'Député', 'Expert'].map(p => (
                                        <Option key={p} value={p}>{p}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={4} placeholder="Ordre du jour et détails..." />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="published"
                                label="Publication"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Publié"
                                    unCheckedChildren="Non publié"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentSession ? 'Mettre à jour' : 'Créer la session'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de prévisualisation */}
            <Modal
                title={`Prévisualisation - ${currentSession?.titre}`}
                visible={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {currentSession && (
                    <div className="preview-container">
                        <div style={{ marginBottom: 16, textAlign: 'center' }}>
                            <Radio.Group
                                value={previewPlatform}
                                onChange={(e) => setPreviewPlatform(e.target.value)}
                                buttonStyle="solid"
                            >
                                <Radio.Button value="youtube" disabled={!currentSession.liens?.youtube}>
                                    <YoutubeOutlined /> YouTube
                                </Radio.Button>
                                <Radio.Button value="facebook" disabled={!currentSession.liens?.facebook}>
                                    <FacebookOutlined /> Facebook
                                </Radio.Button>
                            </Radio.Group>
                        </div>

                        {(!currentSession.liens?.youtube && !currentSession.liens?.facebook) ? (
                            <Alert
                                message="Aucun lien de diffusion configuré"
                                description="Veuillez ajouter au moins un lien YouTube ou Facebook pour prévisualiser"
                                type="warning"
                                showIcon
                            />
                        ) : (
                            <div className="preview-embed">
                                {previewPlatform === 'youtube' && currentSession.liens?.youtube ? (
                                    <iframe
                                        ref={previewRef}
                                        src={embedUrl(currentSession.liens.youtube)}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="YouTube Preview"
                                    />
                                ) : previewPlatform === 'facebook' && currentSession.liens?.facebook ? (
                                    <iframe
                                        ref={previewRef}
                                        src={embedUrl(currentSession.liens.facebook)}
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Facebook Preview"
                                    />
                                ) : (
                                    <Alert
                                        message={`Lien ${previewPlatform} non configuré`}
                                        description={`Veuillez ajouter un lien ${previewPlatform} pour prévisualiser`}
                                        type="warning"
                                        showIcon
                                    />
                                )}
                            </div>
                        )}

                        <div style={{ marginTop: 16 }}>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Titre">{currentSession.titre}</Descriptions.Item>
                                <Descriptions.Item label="Date">
                                    {moment(currentSession.date).format('DD/MM/YYYY')} à {currentSession.heure}
                                </Descriptions.Item>
                                <Descriptions.Item label="Description">{currentSession.description}</Descriptions.Item>
                            </Descriptions>
                        </div>

                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    window.open(
                                        previewPlatform === 'youtube'
                                            ? currentSession.liens.youtube
                                            : currentSession.liens.facebook,
                                        '_blank'
                                    );
                                }}
                                disabled={!currentSession.liens?.[previewPlatform]}
                            >
                                Ouvrir dans {previewPlatform === 'youtube' ? 'YouTube' : 'Facebook'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SessionsDirect;