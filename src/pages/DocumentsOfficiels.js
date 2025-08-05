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
    Tooltip,
    Descriptions
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileTextOutlined,
    CalendarOutlined,
    SyncOutlined, UploadOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import moment from 'moment';
import Search from "antd/es/input/Search";
import '../styles/DocumentsOfficiels.css'

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const DocumentsOfficiels = () => {
    // États
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [activeTab, setActiveTab] = useState('tous');
    const [form] = Form.useForm();

    // Données des documents
    const [documents, setDocuments] = useState([
        {
            id: 1,
            titre: 'Loi de Finances 2024',
            reference: 'LF-2024-001',
            type: 'loi',
            date: '2023-12-15',
            statut: 'valide',
            auteur: 'Ministère des Finances',
            taille: '2.4 Mo',
            format: 'pdf',
            description: 'Projet de loi de finances pour l\'année 2024',
            url: '/documents/loi-finances-2024.pdf'
        },
        {
            id: 2,
            titre: 'Rapport Annuel 2023',
            reference: 'RA-2023-045',
            type: 'rapport',
            date: '2023-11-30',
            statut: 'valide',
            auteur: 'Assemblée Nationale',
            taille: '5.1 Mo',
            format: 'pdf',
            description: 'Rapport annuel des activités parlementaires',
            url: '/documents/rapport-annuel-2023.pdf'
        },
        {
            id: 3,
            titre: 'Projet de Réforme Constitutionnelle',
            reference: 'PRC-2023-012',
            type: 'projet',
            date: '2023-10-20',
            statut: 'brouillon',
            auteur: 'Commission Constitutionnelle',
            taille: '1.8 Mo',
            format: 'docx',
            description: 'Avant-projet de réforme constitutionnelle',
            url: '/documents/reforme-constitutionnelle.docx'
        }
    ]);

    // Options
    const typesDocument = [
        { value: 'loi', label: 'Loi', icon: <FilePdfOutlined /> },
        { value: 'decret', label: 'Décret', icon: <FilePdfOutlined /> },
        { value: 'arrete', label: 'Arrêté', icon: <FilePdfOutlined /> },
        { value: 'rapport', label: 'Rapport', icon: <FileWordOutlined /> },
        { value: 'projet', label: 'Projet', icon: <FileWordOutlined /> },
        { value: 'compte-rendu', label: 'Compte-rendu', icon: <FileExcelOutlined /> }
    ];

    const statuts = [
        { value: 'brouillon', label: 'Brouillon', color: 'orange' },
        { value: 'valide', label: 'Validé', color: 'green' },
        { value: 'obsolete', label: 'Obsolète', color: 'gray' },
        { value: 'archive', label: 'Archivé', color: 'blue' }
    ];

    // Colonnes du tableau
    const columns = [
        {
            title: 'Document',
            dataIndex: 'titre',
            key: 'titre',
            render: (text, record) => (
                <Space>
                    {getDocumentIcon(record.format)}
                    <span>{text}</span>
                    <Tag color={getTypeColor(record.type)}>
                        {typesDocument.find(t => t.value === record.type)?.label}
                    </Tag>
                </Space>
            )
        },
        {
            title: 'Référence',
            dataIndex: 'reference',
            key: 'reference'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    {moment(date).format('DD/MM/YYYY')}
                </Space>
            ),
            sorter: (a, b) => moment(a.date).diff(moment(b.date))
        },
        {
            title: 'Auteur',
            dataIndex: 'auteur',
            key: 'auteur'
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => {
                const status = statuts.find(s => s.value === statut);
                return <Badge color={status.color} text={status.label} />;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Télécharger">
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record.url)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce document ?"
                        onConfirm={() => deleteDocument(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // Fonctions utilitaires
    const getTypeColor = (type) => {
        const colors = {
            loi: 'red',
            decret: 'volcano',
            arrete: 'orange',
            rapport: 'green',
            projet: 'blue',
            'compte-rendu': 'purple'
        };
        return colors[type] || 'gray';
    };

    const getDocumentIcon = (format) => {
        switch(format) {
            case 'pdf': return <FilePdfOutlined style={{ color: '#f5222d' }} />;
            case 'docx': return <FileWordOutlined style={{ color: '#1890ff' }} />;
            case 'xlsx': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
            default: return <FileTextOutlined />;
        }
    };

    const editDocument = (document) => {
        setCurrentDocument(document);
        form.setFieldsValue({
            ...document,
            date: document.date ? moment(document.date) : null
        });
        setIsModalVisible(true);
    };

    const deleteDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        message.success('Document supprimé avec succès');
    };

    const handleDownload = (url) => {
        message.info(`Téléchargement du document: ${url}`);
        // Ici vous implémenteriez la logique de téléchargement réel
    };

    const handleSubmit = (values) => {
        const updatedValues = {
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            format: values.titre.split('.').pop().toLowerCase()
        };

        if (currentDocument) {
            setDocuments(documents.map(doc =>
                doc.id === currentDocument.id ? { ...doc, ...updatedValues } : doc
            ));
            message.success('Document mis à jour avec succès');
        } else {
            const newDocument = {
                id: documents.length + 1,
                reference: `DOC-${Date.now()}`,
                statut: 'brouillon',
                taille: '0 Mo',
                ...updatedValues
            };
            setDocuments([...documents, newDocument]);
            message.success('Document créé avec succès');
        }

        setIsModalVisible(false);
        form.resetFields();
        setCurrentDocument(null);
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.titre.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.reference.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'tous' || doc.statut === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="page-documents">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>
            <Card
                title="Gestion des Rapports Officiels"
                bordered={false}
            >
                {/* Barre de recherche et filtres */}
                <div className="filters-bar">
                    <Row gutter={16} align="middle">
                        <Col xs={24} md={12} lg={8}>
                            <Search
                                placeholder="Rechercher des documents..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={12} lg={16} style={{ textAlign: 'right' }}>
                            <Space>
                                <DatePicker.RangePicker />
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Tableau des documents */}
                <Table
                    columns={columns}
                    dataSource={filteredDocuments}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    expandable={{
                        expandedRowRender: record => (
                            <div className="document-details">
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="Description">{record.description}</Descriptions.Item>
                                    <Descriptions.Item label="Taille">{record.taille}</Descriptions.Item>
                                    <Descriptions.Item label="Format">
                                        <Tag>{record.format.toUpperCase()}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="URL">
                                        <a href={record.url} target="_blank" rel="noopener noreferrer">
                                            {record.url}
                                        </a>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        )
                    }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setCurrentDocument(null);
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
                        type: 'loi',
                        statut: 'brouillon'
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="titre"
                                label="Titre du document"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Loi de finances 2024..." />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type de document"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select>
                                    {typesDocument.map(type => (
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
                                name="date"
                                label="Date du document"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="auteur"
                                label="Auteur"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ministère des Finances..." />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={4} placeholder="Description détaillée du document..." />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="fichier"
                                label="Fichier"
                                valuePropName="fileList"
                                getValueFromEvent={e => e.fileList}
                            >
                                <Upload
                                    maxCount={1}
                                    beforeUpload={() => false} // Empêche l'upload automatique
                                >
                                    <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
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
                                {currentDocument ? 'Mettre à jour' : 'Ajouter le document'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DocumentsOfficiels;