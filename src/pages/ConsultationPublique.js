import React, { useState } from 'react';
import {
    Card,
    List,
    Button,
    Progress,
    Tag,
    Space,
    Input,
    Divider,
    Row,
    Col,
    Statistic,
    Alert,
    Tabs,
    Badge,
    Modal,
    Form,
    DatePicker,
    Select, InputNumber, Radio, Checkbox, Collapse
} from 'antd';
import {
    SearchOutlined,
    BarChartOutlined,
    CalendarOutlined,
    TeamOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import '../styles/ConsultationPublique.css';
import moment from "moment";
import Panel from "antd/es/splitter/Panel";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const QUESTION_TYPES = [
    { label: 'Choix unique', value: 'radio' },
    { label: 'Choix multiple', value: 'checkbox' },
    { label: 'Réponse texte', value: 'text' },
    { label: 'Échelle numérique', value: 'scale' }
];

const ConsultationPublique = () => {
    const [activeTab, setActiveTab] = useState('en_cours');
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
    const [form] = Form.useForm();

    // Données des consultations
    const [consultations, setConsultations] = useState([
        {
            id: 1,
            titre: "Aménagement urbain de Kinshasa",
            description: "Donnez votre avis sur le nouveau plan d'aménagement des espaces publics",
            dateFin: "2023-08-30",
            participation: 1245,
            objectif: 5000,
            themes: ["urbanisme", "transport"],
            statut: "en_cours"
        },
        {
            id: 2,
            titre: "Réforme du système éducatif",
            description: "Consultation nationale sur les nouveaux programmes scolaires",
            dateFin: "2023-07-15",
            participation: 3421,
            objectif: 10000,
            themes: ["éducation"],
            statut: "en_cours"
        },
        {
            id: 3,
            titre: "Projet de loi sur la santé publique",
            description: "Votez pour les priorités du nouveau système de santé",
            dateFin: "2023-05-20",
            participation: 8923,
            objectif: 8000,
            themes: ["santé"],
            statut: "termine"
        }
    ]);

    // Filtrage des données
    const filteredConsultations = consultations.filter(consult => {
        const matchesSearch = consult.titre.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'toutes' || consult.statut === activeTab;
        return matchesSearch && matchesTab;
    });

    const showModal = () => {
        setIsModalVisible(true);
        form.resetFields();
        setActiveQuestionIndex(null);
    };

    const handleAddQuestion = () => {
        form.validateFields(['questions']).then(values => {
            const newQuestion = {
                id: Date.now(),
                texte: values.questionText,
                type: values.questionType,
                options: values.questionOptions || [],
                required: values.questionRequired,
                ...(values.questionType === 'scale' && {
                    min: values.scaleMin,
                    max: values.scaleMax
                })
            };

            const currentQuestions = form.getFieldValue('questions') || [];
            const updatedQuestions = [...currentQuestions, newQuestion];
            form.setFieldsValue({ questions: updatedQuestions });

            // Reset question form
            form.resetFields(['questionText', 'questionType', 'questionOptions', 'scaleMin', 'scaleMax']);
        });
    };

    const handleEditQuestion = (index) => {
        const questions = form.getFieldValue('questions') || [];
        const question = questions[index];

        form.setFieldsValue({
            questionText: question.texte,
            questionType: question.type,
            questionOptions: question.options,
            questionRequired: question.required,
            scaleMin: question.min,
            scaleMax: question.max
        });

        setActiveQuestionIndex(index);
    };

    const handleRemoveQuestion = (index) => {
        const questions = form.getFieldValue('questions') || [];
        const updatedQuestions = questions.filter((_, i) => i !== index);
        form.setFieldsValue({ questions: updatedQuestions });
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newConsultation = {
                id: consultations.length + 1,
                titre: values.titre,
                description: values.description,
                dateFin: values.dateFin.format('YYYY-MM-DD'),
                participation: 0,
                objectif: values.objectif,
                themes: values.themes,
                statut: "en_cours",
                questions: values.questions || []
            };

            setConsultations([...consultations, newConsultation]);
            setIsModalVisible(false);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const renderQuestionInput = (type) => {
        switch (type) {
            case 'radio':
            case 'checkbox':
                return (
                    <Form.Item
                        name="questionOptions"
                        label="Options de réponse"
                        rules={[{ required: true, message: 'Veuillez ajouter au moins une option' }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Ajoutez des options (appuyez sur Entrée après chaque option)"
                            tokenSeparators={[',']}
                            open={false}
                        />
                    </Form.Item>
                );
            case 'scale':
                return (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="scaleMin"
                                label="Valeur minimale"
                                rules={[{ required: true, message: 'Veuillez spécifier' }]}
                            >
                                <InputNumber min={0} max={100} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="scaleMax"
                                label="Valeur maximale"
                                rules={[{ required: true, message: 'Veuillez spécifier' }]}
                            >
                                <InputNumber min={1} max={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                );
            default:
                return null;
        }
    };

    const renderQuestionPreview = (question) => {
        switch (question.type) {
            case 'radio':
                return (
                    <Radio.Group>
                        <Space direction="vertical">
                            {question.options.map((option, i) => (
                                <Radio key={i} value={option}>{option}</Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                );
            case 'checkbox':
                return (
                    <Checkbox.Group>
                        <Space direction="vertical">
                            {question.options.map((option, i) => (
                                <Checkbox key={i} value={option}>{option}</Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                );
            case 'text':
                return <Input.TextArea placeholder="Votre réponse..." />;
            case 'scale':
                return (
                    <InputNumber
                        min={question.min}
                        max={question.max}
                        style={{ width: '100%' }}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className="consultation-publique">
            <Card
                title={
                    <Space>
                        <Button
                            type="default"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => window.history.back()}
                            style={{ marginRight: 16 }}
                        >
                            Retour
                        </Button>
                        <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <span style={{ fontSize: '20px', fontWeight: '600' }}>Consultations Publiques</span>
                        <Badge
                            count={consultations.filter(c => c.statut === 'en_cours').length}
                            style={{ backgroundColor: '#52c41a' }}
                        />
                    </Space>
                }
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        style={{ fontWeight: '500' }}
                    >
                        Nouvelle Consultation
                    </Button>
                }
            >
                {/* En-tête */}
                <Alert
                    message="Plateforme de Participation Citoyenne"
                    description="Créez des consultations et recueillez l'avis de la population sur les projets gouvernementaux."
                    type="info"
                    showIcon
                    style={{
                        marginBottom: 24,
                        borderRadius: '8px',
                        backgroundColor: '#f0f9ff',
                        borderColor: '#91d5ff'
                    }}
                />

                {/* Barre de recherche et statistiques */}
                <div className="consultation-header">
                    <Row gutter={16} align="middle">
                        <Col xs={24} sm={16} md={12}>
                            <Search
                                placeholder="Rechercher une consultation..."
                                allowClear
                                enterButton={<Button type="primary"><SearchOutlined /></Button>}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                                style={{ borderRadius: '8px' }}
                            />
                        </Col>
                        <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }}>
                            <Space size="large">
                                <Statistic
                                    title="En cours"
                                    value={consultations.filter(c => c.statut === 'en_cours').length}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                                <Statistic
                                    title="Terminées"
                                    value={consultations.filter(c => c.statut === 'termine').length}
                                    prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
                                    valueStyle={{ color: '#fa8c16' }}
                                />
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* Onglets */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabBarStyle={{ marginBottom: 24 }}
                >
                    <TabPane
                        tab={<span><CalendarOutlined /> En cours</span>}
                        key="en_cours"
                    />
                    <TabPane
                        tab={<span><CheckCircleOutlined /> Terminées</span>}
                        key="termine"
                    />
                    <TabPane
                        tab={<span><FileTextOutlined /> Toutes</span>}
                        key="toutes"
                    />
                </Tabs>

                {/* Liste des consultations */}
                <List
                    itemLayout="vertical"
                    dataSource={filteredConsultations}
                    renderItem={item => (
                        <Card
                            className={`consultation-card ${item.statut}`}
                            title={<h3 style={{ margin: 0 }}>{item.titre}</h3>}
                            extra={
                                <Space>
                                    {item.statut === 'en_cours' ? (
                                        <Tag icon={<CalendarOutlined />} color="blue" style={{ padding: '4px 8px' }}>
                                            Clôture: {moment(item.dateFin).format('DD/MM/YYYY')}
                                        </Tag>
                                    ) : (
                                        <Tag color="gray" style={{ padding: '4px 8px' }}>Terminé</Tag>
                                    )}
                                    <Button
                                        type={item.statut === 'en_cours' ? 'primary' : 'default'}
                                        icon={<FileTextOutlined />}
                                        style={{ borderRadius: '6px' }}
                                    >
                                        {item.statut === 'en_cours' ? 'Participer' : 'Résultats'}
                                    </Button>
                                </Space>
                            }
                            style={{
                                marginBottom: 16,
                                borderRadius: '8px',
                                borderLeft: `4px solid ${item.statut === 'en_cours' ? '#1890ff' : '#d9d9d9'}`
                            }}
                        >
                            <div className="consultation-content">
                                <p style={{ color: '#666', marginBottom: 16 }}>{item.description}</p>

                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={12}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                            <span>Participants: <strong>{item.participation.toLocaleString()}</strong></span>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div>
                                            <span>Objectif: <strong>{item.objectif.toLocaleString()}</strong></span>
                                        </div>
                                    </Col>
                                </Row>

                                <Progress
                                    percent={Math.min(100, (item.participation / item.objectif) * 100)}
                                    status={item.statut === 'termine' ? 'success' : 'active'}
                                    strokeColor={item.statut === 'termine' ? '#52c41a' : '#1890ff'}
                                    style={{ marginBottom: 16 }}
                                />

                                <div>
                                    {item.themes.map(theme => (
                                        <Tag
                                            key={theme}
                                            color="blue"
                                            style={{ marginBottom: 4, borderRadius: '4px' }}
                                        >
                                            {theme}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                />
            </Card>

            {/* Modal pour créer une nouvelle consultation */}
            <Modal
                title={<span><PlusOutlined style={{ marginRight: 8 }} /> Nouvelle Consultation</span>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="Publier la consultation"
                cancelText="Annuler"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="titre"
                        label="Titre de la consultation"
                        rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
                    >
                        <Input placeholder="Ex: Aménagement du parc central" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Veuillez saisir une description' }]}
                    >
                        <TextArea rows={3} placeholder="Décrivez l'objet de la consultation..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="dateFin"
                                label="Date de clôture"
                                rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={current => current && current < moment().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="objectif"
                                label="Objectif de participants"
                                rules={[{ required: true, message: 'Veuillez saisir un objectif' }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 5000"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="themes"
                        label="Thèmes"
                        rules={[{ required: true, message: 'Veuillez sélectionner au moins un thème' }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Sélectionnez des thèmes"
                            style={{ width: '100%' }}
                        >
                            <Option value="urbanisme">Urbanisme</Option>
                            <Option value="transport">Transport</Option>
                            <Option value="éducation">Éducation</Option>
                            <Option value="santé">Santé</Option>
                            <Option value="environnement">Environnement</Option>
                            <Option value="économie">Économie</Option>
                        </Select>
                    </Form.Item>

                    <Divider orientation="left">Questions du sondage</Divider>

                    <Form.Item name="questions" hidden>
                        <Input />
                    </Form.Item>

                    <Card
                        title="Ajouter une question"
                        size="small"
                        style={{ marginBottom: 16 }}
                    >
                        <Form.Item
                            name="questionText"
                            label="Texte de la question"
                            rules={[{ required: true, message: 'Veuillez saisir la question' }]}
                        >
                            <Input placeholder="Quelle est votre question ?" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="questionType"
                                    label="Type de question"
                                    rules={[{ required: true, message: 'Veuillez sélectionner' }]}
                                >
                                    <Select placeholder="Sélectionnez un type">
                                        {QUESTION_TYPES.map(type => (
                                            <Option key={type.value} value={type.value}>{type.label}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="questionRequired"
                                    label=" "
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Checkbox>Réponse obligatoire</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        {form.getFieldValue('questionType') && renderQuestionInput(form.getFieldValue('questionType'))}

                        <Button
                            type="primary"
                            onClick={activeQuestionIndex !== null ?
                                () => {
                                    handleAddQuestion();
                                    setActiveQuestionIndex(null);
                                } :
                                handleAddQuestion
                            }
                            block
                            style={{ marginTop: 16 }}
                        >
                            {activeQuestionIndex !== null ? 'Mettre à jour la question' : 'Ajouter la question'}
                        </Button>
                    </Card>

                    <Collapse accordion style={{ marginBottom: 16 }}>
                        {(form.getFieldValue('questions') || []).map((question, index) => (
                            <Panel
                                key={question.id}
                                header={`Question ${index + 1}: ${question.texte}`}
                                extra={
                                    <Space>
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditQuestion(index);
                                            }}
                                        />
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveQuestion(index);
                                            }}
                                        />
                                    </Space>
                                }
                            >
                                <div style={{ marginTop: 16 }}>
                                    {renderQuestionPreview(question)}
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                </Form>
            </Modal>
        </div>
    );
};

export default ConsultationPublique;