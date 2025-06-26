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
    Switch
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
    TeamOutlined
} from '@ant-design/icons';
import moment from 'moment';
import '../styles/Actualites.css';
import Search from "antd/es/input/Search";
import {ActualityContext} from "../providers/ActualityProvider";

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

const Actualites = () => {
    // États
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentActualite, setCurrentActualite] = useState(null);
    const [activeTab, setActiveTab] = useState('tous');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [cover,setCover] = useState({});
    const [attachments, setAttachments] = useState([]);
    const {actualities,createActuality,deleteActuality } = useContext(ActualityContext)
    const [form] = Form.useForm();

    // Données initiales
    const [actualites, setActualites] = useState(actualities);

    useEffect(() => {
        setActualites(actualities);
    },[actualities]);

    // Colonnes du tableau
    const columns = [
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
            },
            filters: ACTUALITE_TYPES.map(t => ({ text: t.label, value: t.value })),
            onFilter: (value, record) => record.type === value,
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
            },
            filters: STATUTS.map(s => ({ text: s.label, value: s.value })),
            onFilter: (value, record) => record.statut === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handlePreview(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette actualité ?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Handlers
    const handleAdd = () => {
        setCurrentActualite(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (actualite) => {
        setCurrentActualite(actualite);
        form.setFieldsValue({
            ...actualite,
            date: moment(actualite.date)
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await deleteActuality(id);
        message.success('Actualité supprimée avec succès');
    };

    const handlePreview = (actualite) => {
        setCurrentActualite(actualite);
        setPreviewVisible(true);
    };

    const handleSubmit = async (values) => {
        const actualiteData = {
            ...values,
            date: values.date.format('YYYY-MM-DDTHH:mm:ss'), // ISO sans offset
            auteur: "Admin Assemblée"
        };

        if (currentActualite) {
            // Édition
            setActualites(actualites.map(a =>
                a.id === currentActualite.id ? {...a, ...actualiteData} : a
            ));
            message.success('Actualité mise à jour avec succès');
        } else {
            // Création
            const newActualite = {
                id: Math.max(...actualites.map(a => a.id), 0) + 1,
                ...actualiteData,
            };
            await createActuality(newActualite, cover.photoFile || null, attachments);
            message.success('Actualité créée avec succès');
        }

        setIsModalVisible(false);
        form.resetFields();
    };

    const filteredActualites = actualites.filter(actualite => {
        const matchesSearch = actualite.title.toLowerCase().includes(searchText.toLowerCase()) ||
            actualite.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'tous' || actualite.statut === activeTab;
        return matchesSearch && matchesTab;
    });

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
                title="Gestion des Actualités"
                bordered={false}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Nouvelle Actualité
                    </Button>
                }
            >
                {/* Filtres */}
                <div className="filters-bar">
                    <Space size="large">
                        <Search
                            placeholder="Rechercher..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            style={{ width: 300 }}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <RangePicker showTime />
                        <Button icon={<FilterOutlined />}>Filtres avancés</Button>
                    </Space>
                </div>

                {/* Onglets */}
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 16 }}>
                    <TabPane tab="Tous" key="tous" />
                    {STATUTS.map(statut => (
                        <TabPane
                            tab={<Badge count={actualites.filter(a => a.statut === statut.value).length}>{statut.label}</Badge>}
                            key={statut.value}
                        />
                    ))}
                </Tabs>

                {/* Tableau */}
                <Table
                    columns={columns}
                    dataSource={filteredActualites}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentActualite ? 'Modifier une actualité' : 'Créer une nouvelle actualité'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
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
                                        console.log("file photo:", file);
                                        // On capture le fichier ici ✅
                                        setCover({
                                            ...cover,
                                            photo: URL.createObjectURL(file),
                                            photoFile: file
                                        });
                                        return false; // empêcher le chargement automatique
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
                                        // 🔁 Ajoute le fichier à l'état
                                        setAttachments(prev => [...prev, file]);
                                        return false; // empêche l'upload automatique
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
                            <Button onClick={() => setIsModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentActualite ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de prévisualisation */}
            <Modal
                title={currentActualite?.title}
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
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
        </div>
    );
};

export default Actualites;