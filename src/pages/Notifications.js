import React, {useEffect, useState} from 'react';
import {
    Card,
    List,
    Button,
    Tag,
    Space,
    Input,
    Popconfirm,
    message,
    Form,
    Select,
    Divider,
    Row,
    Col,
    Tabs,
    Badge,
    Descriptions,
    Tooltip, Upload
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MailOutlined,
    ArrowLeftOutlined,
    SendOutlined,
    PaperClipOutlined,
    StarFilled,
    StarOutlined,
    FilterFilled
} from '@ant-design/icons';
import Search from "antd/es/input/Search";
import moment from "moment";
import '../styles/Message.css'
import {useNotification} from "../providers/AlertProvider";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Notifications = () => {
    // États
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isComposing, setIsComposing] = useState(false);
    const [form] = Form.useForm();
    const {notifications,markAsRead} = useNotification();

    // Données des messages
    const [messages, setMessages] = useState(notifications);

    useEffect(() => {
        setMessages(notifications);
    },[notifications])

    // Options
    const expediteurs = [
        { value: 'president@assemblee.rdc', label: 'Président de l\'Assemblée' },
        { value: 'ministre@interieur.gouv', label: 'Ministre de l\'Intérieur' },
        { value: 'secretariat@assemblee.rdc', label: 'Secrétariat Général' }
    ];

    const labels = [
        { value: 'urgent', label: 'Urgent', color: 'red' },
        { value: 'securité', label: 'Sécurité', color: 'orange' },
        { value: 'procedure', label: 'Procédure', color: 'blue' },
        { value: 'interne', label: 'Interne', color: 'green' }
    ];

    // Fonctions utilitaires
    const toggleStar = (id) => {
        setMessages(messages.map(msg =>
            msg.id === id ? { ...msg, starred: !msg.starred } : msg
        ));
    };

    const deleteMessage = (id) => {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        message.success('Message supprimé');
    };


    const handleReply = () => {
        setIsComposing(true);
        form.setFieldsValue({
            to: selectedMessage.from,
            subject: `RE: ${selectedMessage.subject}`
        });
    };

    const handleSubmit = (values) => {
        const newMessage = {
            id: messages.length + 1,
            from: 'admin@assemblee.rdc',
            ...values,
            date: new Date().toISOString(),
            read: true,
            starred: false,
            labels: []
        };

        setMessages([newMessage, ...messages]);
        message.success('Message envoyé');
        setIsComposing(false);
        form.resetFields();
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.subject.toLowerCase().includes(searchText.toLowerCase()) ||
            msg.content.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === 'inbox') return matchesSearch;
        if (activeTab === 'unread') return matchesSearch && !msg.read;
        if (activeTab === 'read') return matchesSearch && msg.read;
        return matchesSearch;
    });

    return (
        <div className="page-messages">
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
                        <MailOutlined />
                        <span>Messagerie Officielle</span>
                        <Badge count={messages.filter(m => !m.read).length} />
                    </Space>
                }
                bordered={false}
            >
                {/* Barre de recherche et filtres */}
                <div className="messages-toolbar">
                    <Row gutter={16} align="middle">
                        <Col flex="auto">
                            <Search
                                placeholder="Rechercher dans les messages..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Space>
                                <Button icon={<FilterFilled />}>Filtres</Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setIsComposing(true);
                                        setSelectedMessage(null);
                                    }}
                                >
                                    Nouveau message
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* Double vue : liste + détail */}
                <Row gutter={16}>
                    {/* Liste des messages */}
                    <Col xs={24} md={selectedMessage ? 8 : 24} lg={selectedMessage ? 8 : 24}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            style={{ marginBottom: 16 }}
                        >
                            <TabPane tab="Boîte de réception" key="inbox" />
                            <TabPane tab="Non lus" key="unread" />
                            <TabPane tab="Lus" key="read" />
                        </Tabs>

                        <List
                            itemLayout="horizontal"
                            dataSource={filteredMessages}
                            renderItem={item => (
                                <List.Item
                                    className={`message-item ${!item.read ? 'unread' : ''} ${selectedMessage?.id === item.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedMessage(item);
                                        markAsRead(item.id);
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Tooltip title={item.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                        <span onClick={(e) => { e.stopPropagation(); toggleStar(item.id); }}>
                          {item.starred ?
                              <StarFilled style={{ color: '#faad14' }} /> :
                              <StarOutlined />}
                        </span>
                                            </Tooltip>
                                        }
                                        title={
                                            <Space>
                                                <span>{item.from.split('@')[0]}</span>
                                                {item.labels.map(label => (
                                                    <Tag key={label} color={labels.find(l => l.value === label)?.color}>
                                                        {labels.find(l => l.value === label)?.label}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        }
                                        description={
                                            <>
                                                <div className="message-subject">{item.subject}</div>
                                                <div className="message-preview">{item.content.substring(0, 60)}...</div>
                                                <div className="message-meta">
                                                    <span>{moment(item.date).format('DD/MM HH:mm')}</span>
                                                    {item.attachments.length > 0 && (
                                                        <PaperClipOutlined style={{ marginLeft: 8 }} />
                                                    )}
                                                </div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>

                    {/* Détail du message */}
                    {selectedMessage && (
                        <Col xs={24} md={16} lg={16}>
                            <Card
                                title={
                                    <Space>
                                        <Button
                                            icon={<ArrowLeftOutlined />}
                                            onClick={() => setSelectedMessage(null)}
                                            style={{ marginRight: 16 }}
                                        />
                                        {selectedMessage.subject}
                                    </Space>
                                }
                                extra={
                                    <Space>
                                        <Popconfirm
                                            title="Supprimer ce message ?"
                                            onConfirm={() => deleteMessage(selectedMessage.id)}
                                        >
                                            <Button icon={<DeleteOutlined />} danger />
                                        </Popconfirm>
                                    </Space>
                                }
                            >
                                <Descriptions column={1} bordered size="small">
                                    <Descriptions.Item label="De">{selectedMessage.from}</Descriptions.Item>
                                    <Descriptions.Item label="À">{selectedMessage.to}</Descriptions.Item>
                                    <Descriptions.Item label="Date">
                                        {moment(selectedMessage.date).format('DD/MM/YYYY HH:mm')}
                                    </Descriptions.Item>
                                    {selectedMessage.attachments.length > 0 && (
                                        <Descriptions.Item label="Pièces jointes">
                                            {selectedMessage.attachments.map((file, i) => (
                                                <div key={i}>
                                                    <PaperClipOutlined />
                                                    <a href={`/attachments/${file}`} download>{file}</a>
                                                </div>
                                            ))}
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>

                                <Divider />

                                <div className="message-content">
                                    {selectedMessage.content}
                                </div>
                            </Card>
                        </Col>
                    )}

                    {/* Composition de message */}
                    {isComposing && (
                        <Col xs={24} md={selectedMessage ? 16 : 24} lg={selectedMessage ? 16 : 24}>
                            <Card
                                title="Nouveau message"
                                extra={
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => setIsComposing(false)}
                                    />
                                }
                            >
                                <Form form={form} onFinish={handleSubmit}>
                                    <Form.Item name="to" label="À" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Sélectionnez un destinataire"
                                            optionFilterProp="children"
                                        >
                                            {expediteurs.map(exp => (
                                                <Option key={exp.value} value={exp.value}>{exp.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="subject" label="Objet" rules={[{ required: true }]}>
                                        <Input placeholder="Objet du message" />
                                    </Form.Item>

                                    <Form.Item name="content" rules={[{ required: true }]}>
                                        <TextArea rows={10} placeholder="Rédigez votre message..." />
                                    </Form.Item>

                                    <Form.Item name="attachments" label="Pièces jointes">
                                        <Upload.Dragger multiple>
                                            <PaperClipOutlined style={{ fontSize: 24 }} />
                                            <p>Glissez-déposez des fichiers ou cliquez pour sélectionner</p>
                                        </Upload.Dragger>
                                    </Form.Item>

                                    <Form.Item style={{ textAlign: 'right' }}>
                                        <Space>
                                            <Button onClick={() => setIsComposing(false)}>
                                                Annuler
                                            </Button>
                                            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                                                Envoyer
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Card>
        </div>
    );
};

export default Notifications;