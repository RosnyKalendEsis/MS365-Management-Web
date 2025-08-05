import React, {useState} from 'react';
import {
    Table, Button, Input, Space, Tag, Avatar, Card, Row, Col, Popconfirm,
    message, Select, Badge, Descriptions, Tabs,
    Modal, List, Timeline,Tooltip
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SyncOutlined,
    UserOutlined,
    InfoCircleOutlined,
    SendOutlined,
    CloseOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import '../styles/Deputes.css';
import { Form } from 'antd';
import {useUserContext} from "../providers/UserProvider";
import UserStats from "../components/UserStats";


const { Search } = Input;
const { TabPane } = Tabs;

const Users = () => {
    // États
    const [, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [, setActiveTab] = useState('1');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const {createUser, users,deleteUser} = useUserContext();
    const [newUser, setNewUser] = useState({
        displayName: '',
        userPrincipalName: '',
        jobTitle: '',
        department: '',
        officeLocation: '',
        phoneNumber: '',
        status: 'ACTIVE',
        type: 'USER_SIMPLE',
        password: '',
        role: '',
    });

    // Historique des modifications
    const historyData = [
        { id: 1, date: '2023-06-15 10:30', action: 'Modification', champ: 'Commission', ancien: 'Santé', nouveau: 'Budget' },
        { id: 2, date: '2023-05-20 14:15', action: 'Ajout', champ: 'Député', nouveau: 'Jean Kabila' },
    ];

    // Sélection des lignes
    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handlePublish = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Veuillez sélectionner au moins un député');
            return;
        }

        try {
            message.success(`${selectedRowKeys.length} député(s) publié(s) avec succès`);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error("Erreur lors de la publication des députés");
        }
    };

    const handleUnpublish = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Veuillez sélectionner au moins un député');
            return;
        }

        try {
            message.success(`${selectedRowKeys.length} député(s) retiré(s) de la publication`);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error("Erreur lors du retrait de publication des députés");
        }
    };

    function showUserDetails(record) {
        setSelectedUser(record);
        setIsModalVisible(true);
    }

    function editUser(record) {
        console.log("Modification de l'utilisateur :", record);
    }

    // const [users, setUsers] = useState([
    //     {
    //         id: "1",
    //         displayName: "Jean Dupont",
    //         userPrincipalName: "j.dupont@entreprise.com",
    //         jobTitle: "Développeur",
    //         department: "Informatique",
    //         officeLocation: "Paris",
    //         phoneNumber: "+33 6 12 34 56 78",
    //         isLicensed: true,
    //         isLicenseExpired: false,
    //         createdDate: "2025-08-01T10:30:00Z",
    //         status: "ACTIVE",
    //         manager: {
    //             displayName: "Sophie Martin",
    //             userPrincipalName: "s.martin@entreprise.com"
    //         },
    //         licenses: []
    //     },
    //     {
    //         id: "2",
    //         displayName: "Alice Durand",
    //         userPrincipalName: "a.durand@entreprise.com",
    //         jobTitle: "Chef de projet",
    //         department: "Gestion de projet",
    //         officeLocation: "Lyon",
    //         phoneNumber: "+33 6 98 76 54 32",
    //         isLicensed: true,
    //         isLicenseExpired: false,
    //         createdDate: "2025-07-20T09:00:00Z",
    //         status: "ACTIVE",
    //         manager: null,
    //         licenses: []
    //     },
    //     {
    //         id: "3",
    //         displayName: "Marc Lemoine",
    //         userPrincipalName: "m.lemoine@entreprise.com",
    //         jobTitle: null,
    //         department: null,
    //         officeLocation: null,
    //         phoneNumber: null,
    //         isLicensed: false,
    //         isLicenseExpired: true,
    //         createdDate: "2025-06-15T14:45:00Z",
    //         status: "INACTIVE",
    //         manager: {
    //             displayName: "Jean Dupont",
    //             userPrincipalName: "j.dupont@entreprise.com"
    //         },
    //         licenses: []
    //     }
    // ]);




    // Colonnes du tableau
    const columns = [
        {
            title: 'Utilisateur',
            dataIndex: 'displayName',
            key: 'displayName',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#1a3a8f', color: '#fff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.userPrincipalName}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Titre du poste',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text) => text || <i style={{ color: '#aaa' }}>Non renseigné</i>
        },
        {
            title: 'Département',
            dataIndex: 'department',
            key: 'department',
            render: (text) => text || <i style={{ color: '#aaa' }}>Non renseigné</i>
        },
        {
            title: 'Téléphone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text) => text || <i style={{ color: '#aaa' }}>Non renseigné</i>
        },
        {
            title: 'Bureau',
            dataIndex: 'officeLocation',
            key: 'officeLocation',
            render: (text) => text || <i style={{ color: '#aaa' }}>Non renseigné</i>
        },
        {
            title: 'Date de création',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (date) => date ? new Date(date).toLocaleString() : '-'
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'}>
                    {status || 'Inconnu'}
                </Tag>
            )
        },
        {
            title: 'Manager',
            key: 'manager',
            render: (_, record) =>
                record.manager?.displayName
                    ? `${record.manager.displayName} (${record.manager.userPrincipalName})`
                    : <i style={{ color: '#aaa' }}>Aucun</i>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Détails utilisateur">
                        <Button
                            type="link"
                            icon={<InfoCircleOutlined />}
                            onClick={() => showUserDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Modifier l'utilisateur">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => editUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer l'utilisateur">
                        <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                            onConfirm={() => deleteUser(record.id)}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button disabled={record.role === 'SUPER_ADMIN'} type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];




    // Statistiques
    const now = new Date();

    const stats = {
        total: users.length,
        actifs: users.filter(user => user.status === 'ACTIVE').length,
        departments: new Set(users.map(u => u.department).filter(Boolean)).size,
        recent: users.filter(user => {
            const created = new Date(user.createdDate);
            const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
            return diffInDays <= 30; // créés il y a moins de 30 jours
        }).length
    };


    return (
        <div className="deputes-page">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>
            <Card
                title="Gestion des Utilisateur"
                bordered={false}
            >
                {/* Barre d'outils */}
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Search
                                placeholder="Rechercher un utilisateur..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} lg={18} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={() => {
                                        setSearchText('');
                                    }}
                                >
                                    Réinitialiser
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Ajouter un utilisateur
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Actions groupées */}
                {selectedRowKeys.length > 0 && (
                    <div className="batch-actions" style={{ marginBottom: 16 }}>
                        <Space>
                            <span>{selectedRowKeys.length} député(s) sélectionné(s)</span>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handlePublish}
                            >
                                Publier
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={handleUnpublish}
                            >
                                Retirer
                            </Button>
                        </Space>
                    </div>
                )}


                {/* Statistiques */}
                <UserStats stats={stats} />

                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    bordered
                    size="middle"
                    rowSelection={rowSelection}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `${total} utilisateurs`,
                    }}
                    className="deputes-table"
                />
            </Card>

            {/* Modal de détail */}
            <Modal
                title={`Fiche détaillée - ${selectedUser?.displayName}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                className="user-modal"
            >
                {selectedUser && (
                    <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                        <TabPane tab="Informations" key="1">
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="Nom complet">{selectedUser.displayName}</Descriptions.Item>
                                <Descriptions.Item label="Email">{selectedUser.userPrincipalName}</Descriptions.Item>
                                <Descriptions.Item label="Poste">{selectedUser.jobTitle || 'Non spécifié'}</Descriptions.Item>
                                <Descriptions.Item label="Département">{selectedUser.department || 'Non spécifié'}</Descriptions.Item>
                                <Descriptions.Item label="Bureau">{selectedUser.officeLocation || 'Non spécifié'}</Descriptions.Item>
                                <Descriptions.Item label="Téléphone">{selectedUser.phoneNumber || 'Non spécifié'}</Descriptions.Item>
                                <Descriptions.Item label="Statut">
                                    <Badge
                                        status={selectedUser.status === 'actif' ? 'success' : 'default'}
                                        text={selectedUser.status || 'Inconnu'}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Date de création">
                                    {selectedUser.createdDate
                                        ? new Date(selectedUser.createdDate).toLocaleString()
                                        : 'Non spécifiée'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Manager" span={2}>
                                    {selectedUser.manager?.displayName || 'Non spécifié'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Utilisateur licencié">
                                    {selectedUser.isLicensed ? (
                                        <Tag color="green">Oui</Tag>
                                    ) : (
                                        <Tag color="red">Non</Tag>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Licence expirée">
                                    {selectedUser.isLicenseExpired ? (
                                        <Tag color="red">Oui</Tag>
                                    ) : (
                                        <Tag color="green">Non</Tag>
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>

                        <TabPane tab="Activités" key="2">
                            <List
                                dataSource={[
                                    'Connexion au portail le 01/08',
                                    'Mise à jour du profil le 28/07',
                                    'Réinitialisation du mot de passe le 15/07'
                                ]}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            />
                        </TabPane>
                    </Tabs>
                )}
            </Modal>

            {/* Modal historique */}
            <Modal
                title="Historique des modifications"
                visible={isHistoryVisible}
                onCancel={() => setIsHistoryVisible(false)}
                footer={null}
                className="history-modal"
            >
                <Timeline>
                    {historyData.map(item => (
                        <Timeline.Item key={item.id}>
                            <p className="history-date">{item.date} - {item.action}</p>
                            {item.champ && <p className="history-change">{item.champ}: {item.ancien} → {item.nouveau}</p>}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Modal>

            {/* Modal d'ajout */}
            <Modal
                title={newUser.id ? "Modifier un utilisateur" : "Ajouter un nouvel utilisateur"}
                visible={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    setNewUser({
                        displayName: '',
                        userPrincipalName: '',
                        jobTitle: '',
                        department: '',
                        officeLocation: '',
                        phoneNumber: '',
                        status: 'ACTIVE',
                        type: 'USER_SIMPLE',
                        password: '',
                        role: '',
                    });
                }}
                onOk={async () => {
                    const userToSave = { ...newUser };
                    if (newUser.type !== 'ADMIN_IT') {
                        delete userToSave.password;
                        delete userToSave.role;
                    }

                    if (newUser.id) {
                        // modification
                        //setUsers(users.map(u => u.id === newUser.id ? userToSave : u));
                        message.success('Utilisateur modifié avec succès');
                    } else {
                        try {
                            await createUser(userToSave);
                            message.success("Utilisateur ajouté avec succès !");
                        } catch (error) {
                            message.error("Erreur lors de la création de l’utilisateur.");
                        }
                    }

                    setIsAddModalVisible(false);
                    setNewUser({
                        displayName: '',
                        userPrincipalName: '',
                        jobTitle: '',
                        department: '',
                        officeLocation: '',
                        phoneNumber: '',
                        status: 'ACTIVE',
                        type: 'USER_SIMPLE',
                        password: '',
                        role: '',
                    });
                }}
                okText={newUser.id ? "Modifier" : "Ajouter"}
                cancelText="Annuler"
                width={700}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Nom complet" required>
                                <Input
                                    value={newUser.displayName}
                                    onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                                    placeholder="Jean Kabila"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Adresse e-mail (UPN)" required>
                                <Input
                                    value={newUser.userPrincipalName}
                                    onChange={(e) => setNewUser({ ...newUser, userPrincipalName: e.target.value })}
                                    placeholder="jean.kabila@example.com"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Titre du poste">
                                <Input
                                    value={newUser.jobTitle}
                                    onChange={(e) => setNewUser({ ...newUser, jobTitle: e.target.value })}
                                    placeholder="Développeur"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Département">
                                <Input
                                    value={newUser.department}
                                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                    placeholder="Informatique"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Bureau">
                                <Input
                                    value={newUser.officeLocation}
                                    onChange={(e) => setNewUser({ ...newUser, officeLocation: e.target.value })}
                                    placeholder="Kinshasa"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Téléphone">
                                <Input
                                    value={newUser.phoneNumber}
                                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                    placeholder="+243 812 345 678"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Statut" required>
                                <Select
                                    value={newUser.status}
                                    onChange={(value) => setNewUser({ ...newUser, status: value })}
                                >
                                    <Select.Option value="ACTIVE">Actif</Select.Option>
                                    <Select.Option value="INACTIVE">Inactif</Select.Option>
                                    <Select.Option value="PENDING">En attente</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Type d'utilisateur" required>
                                <Select
                                    value={newUser.type}
                                    onChange={(value) => setNewUser({ ...newUser, type: value })}
                                >
                                    <Select.Option value="USER_SIMPLE">User simple</Select.Option>
                                    <Select.Option value="ADMIN_IT">Admin IT</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {newUser.type === 'ADMIN_IT' && (
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Mot de passe" required>
                                        <Input.Password
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            placeholder="********"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Rôle" required>
                                        <Select
                                            value={newUser.role}
                                            onChange={(value) => setNewUser({ ...newUser, role: value })}
                                        >
                                            <Select.Option value="ADMIN">ADMIN</Select.Option>
                                            <Select.Option value="SUPER_ADMIN">SUPER ADMIN</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Modal>


        </div>
    );
};

export default Users;