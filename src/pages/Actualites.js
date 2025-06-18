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
    List
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    CalendarOutlined,
    FilterOutlined,
    SyncOutlined
} from '@ant-design/icons';
import '../styles/Actualites.css';
import Search from "antd/es/input/Search";
import moment from 'moment';
import '../styles/Actualites.css'

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Actualites = () => {
    // États
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [activeTab, setActiveTab] = useState('tous');
    const [form] = Form.useForm();

    // Données des actualités
    const [articles, setArticles] = useState([
        {
            id: 1,
            titre: 'Réforme constitutionnelle adoptée',
            categorie: 'politique',
            date: '2023-06-15',
            statut: 'publié',
            auteur: 'Admin RDC',
            vues: 1245,
            piecesJointes: ['document.pdf'],
            contenu: 'Le parlement a adopté la réforme constitutionnelle avec une majorité de 75%.'
        },
        {
            id: 2,
            titre: 'Nouveau programme éducatif',
            categorie: 'education',
            date: '2023-06-10',
            statut: 'brouillon',
            auteur: 'Ministre Education',
            vues: 0,
            piecesJointes: [],
            contenu: 'Le nouveau programme sera appliqué dès la rentrée scolaire 2023-2024.'
        },
        {
            id: 3,
            titre: 'Session plénière du 20 juin',
            categorie: 'annonce',
            date: '2023-06-18',
            statut: 'programmé',
            auteur: 'Admin RDC',
            vues: 0,
            piecesJointes: ['ordre_du_jour.pdf'],
            contenu: 'La prochaine session plénière traitera du budget national.'
        }
    ]);

    // Options
    const categories = [
        { value: 'politique', label: 'Politique' },
        { value: 'economie', label: 'Économie' },
        { value: 'education', label: 'Éducation' },
        { value: 'sante', label: 'Santé' },
        { value: 'annonce', label: 'Annonce officielle' }
    ];

    const statuts = [
        { value: 'brouillon', label: 'Brouillon', color: 'default' },
        { value: 'programmé', label: 'Programmé', color: 'orange' },
        { value: 'publié', label: 'Publié', color: 'green' },
        { value: 'archivé', label: 'Archivé', color: 'gray' }
    ];

    // Colonnes du tableau
    const columns = [
        {
            title: 'Titre',
            dataIndex: 'titre',
            key: 'titre',
            render: (text, record) => (
                <Space>
                    {record.piecesJointes?.some(f => f.endsWith('.pdf')) && <FilePdfOutlined style={{ color: '#f5222d' }} />}
                    {record.piecesJointes?.some(f => f.match(/\.(jpg|jpeg|png)$/i)) && <FileImageOutlined style={{ color: '#52c41a' }} />}
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: 'Catégorie',
            dataIndex: 'categorie',
            key: 'categorie',
            render: (categorie) => (
                <Tag color={getCategoryColor(categorie)}>
                    {categories.find(c => c.value === categorie)?.label}
                </Tag>
            ),
            filters: categories.map(c => ({ text: c.label, value: c.value })),
            onFilter: (value, record) => record.categorie === value,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    {new Date(date).toLocaleDateString()}
                </Space>
            ),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => {
                const status = statuts.find(s => s.value === statut);
                return <Badge color={status.color} text={status.label} />;
            },
            filters: statuts.map(s => ({ text: s.label, value: s.value })),
            onFilter: (value, record) => record.statut === value,
        },
        {
            title: 'Auteur',
            dataIndex: 'auteur',
            key: 'auteur',
        },
        {
            title: 'Vues',
            dataIndex: 'vues',
            key: 'vues',
            sorter: (a, b) => a.vues - b.vues,
            render: (vues) => vues.toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => previewArticle(record)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => editArticle(record)}
                    />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cet article ?"
                        onConfirm={() => deleteArticle(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Fonctions utilitaires
    const getCategoryColor = (categorie) => {
        const colors = {
            politique: 'red',
            economie: 'gold',
            education: 'blue',
            sante: 'green',
            annonce: 'purple'
        };
        return colors[categorie] || 'gray';
    };

    const previewArticle = (article) => {
        setCurrentArticle(article);
        setIsModalVisible(true);
    };

    const editArticle = (article) => {
        setCurrentArticle(article);
        form.setFieldsValue({
            ...article,
            date: article.date ? moment(article.date) : null
        });
        setIsModalVisible(true);
    };

    const deleteArticle = (id) => {
        setArticles(articles.filter(article => article.id !== id));
        message.success('Article supprimé avec succès');
    };

    const handleSubmit = (values) => {
        const updatedValues = {
            ...values,
            date: values.date ? values.date.format('YYYY-MM-DD') : null
        };

        if (currentArticle) {
            // Édition
            setArticles(articles.map(article =>
                article.id === currentArticle.id ? { ...article, ...updatedValues } : article
            ));
            message.success('Article mis à jour avec succès');
        } else {
            // Création
            const newArticle = {
                id: articles.length + 1,
                ...updatedValues,
                statut: 'brouillon',
                auteur: 'Admin RDC',
                vues: 0,
                piecesJointes: []
            };
            setArticles([...articles, newArticle]);
            message.success('Article créé avec succès');
        }

        setIsModalVisible(false);
        form.resetFields();
        setCurrentArticle(null);
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.titre.toLowerCase().includes(searchText.toLowerCase()) ||
            article.contenu.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'tous' || article.statut === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="page-actualites">
            <Card
                title="Gestion des Actualités"
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCurrentArticle(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Nouvel Article
                    </Button>
                }
            >
                {/* Barre de filtres */}
                <div className="filters-bar">
                    <Space size="large">
                        <Search
                            placeholder="Rechercher des articles..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            style={{ width: 300 }}
                            onChange={e => setSearchText(e.target.value)}
                        />

                        <Select
                            placeholder="Filtrer par catégorie"
                            style={{ width: 200 }}
                            allowClear
                            onChange={val => form.setFieldsValue({ categorie: val })}
                        >
                            {categories.map(cat => (
                                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                            ))}
                        </Select>

                        <RangePicker />

                        <Button icon={<FilterOutlined />}>Filtres avancés</Button>
                        <Button icon={<SyncOutlined />}>Réinitialiser</Button>
                    </Space>
                </div>

                {/* Onglets de statut */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ marginTop: 16 }}
                >
                    <TabPane tab="Tous" key="tous" />
                    {statuts.map(statut => (
                        <TabPane
                            tab={
                                <span>
                  {statut.label}
                                    <Badge
                                        count={articles.filter(a => a.statut === statut.value).length}
                                        style={{ marginLeft: 5 }}
                                    />
                </span>
                            }
                            key={statut.value}
                        />
                    ))}
                </Tabs>

                {/* Tableau des articles */}
                <Table
                    columns={columns}
                    dataSource={filteredArticles}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentArticle ? 'Modifier l\'article' : 'Créer un nouvel article'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setCurrentArticle(null);
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
                        statut: 'brouillon'
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="titre"
                                label="Titre de l'article"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Titre accrocheur..." />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="categorie"
                                label="Catégorie"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez une catégorie">
                                    {categories.map(cat => (
                                        <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date de publication"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    showTime={false}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="statut"
                                label="Statut"
                            >
                                <Select>
                                    {statuts.map(statut => (
                                        <Option key={statut.value} value={statut.value}>{statut.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="piecesJointes"
                                label="Pièces jointes"
                            >
                                <Upload
                                    multiple
                                    beforeUpload={() => false} // Empêche l'upload automatique
                                    listType="picture"
                                >
                                    <Button icon={<FileImageOutlined />}>Ajouter des fichiers</Button>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="contenu"
                                label="Contenu"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={10} placeholder="Rédigez votre article ici..." />
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
                                {currentArticle ? 'Mettre à jour' : 'Publier'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de prévisualisation */}
            {currentArticle && (
                <Modal
                    title={currentArticle.titre}
                    visible={isModalVisible && currentArticle}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    <div className="article-preview">
                        <div className="article-meta">
                            <Tag color={getCategoryColor(currentArticle.categorie)}>
                                {categories.find(c => c.value === currentArticle.categorie)?.label}
                            </Tag>
                            <span className="article-date">
                {new Date(currentArticle.date).toLocaleDateString()}
              </span>
                            <Badge
                                status={statuts.find(s => s.value === currentArticle.statut)?.color || 'default'}
                                text={statuts.find(s => s.value === currentArticle.statut)?.label}
                            />
                        </div>

                        <Divider />

                        <div className="article-content">
                            {currentArticle.contenu.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>

                        {currentArticle.piecesJointes?.length > 0 && (
                            <>
                                <Divider orientation="left">Pièces jointes</Divider>
                                <List
                                    dataSource={currentArticle.piecesJointes}
                                    renderItem={item => (
                                        <List.Item>
                                            <FilePdfOutlined style={{ marginRight: 8 }} />
                                            {item}
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Actualites;