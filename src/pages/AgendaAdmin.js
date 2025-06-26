import React, { useState } from 'react';
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
    Image,
    Switch,
    Collapse
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import '../styles/Agenda.css';
import Search from "antd/es/input/Search";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Types d'événements parlementaires
const EVENT_TYPES = [
    { value: 'seance', label: 'Séance publique', color: 'blue' },
    { value: 'commission', label: 'Commission', color: 'green' },
    { value: 'audition', label: 'Audition', color: 'orange' },
    { value: 'conference', label: 'Conférence', color: 'purple' },
    { value: 'reunion', label: 'Réunion', color: 'cyan' }
];

// Statuts des événements
const EVENT_STATUS = [
    { value: 'planned', label: 'Planifié', color: 'blue' },
    { value: 'confirmed', label: 'Confirmé', color: 'green' },
    { value: 'postponed', label: 'Reporté', color: 'orange' },
    { value: 'cancelled', label: 'Annulé', color: 'red' },
    { value: 'completed', label: 'Terminé', color: 'gray' }
];

const AgendaAdmin = () => {
    // États
    const [agendaEvents, setAgendaEvents] = useState([
        {
            id: 1,
            type: 'seance',
            title: "Séance publique",
            dateRange: ["2025-03-31", "2025-04-02"],
            description: "Examen des projets de loi sur les collectivités territoriales",
            details: [
                { title: "Délégations", content: "Situation financière des collectivités territoriales" },
                { title: "Ordre du jour", content: "Vote sur la réforme fiscale locale" }
            ],
            imageUrl: "https://img.freepik.com/photos-gratuite/personnes-prenant-part-evenement-haut-protocole_23-2150951243.jpg",
            status: 'confirmed',
            isPublic: true,
            location: "Hémicycle",
            participants: ["Président de l'Assemblée", "Ministre des Collectivités"]
        }
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    // Colonnes du tableau
    const columns = [
        {
            title: 'Événement',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    <Tag color={EVENT_TYPES.find(t => t.value === record.type)?.color}>
                        {EVENT_TYPES.find(t => t.value === record.type)?.label}
                    </Tag>
                    <strong>{text}</strong>
                </Space>
            )
        },
        {
            title: 'Dates',
            dataIndex: 'dateRange',
            key: 'dates',
            render: (dates) => (
                <span>
          Du {moment(dates[0]).format('DD/MM')} au {moment(dates[1]).format('DD/MM/YYYY')}
        </span>
            ),
            sorter: (a, b) => moment(a.dateRange[0]).diff(moment(b.dateRange[0]))
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusInfo = EVENT_STATUS.find(s => s.value === status);
                return <Badge color={statusInfo.color} text={statusInfo.label} />;
            },
            filters: EVENT_STATUS.map(s => ({ text: s.label, value: s.value })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Public',
            dataIndex: 'isPublic',
            key: 'isPublic',
            render: (isPublic) => (
                <Tag color={isPublic ? 'green' : 'orange'}>
                    {isPublic ? 'Public' : 'Interne'}
                </Tag>
            ),
            filters: [
                { text: 'Public', value: true },
                { text: 'Interne', value: false }
            ],
            onFilter: (value, record) => record.isPublic === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handlePreview(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cet événement ?"
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
        setCurrentEvent(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        form.setFieldsValue({
            ...event,
            dateRange: [moment(event.dateRange[0]), moment(event.dateRange[1])]
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        setAgendaEvents(agendaEvents.filter(event => event.id !== id));
        message.success('Événement supprimé avec succès');
    };

    const handlePreview = (event) => {
        setCurrentEvent(event);
        setPreviewVisible(true);
    };

    const handleSubmit = (values) => {
        const eventData = {
            ...values,
            dateRange: [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')],
            details: values.details || []
        };

        if (currentEvent) {
            // Édition
            setAgendaEvents(agendaEvents.map(e =>
                e.id === currentEvent.id ? { ...e, ...eventData } : e
            ));
            message.success('Événement mis à jour avec succès');
        } else {
            // Création
            const newEvent = {
                id: Math.max(...agendaEvents.map(e => e.id), 0) + 1,
                ...eventData
            };
            setAgendaEvents([...agendaEvents, newEvent]);
            message.success('Événement créé avec succès');
        }

        setIsModalVisible(false);
    };

    const addDetailItem = () => {
        const details = form.getFieldValue('details') || [];
        form.setFieldsValue({
            details: [...details, { title: '', content: '' }]
        });
    };

    const removeDetailItem = (index) => {
        const details = form.getFieldValue('details') || [];
        form.setFieldsValue({
            details: details.filter((_, i) => i !== index)
        });
    };

    const filteredEvents = agendaEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase()) ||
            event.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'all' || event.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="agenda-admin-page">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>

            <Card
                title="Agenda des Travaux Parlementaires"
                bordered={false}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Ajouter un Événement
                    </Button>
                }
            >
                {/* Barre de filtres */}
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
                        <RangePicker />
                        <Button icon={<FilterOutlined />}>Filtres Avancés</Button>
                    </Space>
                </div>

                {/* Onglets */}
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 16 }}>
                    <TabPane tab="Tous" key="all" />
                    {EVENT_STATUS.map(status => (
                        <TabPane
                            tab={
                                <Badge
                                    count={agendaEvents.filter(e => e.status === status.value).length}
                                    offset={[10, 0]}
                                >
                                    {status.label}
                                </Badge>
                            }
                            key={status.value}
                        />
                    ))}
                </Tabs>

                {/* Tableau */}
                <Table
                    columns={columns}
                    dataSource={filteredEvents}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentEvent ? "Modifier l'événement" : "Ajouter un nouvel événement"}
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
                        status: 'planned',
                        isPublic: true,
                        details: []
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type d'événement"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un type">
                                    {EVENT_TYPES.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            <Tag color={type.color}>{type.label}</Tag>
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
                                <Select placeholder="Sélectionnez un statut">
                                    {EVENT_STATUS.map(status => (
                                        <Option key={status.value} value={status.value}>
                                            <Badge color={status.color} text={status.label} />
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Titre de l'événement"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Séance plénière du 15 avril" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="dateRange"
                                label="Période"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description courte"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={3} placeholder="Description visible dans les listes" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="location"
                                label="Lieu"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Hémicycle, Salle des commissions..." />
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

                        <Col span={24}>
                            <Form.Item
                                name="participants"
                                label="Participants principaux"
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Ajoutez les participants"
                                    tokenSeparators={[',']}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="imageUrl"
                                label="Image illustrative"
                            >
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Uploader</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Divider orientation="left">Détails de l'ordre du jour</Divider>
                            <Form.List name="details">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'title']}
                                                    rules={[{ required: true, message: 'Titre obligatoire' }]}
                                                >
                                                    <Input placeholder="Titre du point" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'content']}
                                                    rules={[{ required: true, message: 'Contenu obligatoire' }]}
                                                >
                                                    <Input.TextArea placeholder="Description" rows={2} style={{ width: 300 }} />
                                                </Form.Item>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                Ajouter un point à l'ordre du jour
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentEvent ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de prévisualisation */}
            <Modal
                title={currentEvent?.title}
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
            >
                {currentEvent && (
                    <div className="event-preview">
                        <div className="event-header">
                            <Tag color={EVENT_TYPES.find(t => t.value === currentEvent.type)?.color}>
                                {EVENT_TYPES.find(t => t.value === currentEvent.type)?.label}
                            </Tag>
                            <span className="event-dates">
                Du {moment(currentEvent.dateRange[0]).format('dddd D MMMM YYYY')} au {moment(currentEvent.dateRange[1]).format('dddd D MMMM YYYY')}
              </span>
                            <Badge
                                status={EVENT_STATUS.find(s => s.value === currentEvent.status)?.color}
                                text={EVENT_STATUS.find(s => s.value === currentEvent.status)?.label}
                            />
                        </div>

                        {currentEvent.imageUrl && (
                            <Image
                                src={currentEvent.imageUrl}
                                alt={currentEvent.title}
                                style={{ width: '100%', margin: '16px 0' }}
                            />
                        )}

                        <div className="event-description">
                            <h3>{currentEvent.description}</h3>
                        </div>

                        <Divider />

                        <div className="event-meta">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <h4>Lieu :</h4>
                                    <p>{currentEvent.location}</p>
                                </Col>
                                <Col span={12}>
                                    <h4>Participants :</h4>
                                    <ul>
                                        {currentEvent.participants?.map((p, i) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        </div>

                        <Divider orientation="left">Ordre du jour</Divider>

                        <Collapse accordion>
                            {currentEvent.details?.map((detail, index) => (
                                <Panel header={detail.title} key={index}>
                                    <p>{detail.content}</p>
                                </Panel>
                            ))}
                        </Collapse>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AgendaAdmin;