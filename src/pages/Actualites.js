import React, {useContext, useEffect, useState} from 'react';
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
    DatePicker,
    Upload,
    Divider,
    Row,
    Col,
    Tabs,
    Badge,
    List,
    Image,
    Switch,
    Avatar,
    Tooltip,
    Typography
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilePdfOutlined,
    CalendarOutlined,
    FilterOutlined,
    ArrowLeftOutlined,
    VideoCameraOutlined,
    NotificationOutlined,
    TeamOutlined,
    LikeOutlined,
    MessageOutlined,
    UserOutlined
} from '@ant-design/icons';
import moment from 'moment';
import '../styles/Actualites.css';
import Search from "antd/es/input/Search";
import {ActualityContext} from "../providers/ActualityProvider";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Types d'actualités avec icônes et couleurs
const ACTUALITE_TYPES = [
    {
        value: 'seance',
        label: 'Séance publique',
        icon: <TeamOutlined />,
        color: 'blue'
    },
    {
        value: 'commission',
        label: 'Commission',
        icon: <VideoCameraOutlined />,
        color: 'green'
    },
    {
        value: 'conference',
        label: 'Conférence',
        icon: <NotificationOutlined />,
        color: 'orange'
    },
    {
        value: 'evenement',
        label: 'Événement',
        icon: <CalendarOutlined />,
        color: 'purple'
    },
    {
        value: 'communique',
        label: 'Communiqué',
        icon: <FilePdfOutlined />,
        color: 'red'
    }
];

const STATUTS = [
    { value: 'brouillon', label: 'Brouillon', color: 'default' },
    { value: 'programme', label: 'Programmé', color: 'orange' },
    { value: 'publie', label: 'Publié', color: 'green' },
    { value: 'archive', label: 'Archivé', color: 'gray' }
];

const ACTIVITY_CATEGORIES = [
    { value: 'emploi', label: 'Emploi', color: 'blue' },
    { value: 'sante', label: 'Santé', color: 'green' },
    { value: 'education', label: 'Éducation', color: 'orange' },
    { value: 'infrastructure', label: 'Infrastructure', color: 'purple' },
    { value: 'agriculture', label: 'Agriculture', color: 'cyan' },
    { value: 'social', label: 'Social', color: 'red' }
];

const DEPUTIES = [
    {
        id: 1,
        name: "Hon. Albert Kapende",
        constituency: "Kolwezi Centre",
        image: "https://img.freepik.com/psd-gratuit/portrait-homme-age-dans-vieillesse_23-2151685152.jpg"
    },
    {
        id: 2,
        name: "Hon. Marie Lumbu",
        constituency: "Kolwezi Ouest",
        image: "https://img.freepik.com/photos-gratuite/femme-affaires-confiantes_23-2147688057.jpg"
    }
];

const Actualites = () => {
    // États pour les actualités
    const [searchText, setSearchText] = useState('');
    const [isActualiteModalVisible, setIsActualiteModalVisible] = useState(false);
    const [currentActualite, setCurrentActualite] = useState(null);
    const [previewActualiteVisible, setPreviewActualiteVisible] = useState(false);
    const [cover, setCover] = useState({});
    const [attachments, setAttachments] = useState([]);
    const {actualities, createActuality, deleteActuality} = useContext(ActualityContext);
    const [actualiteForm] = Form.useForm();
    const [actualites, setActualites] = useState(actualities);

    // États pour les activités
    const [activities, setActivities] = useState([
        {
            id: 1,
            deputyId: 1,
            title: "Lancement d'un centre de formation professionnelle",
            date: "2025-03-12",
            location: "Kolwezi",
            category: "emploi",
            description: "Inauguration d'un centre dédié à la formation des jeunes aux métiers techniques (soudure, électricité, mécanique), avec une capacité de 300 apprenants par an.",
            images: [
                "https://img.freepik.com/photos-gratuite/portrait-professeur-au-travail-dans-systeme-educatif_23-2151737271.jpg",
                "https://img.freepik.com/photos-premium/vue-laterale-groupe-diversifie-hommes-affaires-assistant-seminaire-dans-bureau_1308175-181285.jpg"
            ],
            likes: 207,
            comments: 36
        }
    ]);
    const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [activityImages, setActivityImages] = useState([]);
    const [activityForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('actualites');

    useEffect(() => {
        setActualites(actualities);
    }, [actualities]);

    // Colonnes du tableau des actualités
    const actualiteColumns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    {ACTUALITE_TYPES.find(t => t.value === record.type)?.icon}
                    <span>{text}</span>
                    {record.isImportant && <Tag color="red">Important</Tag>}
                </Space>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const typeInfo = ACTUALITE_TYPES.find(t => t.value === type);
                return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => {
                const status = STATUTS.find(s => s.value === statut);
                return <Badge color={status.color} text={status.label} />;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handlePreviewActualite(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleEditActualite(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette actualité ?"
                        onConfirm={() => handleDeleteActualite(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Colonnes du tableau des activités
    const activityColumns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    <Tag color={ACTIVITY_CATEGORIES.find(c => c.value === record.category)?.color}>
                        {ACTIVITY_CATEGORIES.find(c => c.value === record.category)?.label}
                    </Tag>
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: 'Député',
            dataIndex: 'deputyId',
            key: 'deputy',
            render: (deputyId) => {
                const deputy = DEPUTIES.find(d => d.id === deputyId);
                return (
                    <Space>
                        <Avatar src={deputy?.image} size="small" />
                        <span>{deputy?.name}</span>
                    </Space>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Lieu',
            dataIndex: 'location',
            key: 'location'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handlePreviewActivity(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleEditActivity(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette activité ?"
                        onConfirm={() => handleDeleteActivity(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Handlers pour les actualités
    const handleAddActualite = () => {
        setCurrentActualite(null);
        actualiteForm.resetFields();
        setIsActualiteModalVisible(true);
    };

    const handleEditActualite = (actualite) => {
        setCurrentActualite(actualite);
        actualiteForm.setFieldsValue({
            ...actualite,
            date: moment(actualite.date)
        });
        setIsActualiteModalVisible(true);
    };

    const handleDeleteActualite = async (id) => {
        await deleteActuality(id);
        message.success('Actualité supprimée avec succès');
    };

    const handlePreviewActualite = (actualite) => {
        setCurrentActualite(actualite);
        setPreviewActualiteVisible(true);
    };

    const handleSubmitActualite = async (values) => {
        const actualiteData = {
            ...values,
            date: values.date.format('YYYY-MM-DDTHH:mm:ss'),
            auteur: "Admin Assemblée"
        };

        if (currentActualite) {
            setActualites(actualites.map(a =>
                a.id === currentActualite.id ? {...a, ...actualiteData} : a
            ));
            message.success('Actualité mise à jour avec succès');
        } else {
            const newActualite = {
                id: Math.max(...actualites.map(a => a.id), 0) + 1,
                ...actualiteData,
            };
            await createActuality(newActualite, cover.photoFile || null, attachments);
            message.success('Actualité créée avec succès');
        }

        setIsActualiteModalVisible(false);
        actualiteForm.resetFields();
    };

    // Handlers pour les activités
    const handleAddActivity = () => {
        setCurrentActivity(null);
        activityForm.resetFields();
        setIsActivityModalVisible(true);
    };

    const handleEditActivity = (activity) => {
        setCurrentActivity(activity);
        activityForm.setFieldsValue({
            ...activity,
            date: moment(activity.date)
        });
        setActivityImages(activity.images || []);
        setIsActivityModalVisible(true);
    };

    const handleDeleteActivity = (id) => {
        setActivities(activities.filter(a => a.id !== id));
        message.success('Activité supprimée avec succès');
    };

    const handlePreviewActivity = (activity) => {
        setCurrentActivity(activity);
    };

    const handleSubmitActivity = (values) => {
        const activityData = {
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            images: activityImages,
            likes: currentActivity?.likes || 0,
            comments: currentActivity?.comments || 0
        };

        if (currentActivity) {
            setActivities(activities.map(a =>
                a.id === currentActivity.id ? {...a, ...activityData} : a
            ));
            message.success('Activité mise à jour avec succès');
        } else {
            const newActivity = {
                id: Math.max(...activities.map(a => a.id), 0) + 1,
                ...activityData,
                deputyId: values.deputyId || 1
            };
            setActivities([...activities, newActivity]);
            message.success('Activité créée avec succès');
        }

        setIsActivityModalVisible(false);
        activityForm.resetFields();
        setActivityImages([]);
    };

    const handleActivityImageUpload = (file) => {
        const imageUrl = URL.createObjectURL(file);
        setActivityImages(prev => [...prev, imageUrl]);
        return false;
    };

    const handleActivityImageRemove = (file) => {
        setActivityImages(prev => prev.filter(img => img !== file.url));
    };

    const filteredActualites = actualites.filter(actualite =>
        actualite.title.toLowerCase().includes(searchText.toLowerCase()) ||
        actualite.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredActivities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="page-actualites">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>

            <Card
                title={
                    <Space>
                        <Title level={4} style={{ margin: 0 }}>
                            {activeTab === 'actualites' ? 'Gestion des Actualités' : 'Activités en Circonscription'}
                        </Title>
                        <Text type="secondary">
                            {activeTab === 'actualites'
                                ? 'Gérez les actualités de l\'assemblée'
                                : 'Suivez les activités des députés'}
                        </Text>
                    </Space>
                }
                bordered={false}
                extra={
                    activeTab === 'actualites' ? (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddActualite}>
                            Nouvelle Actualité
                        </Button>
                    ) : (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddActivity}>
                            Nouvelle Activité
                        </Button>
                    )
                }
            >
                {/* Navigation par onglets */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ marginBottom: 24 }}
                    tabBarExtraContent={
                        <Space size="large">
                            <Search
                                placeholder={`Rechercher ${activeTab === 'actualites' ? 'actualités' : 'activités'}...`}
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                style={{ width: 300 }}
                                onChange={e => setSearchText(e.target.value)}
                            />
                            <Button icon={<FilterOutlined />}>Filtres</Button>
                        </Space>
                    }
                >
                    <TabPane
                        tab={
                            <Space>
                                <TeamOutlined />
                                Actualités
                                <Badge count={actualites.length} style={{ backgroundColor: '#1890ff' }} />
                            </Space>
                        }
                        key="actualites"
                    />
                    <TabPane
                        tab={
                            <Space>
                                <UserOutlined />
                                Activités en Circonscription
                                <Badge count={activities.length} style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        }
                        key="activites"
                    />
                </Tabs>

                {/* Contenu des onglets */}
                {activeTab === 'actualites' ? (
                    <Table
                        columns={actualiteColumns}
                        dataSource={filteredActualites}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                ) : (
                    <Table
                        columns={activityColumns}
                        dataSource={filteredActivities}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                )}
            </Card>

            {/* Modal pour les actualités */}
            <Modal
                title={
                    <Space>
                        <TeamOutlined />
                        {currentActualite ? 'Modifier une actualité' : 'Créer une nouvelle actualité'}
                    </Space>
                }
                visible={isActualiteModalVisible}
                onCancel={() => {
                    setIsActualiteModalVisible(false);
                    actualiteForm.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={actualiteForm}
                    layout="vertical"
                    onFinish={handleSubmitActualite}
                    initialValues={{
                        statut: 'brouillon',
                        isImportant: false
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type d'actualité"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un type">
                                    {ACTUALITE_TYPES.map(type => (
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
                                name="statut"
                                label="Statut"
                            >
                                <Select>
                                    {STATUTS.map(statut => (
                                        <Option key={statut.value} value={statut.value}>
                                            <Badge color={statut.color} text={statut.label} />
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Titre"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Titre de l'actualité" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date et heure"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="isImportant"
                                label="Actualité importante"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description courte"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input.TextArea rows={3} placeholder="Description visible dans les listes" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="details"
                                label="Contenu détaillé"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input.TextArea rows={6} placeholder="Contenu complet de l'actualité" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="imageUrl"
                                label="Image principale"
                            >
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        setCover({
                                            ...cover,
                                            photo: URL.createObjectURL(file),
                                            photoFile: file
                                        });
                                        return false;
                                    }}
                                >
                                    {cover.photo ? (
                                        <img src={cover.photo} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Uploader</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="piecesJointes"
                                label="Pièces jointes"
                            >
                                <Upload
                                    multiple
                                    beforeUpload={(file) => {
                                        setAttachments(prev => [...prev, file]);
                                        return false;
                                    }}
                                    fileList={attachments.map((file, index) => ({
                                        uid: index,
                                        name: file.name,
                                        status: 'done'
                                    }))}
                                    onRemove={(file) => {
                                        setAttachments(prev => prev.filter(f => f.name !== file.name));
                                    }}
                                >
                                    <Button icon={<FilePdfOutlined />}>Ajouter des documents</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsActualiteModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentActualite ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour les activités */}
            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        {currentActivity ? 'Modifier une activité' : 'Créer une nouvelle activité'}
                    </Space>
                }
                visible={isActivityModalVisible}
                onCancel={() => {
                    setIsActivityModalVisible(false);
                    activityForm.resetFields();
                    setActivityImages([]);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={activityForm}
                    layout="vertical"
                    onFinish={handleSubmitActivity}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="deputyId"
                                label="Député"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un député">
                                    {DEPUTIES.map(deputy => (
                                        <Option key={deputy.id} value={deputy.id}>
                                            <Space>
                                                <Avatar src={deputy.image} size="small" />
                                                {deputy.name} ({deputy.constituency})
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Catégorie"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez une catégorie">
                                    {ACTIVITY_CATEGORIES.map(category => (
                                        <Option key={category.value} value={category.value}>
                                            <Tag color={category.color}>{category.label}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Titre de l'activité"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Titre de l'activité" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="location"
                                label="Lieu"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Lieu de l'activité" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Description détaillée de l'activité" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Images"
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    fileList={activityImages.map((img, index) => ({
                                        uid: index,
                                        name: `image-${index}.jpg`,
                                        status: 'done',
                                        url: img
                                    }))}
                                    beforeUpload={handleActivityImageUpload}
                                    onRemove={handleActivityImageRemove}
                                    accept="image/*"
                                >
                                    {activityImages.length < 5 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Ajouter des images</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsActivityModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentActivity ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de prévisualisation des actualités */}
            <Modal
                title={currentActualite?.title}
                visible={previewActualiteVisible}
                onCancel={() => setPreviewActualiteVisible(false)}
                footer={null}
                width={800}
            >
                {currentActualite && (
                    <div className="actualite-preview">
                        <div className="actualite-header">
                            <Tag color={ACTUALITE_TYPES.find(t => t.value === currentActualite.type)?.color}>
                                {ACTUALITE_TYPES.find(t => t.value === currentActualite.type)?.label}
                            </Tag>
                            <span className="actualite-date">
                                {moment(currentActualite.date).format('dddd D MMMM YYYY [à] HH[h]mm')}
                            </span>
                            {currentActualite.isImportant && <Tag color="red">Important</Tag>}
                        </div>

                        {currentActualite.imageUrl && (
                            <Image
                                src={currentActualite.imageUrl}
                                alt={currentActualite.title}
                                style={{ width: '100%', margin: '16px 0' }}
                            />
                        )}

                        <div className="actualite-description">
                            <h3>{currentActualite.description}</h3>
                        </div>

                        <Divider />

                        <div className="actualite-content">
                            {currentActualite.details.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>

                        {currentActualite.piecesJointes?.length > 0 && (
                            <>
                                <Divider orientation="left">Documents associés</Divider>
                                <List
                                    dataSource={currentActualite.piecesJointes}
                                    renderItem={item => (
                                        <List.Item>
                                            <FilePdfOutlined style={{ marginRight: 8 }} />
                                            {item.split('/').pop()}
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal de prévisualisation des activités */}
            <Modal
                title={currentActivity?.title}
                visible={!!currentActivity}
                onCancel={() => setCurrentActivity(null)}
                footer={null}
                width={800}
            >
                {currentActivity && (
                    <div className="activity-preview">
                        <div className="activity-header">
                            <Space>
                                <Avatar
                                    src={DEPUTIES.find(d => d.id === currentActivity.deputyId)?.image}
                                    size="large"
                                />
                                <div>
                                    <h4>{DEPUTIES.find(d => d.id === currentActivity.deputyId)?.name}</h4>
                                    <p>{DEPUTIES.find(d => d.id === currentActivity.deputyId)?.constituency}</p>
                                </div>
                            </Space>

                            <Divider />

                            <Tag color={ACTIVITY_CATEGORIES.find(c => c.value === currentActivity.category)?.color}>
                                {ACTIVITY_CATEGORIES.find(c => c.value === currentActivity.category)?.label}
                            </Tag>
                            <span className="activity-date">
                                {moment(currentActivity.date).format('dddd D MMMM YYYY')}
                            </span>
                            <p><strong>Lieu:</strong> {currentActivity.location}</p>
                        </div>

                        {currentActivity.images?.length > 0 && (
                            <Image.PreviewGroup>
                                <Row gutter={[16, 16]} style={{ margin: '16px 0' }}>
                                    {currentActivity.images.map((img, index) => (
                                        <Col span={8} key={index}>
                                            <Image src={img} />
                                        </Col>
                                    ))}
                                </Row>
                            </Image.PreviewGroup>
                        )}

                        <div className="activity-content">
                            <p>{currentActivity.description}</p>
                        </div>

                        <Divider />

                        <div className="activity-engagement">
                            <Space size="large">
                                <Button icon={<LikeOutlined />}>
                                    {currentActivity.likes} J'aime
                                </Button>
                                <Button icon={<MessageOutlined />}>
                                    {currentActivity.comments} Commentaires
                                </Button>
                            </Space>
                        </div>

                        <Divider />

                        <div className="activity-comments">
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    {
                                        author: 'Utilisateur Anonyme',
                                        avatar: <Avatar icon={<UserOutlined />} />,
                                        content: 'Très belle initiative! Cela va beaucoup aider les jeunes de la circonscription.',
                                        datetime: (
                                            <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                <span>{moment().fromNow()}</span>
                                            </Tooltip>
                                        )
                                    }
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={item.avatar}
                                            title={<a>{item.author}</a>}
                                            description={
                                                <>
                                                    <p>{item.content}</p>
                                                    {item.datetime}
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Actualites;