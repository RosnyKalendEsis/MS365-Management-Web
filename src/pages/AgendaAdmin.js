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
    Image,
    Switch,
    Collapse,
    TimePicker,
    List,
    Avatar,
    Typography,
    Descriptions,
    Empty,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined,
    ArrowLeftOutlined,
    CalendarOutlined,
    TeamOutlined,
    UserOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined, FilePdfOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import '../styles/Agenda.css';
import Search from "antd/es/input/Search";
import {useAgendaEvent} from "../providers/AgendaEventProvider";
import {DeputyContext} from "../providers/DeputyProvider";
import {BureauContext} from "../providers/BureauProvider";
import {usePlenarySession} from "../providers/PlenarySessionProvider";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Text } = Typography;

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

// Types de séances plénières
const PLENARY_TYPES = [
    { value: 'ordinaire', label: 'Ordinaire', color: 'blue' },
    { value: 'extraordinaire', label: 'Extraordinaire', color: 'orange' },
    { value: 'budgetaire', label: 'Budgétaire', color: 'green' },
    { value: 'urgence', label: 'Urgence', color: 'red' }
];

// Statuts des séances plénières
const PLENARY_STATUS = [
    { value: 'planifiee', label: 'Planifiée', color: 'blue' },
    { value: 'encours', label: 'En cours', color: 'green' },
    { value: 'terminee', label: 'Terminée', color: 'gray' },
    { value: 'reportee', label: 'Reportée', color: 'orange' },
    { value: 'annulee', label: 'Annulée', color: 'red' }
];

// Commissions mockées
const COMMISSIONS = [
    { id: 1, name: 'Commission des Finances', color: 'blue' },
    { id: 2, name: 'Commission de l\'Éducation', color: 'green' },
    { id: 3, name: 'Commission de la Santé', color: 'orange' },
    { id: 4, name: 'Commission des Infrastructures', color: 'purple' },
    { id: 5, name: 'Commission de l\'Agriculture', color: 'cyan' }
];

// Types de réunions de commission
const COMMISSION_TYPES = [
    { value: 'ordinaire', label: 'Ordinaire', color: 'blue' },
    { value: 'extraordinaire', label: 'Extraordinaire', color: 'orange' },
    { value: 'audition', label: 'Audition', color: 'green' },
    { value: 'enquete', label: 'Enquête', color: 'purple' }
];


// Données mockées pour les réunions de commissions
const mockCommissionMeetings = [
    {
        id: 1,
        title: "Examen du budget provincial 2024",
        commissionId: 1,
        date: "2024-03-18",
        time: "14:00 - 16:30",
        type: "ordinaire",
        location: "Salle des Commissions - Bâtiment A",
        description: "Examen détaillé du projet de budget provincial pour l'année fiscale 2024 avec les responsables financiers.",
        ordreJour: [
            "Présentation du projet de budget",
            "Audition du Directeur Provincial des Finances",
            "Analyse par chapitre budgétaire",
            "Propositions d'amendements"
        ],
        documents: ["Projet de budget 2024", "Rapport financier 2023"],
        status: "planifiee",
        media: ["video"],
        featured: true
    },
    {
        id: 2,
        title: "Audition sur la réforme éducative",
        commissionId: 2,
        date: "2024-03-22",
        time: "10:00 - 12:00",
        type: "audition",
        location: "Salle des Commissions - Bâtiment B",
        description: "Audition des experts en éducation sur la réforme du système éducatif provincial.",
        ordreJour: [
            "Présentation de la réforme",
            "Témoignages d'experts",
            "Questions-réponses",
            "Synthèse et recommandations"
        ],
        documents: ["Projet de réforme éducative", "Études d'impact"],
        status: "planifiee",
        media: ["audio"],
        featured: false
    }
];

// Données mockées pour les demandes d'assistance
const mockAttendanceRequests = [
    {
        id: 1,
        name: "Marie Dubois",
        email: "marie.dubois@email.com",
        phone: "0123456789",
        organization: "Association des Enseignants",
        sessionType: "plenary",
        sessionId: 1,
        sessionTitle: "Session Ordinaire de Mars 2024",
        requestDate: "2024-03-10",
        description: "Je souhaite assister à la séance pour suivre les débats sur la loi minière qui impacte notre région.",
        status: "pending",
        priority: "normal"
    },
    {
        id: 2,
        name: "Jean Martin",
        email: "j.martin@entreprise.com",
        phone: "0987654321",
        organization: "Chambre de Commerce",
        sessionType: "commission",
        sessionId: 1,
        sessionTitle: "Examen du budget provincial 2024",
        requestDate: "2024-03-12",
        description: "En tant que représentant de la Chambre de Commerce, je souhaite assister à l'examen du budget pour comprendre les allocations aux entreprises.",
        status: "approved",
        priority: "high"
    },
    {
        id: 3,
        name: "Sophie Leroux",
        email: "sophie.leroux@ong.org",
        phone: "0555666777",
        organization: "ONG Environnement Plus",
        sessionType: "plenary",
        sessionId: 2,
        sessionTitle: "Session Extraordinaire Budget",
        requestDate: "2024-03-14",
        description: "Notre ONG souhaite s'assurer que les questions environnementales sont prises en compte dans le budget.",
        status: "rejected",
        priority: "normal"
    }
];

const AgendaAdmin = () => {
    moment.locale('fr');
    const { createEvent, events, onCreatingAgenda, deleteEvent } = useAgendaEvent();
    const { deputies } = useContext(DeputyContext);
    const { members } = useContext(BureauContext);
    const {createSession,sessions,deleteSession} = usePlenarySession();
    const [cover, setCover] = useState({});
    const [attachments, setAttachments] = useState([]);

    // États pour les événements
    const [agendaEvents, setAgendaEvents] = useState(events);

    // États pour les séances plénières
    const [plenarySessions, setPlenarySessions] = useState(sessions);
    const [isPlenaryModalVisible, setIsPlenaryModalVisible] = useState(false);
    const [currentPlenarySession, setCurrentPlenarySession] = useState(null);
    const [plenaryForm] = Form.useForm();

    // États pour les réunions de commissions
    const [commissionMeetings, setCommissionMeetings] = useState(mockCommissionMeetings);
    const [isCommissionModalVisible, setIsCommissionModalVisible] = useState(false);
    const [currentCommissionMeeting, setCurrentCommissionMeeting] = useState(null);
    const [commissionForm] = Form.useForm();

    // États pour les demandes d'assistance
    const [attendanceRequests, setAttendanceRequests] = useState(mockAttendanceRequests);
    const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    // États généraux
    const [activeMainTab, setActiveMainTab] = useState('events');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setAgendaEvents(events);
        setPlenarySessions(sessions);
    }, [events, sessions]);

    // Colonnes du tableau des événements (existant)
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

    // Colonnes pour les séances plénières
    const plenaryColumns = [
        {
            title: 'Séance',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Tag color={PLENARY_TYPES.find(t => t.value === record.type)?.color}>
                            {PLENARY_TYPES.find(t => t.value === record.type)?.label}
                        </Tag>
                        <strong>{text}</strong>
                        {record.featured && <Tag color="gold">À la une</Tag>}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <EnvironmentOutlined /> {record.location}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Date & Heure',
            key: 'datetime',
            render: (record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <CalendarOutlined /> {moment(record.date).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        <ClockCircleOutlined /> {record.time}
                    </div>
                </Space>
            ),
            sorter: (a, b) => moment(a.date).diff(moment(b.date))
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusInfo = PLENARY_STATUS.find(s => s.value === status);
                return <Badge color={statusInfo?.color} text={statusInfo?.label} />;
            },
            filters: PLENARY_STATUS.map(s => ({ text: s.label, value: s.value })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Points O.J.',
            dataIndex: 'points',
            key: 'points',
            render: (points) => (
                <Badge count={points?.length || 0} showZero color="blue" />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handlePlenaryPreview(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handlePlenaryEdit(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette séance ?"
                        onConfirm={() => handlePlenaryDelete(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Colonnes pour les réunions de commissions
    const commissionColumns = [
        {
            title: 'Réunion',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Tag color={COMMISSION_TYPES.find(t => t.value === record.type)?.color}>
                            {COMMISSION_TYPES.find(t => t.value === record.type)?.label}
                        </Tag>
                        <strong>{text}</strong>
                        {record.featured && <Tag color="gold">À la une</Tag>}
                    </div>
                    <div>
                        <Tag color={COMMISSIONS.find(c => c.id === record.commissionId)?.color}>
                            {COMMISSIONS.find(c => c.id === record.commissionId)?.name}
                        </Tag>
                    </div>
                </Space>
            )
        },
        {
            title: 'Date & Heure',
            key: 'datetime',
            render: (record) => (
                <Space direction="vertical" size="small">
                    <div>
                        <CalendarOutlined /> {moment(record.date).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        <ClockCircleOutlined /> {record.time}
                    </div>
                    <div>
                        <EnvironmentOutlined /> {record.location}
                    </div>
                </Space>
            ),
            sorter: (a, b) => moment(a.date).diff(moment(b.date))
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusInfo = PLENARY_STATUS.find(s => s.value === status);
                return <Badge color={statusInfo?.color} text={statusInfo?.label} />;
            }
        },
        {
            title: 'Média',
            dataIndex: 'media',
            key: 'media',
            render: (media) => (
                <Space>
                    {media?.includes('video') && <Tag color="red">Vidéo</Tag>}
                    {media?.includes('audio') && <Tag color="blue">Audio</Tag>}
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => handleCommissionPreview(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleCommissionEdit(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette réunion ?"
                        onConfirm={() => handleCommissionDelete(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Handlers pour les événements (existants)
    const handleAdd = () => {
        setCurrentEvent(null);
        setCover({})
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

    const handleDelete = async (id) => {
        await deleteEvent(id);
        message.success('Événement supprimé avec succès');
    };

    const handlePreview = (event) => {
        setCurrentEvent(event);
        setPreviewVisible(true);
    };

    const handleSubmit = async (values) => {
        const eventData = {
            ...values,
            dateRange: [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')],
            details: values.details || []
        };

        if (currentEvent) {
            setAgendaEvents(agendaEvents.map(e =>
                e.id === currentEvent.id ? {...e, ...eventData} : e
            ));
            message.success('Événement mis à jour avec succès');
        } else {
            delete eventData.imageUrl;
            await createEvent(eventData, cover.photoFile);
            message.success('Événement créé avec succès');
        }

        setIsModalVisible(false);
    };

    // Handlers pour les séances plénières
    const handlePlenaryAdd = () => {
        setCurrentPlenarySession(null);
        plenaryForm.resetFields();
        setIsPlenaryModalVisible(true);
    };

    const handlePlenaryEdit = (session) => {
        setCurrentPlenarySession(session);
        plenaryForm.setFieldsValue({
            ...session,
            date: moment(session.date),
            timeRange: [
                moment(session.time.split(' - ')[0], 'HH:mm'),
                moment(session.time.split(' - ')[1], 'HH:mm')
            ]
        });
        setIsPlenaryModalVisible(true);
    };

    const handlePlenaryDelete = async (id) => {
        await deleteSession(id);
        message.success('Séance plénière supprimée avec succès');
    };

    const handlePlenaryPreview = (session) => {
        setCurrentPlenarySession(session);
        setPreviewVisible(true);
    };

    const handlePlenarySubmit = async (values) => {
        const sessionData = {
            ...values,
            id: currentPlenarySession ? currentPlenarySession.id : Date.now(),
            date: values.date.format('YYYY-MM-DD'),
            time: `${values.timeRange[0].format('HH:mm')} - ${values.timeRange[1].format('HH:mm')}`
        };

        if (currentPlenarySession) {
            setPlenarySessions(plenarySessions.map(s =>
                s.id === currentPlenarySession.id ? sessionData : s
            ));
            message.success('Séance plénière mise à jour avec succès');
        } else {
            //setPlenarySessions([...plenarySessions, sessionData]);
            console.log("session pleniere: ", sessionData);
            await createSession(sessionData, attachments);
            message.success('Séance plénière créée avec succès');
        }

        setIsPlenaryModalVisible(false);
    };

    // Handlers pour les réunions de commissions
    const handleCommissionAdd = () => {
        setCurrentCommissionMeeting(null);
        commissionForm.resetFields();
        setIsCommissionModalVisible(true);
    };

    const handleCommissionEdit = (meeting) => {
        setCurrentCommissionMeeting(meeting);
        commissionForm.setFieldsValue({
            ...meeting,
            date: moment(meeting.date),
            timeRange: [
                moment(meeting.time.split(' - ')[0], 'HH:mm'),
                moment(meeting.time.split(' - ')[1], 'HH:mm')
            ]
        });
        setIsCommissionModalVisible(true);
    };

    const handleCommissionDelete = (id) => {
        setCommissionMeetings(commissionMeetings.filter(m => m.id !== id));
        message.success('Réunion de commission supprimée avec succès');
    };

    const handleCommissionPreview = (meeting) => {
        setCurrentCommissionMeeting(meeting);
        setPreviewVisible(true);
    };

    const handleCommissionSubmit = (values) => {
        const meetingData = {
            ...values,
            id: currentCommissionMeeting ? currentCommissionMeeting.id : Date.now(),
            date: values.date.format('YYYY-MM-DD'),
            time: `${values.timeRange[0].format('HH:mm')} - ${values.timeRange[1].format('HH:mm')}`
        };

        if (currentCommissionMeeting) {
            setCommissionMeetings(commissionMeetings.map(m =>
                m.id === currentCommissionMeeting.id ? meetingData : m
            ));
            message.success('Réunion de commission mise à jour avec succès');
        } else {
            setCommissionMeetings([...commissionMeetings, meetingData]);
            message.success('Réunion de commission créée avec succès');
        }

        setIsCommissionModalVisible(false);
    };

    // Handlers pour les demandes d'assistance
    const handleRequestView = (request) => {
        setCurrentRequest(request);
        setIsRequestModalVisible(true);
    };

    const handleRequestStatusChange = (requestId, newStatus) => {
        setAttendanceRequests(attendanceRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req
        ));

        const statusText = newStatus === 'approved' ? 'approuvée' :
            newStatus === 'rejected' ? 'rejetée' : 'mise en attente';
        message.success(`Demande ${statusText} avec succès`);
    };

    const filteredEvents = agendaEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase()) ||
            event.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesTab = activeTab === 'all' || event.status === activeTab;
        const matchDate = !dateRange || (
            moment(event.dateRange[0]).isSameOrBefore(dateRange[1], 'day') &&
            moment(event.dateRange[1]).isSameOrAfter(dateRange[0], 'day')
        );
        return matchesSearch && matchesTab && matchDate;
    });

    const getRequestStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'processing';
            default: return 'default';
        }
    };

    const getRequestStatusText = (status) => {
        switch (status) {
            case 'approved': return 'Approuvée';
            case 'rejected': return 'Rejetée';
            case 'pending': return 'En attente';
            default: return 'Inconnue';
        }
    };

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
                title="Administration des Travaux Parlementaires"
                bordered={false}
            >
                <Tabs activeKey={activeMainTab} onChange={setActiveMainTab} type="card">
                    {/* Onglet Événements généraux */}
                    <TabPane
                        tab={
                            <span>
                                <CalendarOutlined />
                                Événements
                                <Badge count={agendaEvents.length} offset={[10, 0]} />
                            </span>
                        }
                        key="events"
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Ajouter un Événement
                            </Button>
                        </div>

                        {/* Barre de filtres */}
                        <div className="filters-bar" style={{ marginBottom: 16 }}>
                            <Space size="large">
                                <Search
                                    placeholder="Rechercher..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    style={{ width: 300 }}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                                <RangePicker
                                    onChange={(dates) => setDateRange(dates)}
                                    value={dateRange}
                                />
                                <Button icon={<FilterOutlined />}>Filtres Avancés</Button>
                            </Space>
                        </div>

                        {/* Onglets de statut */}
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
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

                        <Table
                            columns={columns}
                            dataSource={filteredEvents}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </TabPane>

                    {/* Onglet Séances plénières */}
                    <TabPane
                        tab={
                            <span>
                                <TeamOutlined />
                                Séances Plénières
                                <Badge count={plenarySessions.length} offset={[10, 0]} />
                            </span>
                        }
                        key="plenary"
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handlePlenaryAdd}>
                                Ajouter une Séance Plénière
                            </Button>
                        </div>

                        <Table
                            columns={plenaryColumns}
                            dataSource={plenarySessions}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </TabPane>

                    {/* Onglet Réunions de commissions */}
                    <TabPane
                        tab={
                            <span>
                                <UserOutlined />
                                Commissions
                                <Badge count={commissionMeetings.length} offset={[10, 0]} />
                            </span>
                        }
                        key="commissions"
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleCommissionAdd}>
                                Ajouter une Réunion de Commission
                            </Button>
                        </div>

                        <Table
                            columns={commissionColumns}
                            dataSource={commissionMeetings}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </TabPane>

                    {/* Onglet Demandes d'assistance */}
                    <TabPane
                        tab={
                            <span>
                                <FileTextOutlined />
                                Demandes d'Assistance
                                <Badge
                                    count={attendanceRequests.filter(r => r.status === 'pending').length}
                                    offset={[10, 0]}
                                />
                            </span>
                        }
                        key="requests"
                    >
                        {attendanceRequests.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                dataSource={attendanceRequests}
                                pagination={{ pageSize: 5 }}
                                renderItem={request => (
                                    <List.Item
                                        key={request.id}
                                        actions={[
                                            <Button
                                                key="view"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleRequestView(request)}
                                            >
                                                Voir
                                            </Button>,
                                            request.status === 'pending' && (
                                                <Button
                                                    key="approve"
                                                    type="primary"
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() => handleRequestStatusChange(request.id, 'approved')}
                                                >
                                                    Approuver
                                                </Button>
                                            ),
                                            request.status === 'pending' && (
                                                <Button
                                                    key="reject"
                                                    danger
                                                    icon={<ExclamationCircleOutlined />}
                                                    onClick={() => handleRequestStatusChange(request.id, 'rejected')}
                                                >
                                                    Rejeter
                                                </Button>
                                            )
                                        ].filter(Boolean)}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={
                                                <Space>
                                                    <Text strong>{request.name}</Text>
                                                    <Badge
                                                        status={getRequestStatusColor(request.status)}
                                                        text={getRequestStatusText(request.status)}
                                                    />
                                                    {request.priority === 'high' && (
                                                        <Tag color="red">Priorité élevée</Tag>
                                                    )}
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size="small">
                                                    <Text type="secondary">{request.email} • {request.phone}</Text>
                                                    <Text type="secondary">{request.organization}</Text>
                                                    <Text>
                                                        <CalendarOutlined /> {request.sessionTitle}
                                                    </Text>
                                                    <Text type="secondary">
                                                        Demande du {moment(request.requestDate).format('DD/MM/YYYY')}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                        <Text ellipsis>{request.description}</Text>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty
                                description="Aucune demande d'assistance"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )}
                    </TabPane>
                </Tabs>
            </Card>

            {/* Modal d'édition/création d'événements (existant) */}
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
                                    placeholder="Ajoutez les participants"
                                    mode="tags"
                                    tokenSeparators={[',']}
                                >
                                    {deputies.map(deputy => {
                                        const matchingMember = members.find(
                                            m => m.membre.id === deputy.id
                                        );

                                        const label = matchingMember
                                            ? `${deputy.nom} (${matchingMember.role.name})`
                                            : `${deputy.nom} (${deputy.commission})`;

                                        return (
                                            <Option key={deputy.id} value={label}>
                                                {label}
                                            </Option>
                                        );
                                    })}
                                </Select>
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
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={onCreatingAgenda}
                                disabled={onCreatingAgenda}
                            >
                                {currentEvent ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour les séances plénières */}
            <Modal
                title={currentPlenarySession ? "Modifier la séance plénière" : "Ajouter une séance plénière"}
                visible={isPlenaryModalVisible}
                onCancel={() => {
                    setIsPlenaryModalVisible(false);
                    plenaryForm.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={plenaryForm}
                    layout="vertical"
                    onFinish={handlePlenarySubmit}
                    initialValues={{
                        status: 'planifiee',
                        featured: false,
                        type: 'ordinaire'
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type de séance"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un type">
                                    {PLENARY_TYPES.map(type => (
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
                                    {PLENARY_STATUS.map(status => (
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
                                label="Titre de la séance"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Session Ordinaire de Mars 2024" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="timeRange"
                                label="Horaires"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TimePicker.RangePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                    placeholder={['Début', 'Fin']}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="location"
                                label="Lieu"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Hémicycle Principal" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={3} placeholder="Description de la séance" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="featured"
                                label="À la une"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Oui"
                                    unCheckedChildren="Non"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Divider orientation="left">Points à l'ordre du jour</Divider>
                            <Form.List name="points">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={name}
                                                    rules={[{ required: true, message: 'Point obligatoire' }]}
                                                >
                                                    <Input placeholder="Point à l'ordre du jour" style={{ width: 400 }} />
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
                                                Ajouter un point
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="documents"
                                label="Documents associés"
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
                            <Button onClick={() => setIsPlenaryModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentPlenarySession ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour les réunions de commissions */}
            <Modal
                title={currentCommissionMeeting ? "Modifier la réunion de commission" : "Ajouter une réunion de commission"}
                visible={isCommissionModalVisible}
                onCancel={() => {
                    setIsCommissionModalVisible(false);
                    commissionForm.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={commissionForm}
                    layout="vertical"
                    onFinish={handleCommissionSubmit}
                    initialValues={{
                        status: 'planifiee',
                        featured: false,
                        type: 'ordinaire',
                        media: []
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="commissionId"
                                label="Commission"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez une commission">
                                    {COMMISSIONS.map(commission => (
                                        <Option key={commission.id} value={commission.id}>
                                            <Tag color={commission.color}>{commission.name}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type de réunion"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un type">
                                    {COMMISSION_TYPES.map(type => (
                                        <Option key={type.value} value={type.value}>
                                            <Tag color={type.color}>{type.label}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Titre de la réunion"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Examen du budget provincial 2024" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="timeRange"
                                label="Horaires"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TimePicker.RangePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                    placeholder={['Début', 'Fin']}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="location"
                                label="Lieu"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Input placeholder="Ex: Salle des Commissions - Bâtiment A" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <TextArea rows={3} placeholder="Description de la réunion" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Statut"
                                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                            >
                                <Select placeholder="Sélectionnez un statut">
                                    {PLENARY_STATUS.map(status => (
                                        <Option key={status.value} value={status.value}>
                                            <Badge color={status.color} text={status.label} />
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="media"
                                label="Support média"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Sélectionnez les médias"
                                    options={[
                                        { value: 'video', label: 'Vidéo' },
                                        { value: 'audio', label: 'Audio' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="featured"
                                label="À la une"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Oui"
                                    unCheckedChildren="Non"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Divider orientation="left">Ordre du jour</Divider>
                            <Form.List name="ordreJour">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={name}
                                                    rules={[{ required: true, message: 'Point obligatoire' }]}
                                                >
                                                    <Input placeholder="Point à l'ordre du jour" style={{ width: 400 }} />
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
                                                Ajouter un point
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="documents"
                                label="Documents associés"
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Ajoutez les documents"
                                    tokenSeparators={[',']}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsCommissionModalVisible(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {currentCommissionMeeting ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de visualisation des demandes d'assistance */}
            <Modal
                title="Détails de la demande d'assistance"
                visible={isRequestModalVisible}
                onCancel={() => setIsRequestModalVisible(false)}
                footer={
                    currentRequest && currentRequest.status === 'pending' ? (
                        <Space>
                            <Button onClick={() => setIsRequestModalVisible(false)}>
                                Fermer
                            </Button>
                            <Button
                                danger
                                icon={<ExclamationCircleOutlined />}
                                onClick={() => {
                                    handleRequestStatusChange(currentRequest.id, 'rejected');
                                    setIsRequestModalVisible(false);
                                }}
                            >
                                Rejeter
                            </Button>
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => {
                                    handleRequestStatusChange(currentRequest.id, 'approved');
                                    setIsRequestModalVisible(false);
                                }}
                            >
                                Approuver
                            </Button>
                        </Space>
                    ) : (
                        <Button onClick={() => setIsRequestModalVisible(false)}>
                            Fermer
                        </Button>
                    )
                }
                width={600}
            >
                {currentRequest && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Statut">
                            <Badge
                                status={getRequestStatusColor(currentRequest.status)}
                                text={getRequestStatusText(currentRequest.status)}
                            />
                            {currentRequest.priority === 'high' && (
                                <Tag color="red" style={{ marginLeft: 8 }}>Priorité élevée</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Demandeur">
                            {currentRequest.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {currentRequest.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Téléphone">
                            {currentRequest.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Organisation">
                            {currentRequest.organization}
                        </Descriptions.Item>
                        <Descriptions.Item label="Séance concernée">
                            <Tag color="blue">{currentRequest.sessionTitle}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date de demande">
                            {moment(currentRequest.requestDate).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {currentRequest.description}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Modal de prévisualisation (modifiée pour supporter tous les types) */}
            <Modal
                title={
                    currentEvent?.title ||
                    currentPlenarySession?.title ||
                    currentCommissionMeeting?.title
                }
                visible={previewVisible}
                onCancel={() => {
                    setPreviewVisible(false);
                    setCurrentEvent(null);
                    setCurrentPlenarySession(null);
                    setCurrentCommissionMeeting(null);
                }}
                footer={null}
                width={800}
            >
                {/* Prévisualisation pour les événements */}
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

                {/* Prévisualisation pour les séances plénières */}
                {currentPlenarySession && (
                    <div className="plenary-preview">
                        <div className="session-header">
                            <Tag color={PLENARY_TYPES.find(t => t.value === currentPlenarySession.type)?.color}>
                                {PLENARY_TYPES.find(t => t.value === currentPlenarySession.type)?.label}
                            </Tag>
                            {currentPlenarySession.featured && <Tag color="gold">À la une</Tag>}
                            <Badge
                                status={PLENARY_STATUS.find(s => s.value === currentPlenarySession.status)?.color}
                                text={PLENARY_STATUS.find(s => s.value === currentPlenarySession.status)?.label}
                            />
                        </div>

                        <Descriptions column={2} style={{ marginTop: 16 }}>
                            <Descriptions.Item label="Date">
                                {moment(currentPlenarySession.date).format('dddd D MMMM YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Horaires">
                                {currentPlenarySession.time}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lieu" span={2}>
                                {currentPlenarySession.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {currentPlenarySession.description}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Points à l'ordre du jour</Divider>
                        <List
                            dataSource={currentPlenarySession.points}
                            renderItem={(point, index) => (
                                <List.Item>
                                    <Text strong>{index + 1}. </Text>{point}
                                </List.Item>
                            )}
                        />

                        {currentPlenarySession.documents && (
                            <>
                                <Divider orientation="left">Documents</Divider>
                                <List
                                    dataSource={currentPlenarySession.documents}
                                    renderItem={(document) => (
                                        <List.Item>
                                            <FileTextOutlined style={{ marginRight: 8 }} />
                                            {document.split('/').pop()}
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </div>
                )}

                {/* Prévisualisation pour les réunions de commissions */}
                {currentCommissionMeeting && (
                    <div className="commission-preview">
                        <div className="meeting-header">
                            <Tag color={COMMISSIONS.find(c => c.id === currentCommissionMeeting.commissionId)?.color}>
                                {COMMISSIONS.find(c => c.id === currentCommissionMeeting.commissionId)?.name}
                            </Tag>
                            <Tag color={COMMISSION_TYPES.find(t => t.value === currentCommissionMeeting.type)?.color}>
                                {COMMISSION_TYPES.find(t => t.value === currentCommissionMeeting.type)?.label}
                            </Tag>
                            {currentCommissionMeeting.featured && <Tag color="gold">À la une</Tag>}
                            <Badge
                                status={PLENARY_STATUS.find(s => s.value === currentCommissionMeeting.status)?.color}
                                text={PLENARY_STATUS.find(s => s.value === currentCommissionMeeting.status)?.label}
                            />
                        </div>

                        <Descriptions column={2} style={{ marginTop: 16 }}>
                            <Descriptions.Item label="Date">
                                {moment(currentCommissionMeeting.date).format('dddd D MMMM YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Horaires">
                                {currentCommissionMeeting.time}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lieu" span={2}>
                                {currentCommissionMeeting.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {currentCommissionMeeting.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Support média">
                                <Space>
                                    {currentCommissionMeeting.media?.includes('video') && <Tag color="red">Vidéo</Tag>}
                                    {currentCommissionMeeting.media?.includes('audio') && <Tag color="blue">Audio</Tag>}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Ordre du jour</Divider>
                        <List
                            dataSource={currentCommissionMeeting.ordreJour}
                            renderItem={(point, index) => (
                                <List.Item>
                                    <Text strong>{index + 1}. </Text>{point}
                                </List.Item>
                            )}
                        />

                        {currentCommissionMeeting.documents && (
                            <>
                                <Divider orientation="left">Documents</Divider>
                                <List
                                    dataSource={currentCommissionMeeting.documents}
                                    renderItem={(document) => (
                                        <List.Item>
                                            <FileTextOutlined style={{ marginRight: 8 }} />
                                            {document}
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

export default AgendaAdmin;