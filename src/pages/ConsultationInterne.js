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
    Divider,
    Row,
    Col,
    Tabs,
    Badge,
    Statistic,
    Steps,
    Progress,
    Upload,
    Collapse,
    Radio,
    Checkbox,
    InputNumber
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BarChartOutlined,
    LockOutlined,
    TeamOutlined,
    FilePdfOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import '../styles/ConsultationInterne.css';
import moment from "moment";
import Search from "antd/es/input/Search";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Step } = Steps;
const { Panel } = Collapse;

const QUESTION_TYPES = [
    { label: 'Choix unique', value: 'radio' },
    { label: 'Choix multiple', value: 'checkbox' },
    { label: 'Réponse texte', value: 'text' },
    { label: 'Échelle numérique', value: 'scale' }
];

const ConsultationInterne = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentConsultation, setCurrentConsultation] = useState(null);
    const [activeTab, setActiveTab] = useState('actives');
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();

    // Données des consultations internes
    const [consultations, setConsultations] = useState([
        {
            id: 1,
            titre: "Réforme constitutionnelle - Avis des députés",
            description: "Consultation interne sur les amendements proposés",
            dateFin: "2023-08-15",
            participants: 78,
            totalDeputes: 120,
            statut: "active",
            confidentialite: "haute",
            documents: ["projet_reforme.pdf"]
        },
        {
            id: 2,
            titre: "Budget 2024 - Priorités sectorielles",
            description: "Vote des députés sur l'allocation budgétaire",
            dateFin: "2023-07-30",
            participants: 92,
            totalDeputes: 120,
            statut: "active",
            confidentialite: "moyenne",
            documents: ["budget_2024_draft.xlsx"]
        },
        {
            id: 3,
            titre: "Règlement intérieur - Amendements",
            description: "Validation des modifications du règlement intérieur",
            dateFin: "2023-06-10",
            participants: 110,
            totalDeputes: 120,
            statut: "terminee",
            confidentialite: "standard",
            documents: []
        }
    ]);

    // Options
    const niveauxConfidentialite = [
        { value: 'standard', label: 'Standard', color: 'blue' },
        { value: 'moyenne', label: 'Moyenne', color: 'orange' },
        { value: 'haute', label: 'Haute', color: 'red' }
    ];

    // Colonnes du tableau
    const columns = [
        {
            title: 'Consultation',
            dataIndex: 'titre',
            key: 'titre',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <strong>{text}</strong>
                    <span style={{ fontSize: 12, color: '#666' }}>{record.description}</span>
                </Space>
            )
        },
        {
            title: 'Participation',
            dataIndex: 'participants',
            key: 'participants',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.participants / record.totalDeputes) * 100)}
                    status={record.statut === 'terminee' ? 'success' : 'active'}
                    format={() => `${record.participants}/${record.totalDeputes}`}
                    width={80}
                />
            )
        },
        {
            title: 'Confidentialité',
            dataIndex: 'confidentialite',
            key: 'confidentialite',
            render: (conf) => {
                const niveau = niveauxConfidentialite.find(n => n.value === conf);
                return (
                    <Tag icon={<LockOutlined />} color={niveau.color}>
                        {niveau.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => (
                <Badge
                    status={statut === 'active' ? 'processing' : 'success'}
                    text={statut === 'active' ? 'En cours' : 'Terminée'}
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<BarChartOutlined />}
                        onClick={() => message.info(`Ouverture de la consultation ${record.id}`)}
                    >
                        {record.statut === 'active' ? 'Participer' : 'Résultats'}
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => editConsultation(record)}
                    />
                    <Popconfirm
                        title="Supprimer cette consultation ?"
                        onConfirm={() => deleteConsultation(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const handleAddQuestion = () => {
        form.validateFields(['questionText', 'questionType']).then(values => {
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

            form.resetFields(['questionText', 'questionType', 'questionOptions', 'scaleMin', 'scaleMax']);
            setActiveQuestionIndex(null);
        });
    }; const handleEditQuestion = (index) => {
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

    const renderQuestionInput = (type) => {
        switch (type) {
            case 'radio':
            case 'checkbox':
                return (
                    <Form.Item
                        name="questionOptions"
                        label="Options de réponse"
                        rules={[{ required: true, message: 'Veuillez ajouter des options' }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Ajoutez des options (Entrée pour valider)"
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
                                label="Minimum"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="scaleMax"
                                label="Maximum"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={1} max={100} style={{ width: '100%' }} />
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
    // Fonctions utilitaires
    const editConsultation = (consult) => {
        setCurrentConsultation(consult);
        form.setFieldsValue({
            ...consult,
            dateFin: consult.dateFin ? moment(consult.dateFin) : null,
            questions: consult.questions || []
        });
        setIsModalVisible(true);
        setCurrentStep(0);
    };

    const deleteConsultation = (id) => {
        setConsultations(consultations.filter(cons => cons.id !== id));
        message.success('Consultation supprimée');
    };
    const filteredConsultations = consultations.filter(cons => {
        const matchesSearch = cons.titre.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'toutes' ||
            (activeTab === 'actives' && cons.statut === 'active') ||
            (activeTab === 'terminees' && cons.statut === 'terminee');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="consultation-interne">
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
                        <TeamOutlined />
                        <span>Consultations Internes</span>
                        <Badge
                            count={consultations.filter(c => c.statut === 'active').length}
                            style={{ backgroundColor: '#52c41a' }}
                        />
                    </Space>
                }
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCurrentConsultation(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Nouvelle Consultation
                    </Button>
                }
            >
                {/* Barre de recherche */}
                <div className="consultation-toolbar">
                    <Row gutter={16} align="middle">
                        <Col xs={24} md={12}>
                            <Search
                                placeholder="Rechercher une consultation..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                            <Statistic
                                title="Députés actifs"
                                value={120}
                                suffix="/ 500"
                            />
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* Onglets */}
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Actives" key="actives" />
                    <TabPane tab="Terminées" key="terminees" />
                    <TabPane tab="Toutes" key="toutes" />
                </Tabs>

                {/* Tableau des consultations */}
                <Table
                    columns={columns}
                    dataSource={filteredConsultations}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Modal d'édition/création */}
            <Modal
                title={currentConsultation ? 'Modifier la consultation' : 'Créer une consultation interne'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setCurrentConsultation(null);
                    setCurrentStep(0);
                }}
                footer={null}
                width={800}
            >
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    <Step title="Configuration" />
                    <Step title="Questions" />
                    <Step title="Participants" />
                </Steps>

                {currentStep === 0 && (
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="titre"
                                    label="Titre de la consultation"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Sujet de la consultation..." />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={3} placeholder="Objectifs et instructions..." />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="dateFin"
                                    label="Date de fin"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="confidentialite"
                                    label="Niveau de confidentialité"
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        {niveauxConfidentialite.map(niveau => (
                                            <Option key={niveau.value} value={niveau.value}>
                                                <Tag color={niveau.color}>{niveau.label}</Tag>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="documents"
                                    label="Documents de référence"
                                >
                                    <Upload>
                                        <Button icon={<FilePdfOutlined />}>Ajouter des documents</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={() => setCurrentStep(1)}
                            >
                                Suivant: Questions
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {currentStep === 1 && (
                    <div>
                        <Form form={form} layout="vertical">
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
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Quelle est votre question ?" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="questionType"
                                            label="Type de question"
                                            rules={[{ required: true }]}
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
                                    {activeQuestionIndex !== null ? 'Mettre à jour' : 'Ajouter la question'}
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
                                            <div style={{ marginTop: 8 }}>
                                                <Tag>{question.required ? 'Obligatoire' : 'Optionnel'}</Tag>
                                            </div>
                                        </div>
                                    </Panel>
                                ))}
                            </Collapse>
                        </Form>

                        <Divider />

                        <Row justify="space-between">
                            <Col>
                                <Button onClick={() => setCurrentStep(0)}>
                                    Précédent
                                </Button>
                            </Col>
                            <Col>
                                <Space>
                                    <Button onClick={() => setCurrentStep(2)}>
                                        Passer: Participants
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!form.getFieldValue('questions')?.length}
                                    >
                                        Suivant: Participants
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h3>Participants</h3>
                        <p>Configuration des participants à venir...</p>

                        <Divider />

                        <Row justify="space-between">
                            <Col>
                                <Button onClick={() => setCurrentStep(1)}>
                                    Précédent
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => form.submit()}
                                >
                                    {currentConsultation ? 'Mettre à jour' : 'Créer la consultation'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ConsultationInterne;