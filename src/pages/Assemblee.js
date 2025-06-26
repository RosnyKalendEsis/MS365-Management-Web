import React, { useContext, useEffect, useState } from 'react';
import {
    Card, Button, Form, Input, Select, Avatar, Row, Col,
    Table, Tag, Modal, message, Space, Tabs, Badge, Popconfirm, Switch
} from 'antd';
import {
    UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
    SaveOutlined, CheckOutlined, ArrowLeftOutlined, TeamOutlined,
    AuditOutlined, AppstoreOutlined
} from '@ant-design/icons';
import '../styles/Assemblee.css';
import { BureauContext } from "../providers/BureauProvider";
import { DeputyContext } from "../providers/DeputyProvider";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Assemblee = () => {
    // Contextes
    const {
        bureauRoles,
        createMember,
        members,
        onCreateBureau,
        onUpdatingBureau,
        deleteMember,
        bureauProvincial,
        publishBureau,
        onPublishBureau,
        createRole,
        deleteRole
    } = useContext(BureauContext);

    const { deputies } = useContext(DeputyContext);

    // États pour le Bureau Collégial
    const [bureau, setBureau] = useState(members);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [currentMembre, setCurrentMembre] = useState(null);
    const [isPublie, setIsPublie] = useState(bureauProvincial ? bureauProvincial.published : false);
    const [form] = Form.useForm();
    const [roleForm] = Form.useForm();

    // États pour les Commissions
    const [commissions, setCommissions] = useState([
        { id: 1, title: "Commission Budget", domain: "Finances", members: 15, active: true },
        { id: 2, title: "Commission Affaires Sociales", domain: "Santé", members: 12, active: true },
        { id: 3, title: "Commission Éducation", domain: "Enseignement", members: 10, active: false }
    ]);
    const [isCommissionModalVisible, setIsCommissionModalVisible] = useState(false);
    const [currentCommission, setCurrentCommission] = useState(null);
    const [commissionForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('bureau');

    // Domaines disponibles pour les commissions
    const commissionDomains = [
        'Finances', 'Santé', 'Éducation', 'Défense',
        'Affaires Étrangères', 'Justice', 'Environnement'
    ];

    // Initialisation des données
    useEffect(() => {
        setBureau(members);
        setIsPublie(bureauProvincial ? bureauProvincial.published : false);
    }, [members, bureauProvincial]);

    // Fonctions utilitaires
    const getRoleColor = (role) => {
        const colors = {
            'PRESIDENT': 'red',
            'VICE PRESIDENT': 'blue',
            'RAPPORTEUR': 'green',
            'RAPPORTEUR ADJOINT': 'orange',
            'QUESTEUR': 'purple'
        };
        return colors[role] || 'gray';
    };

    const getPartiColor = (parti) => {
        const colors = {
            'PPRD': 'volcano',
            'UDPS': 'geekblue',
            'UNC': 'green',
            'AFDC': 'orange'
        };
        return colors[parti] || 'gray';
    };

    // Gestion du Bureau Collégial
    const handleAdd = () => {
        setCurrentMembre(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (index) => {
        setCurrentMembre({ ...bureau[index], index });
        form.setFieldsValue({
            role: bureau[index].role.id,
            membreId: bureau[index].membre.id,
            description: bureau[index].description
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (index) => {
        const membreASupprimer = bureau[index];
        await deleteMember(membreASupprimer.id);
    };

    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            const membreSelectionne = deputies.find(d => d.id === values.membreId);

            const newMember = {
                deputyId: membreSelectionne.id,
                roleId: values.role,
                description: values.description
            };

            if (currentMembre !== null) {
                await createMember({ ...newMember, id: currentMembre.id });
                message.success("Membre modifié avec succès");
            } else {
                if (bureau.some(m => m.role.id === values.role)) {
                    message.error("Ce rôle est déjà attribué à un autre membre");
                    return;
                }
                await createMember(newMember);
                message.success("Membre ajouté avec succès");
            }

            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleCreateRole = () => {
        roleForm.validateFields().then(async (values) => {
            await createRole(values);
            setIsRoleModalVisible(false);
            roleForm.resetFields();
            message.success("Rôle créé avec succès");
        });
    };

    const handleDeleteRole = async (roleId) => {
        await deleteRole(roleId);
        message.success("Rôle supprimé avec succès");
    };

    const handlePublier = async () => {
        const rolesManquants = bureauRoles.filter(role => !bureau.some(m => m.role.id === role.id));
        if (rolesManquants.length > 0) {
            message.error(`Certains rôles ne sont pas attribués : ${rolesManquants.map(r => r.name).join(', ')}`);
            return;
        }
        await publishBureau(true);
        message.success('Le bureau collégial a été publié avec succès');
    };

    // Gestion des Commissions
    const handleAddCommission = () => {
        setCurrentCommission(null);
        commissionForm.resetFields();
        setIsCommissionModalVisible(true);
    };

    const handleEditCommission = (commission) => {
        setCurrentCommission(commission);
        commissionForm.setFieldsValue(commission);
        setIsCommissionModalVisible(true);
    };

    const handleDeleteCommission = (id) => {
        setCommissions(commissions.filter(c => c.id !== id));
        message.success('Commission supprimée avec succès');
    };

    const handleCommissionSubmit = () => {
        commissionForm.validateFields().then(values => {
            if (currentCommission) {
                setCommissions(commissions.map(c =>
                    c.id === currentCommission.id ? { ...c, ...values } : c
                ));
                message.success('Commission mise à jour avec succès');
            } else {
                const newCommission = {
                    id: Math.max(...commissions.map(c => c.id), 0) + 1,
                    ...values
                };
                setCommissions([...commissions, newCommission]);
                message.success('Commission créée avec succès');
            }
            setIsCommissionModalVisible(false);
        });
    };

    // Colonnes pour le tableau du Bureau
    const bureauColumns = [
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color={getRoleColor(role.name)}>{role.name}</Tag>
        },
        {
            title: 'Membre',
            dataIndex: 'membre',
            key: 'membre',
            render: (membre) => (
                <div className="membre-info">
                    <Avatar size="large" src={membre.photo} icon={<UserOutlined />} />
                    <div className="membre-details">
                        <div className="membre-nom">{membre.nom}</div>
                        <Tag color={getPartiColor(membre.parti)}>{membre.parti}</Tag>
                    </div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <div className="actions-buttons">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(index)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(index)}
                    />
                </div>
            )
        }
    ];

    // Colonnes pour le tableau des Commissions
    const commissionColumns = [
        {
            title: 'Nom',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    <Tag icon={<TeamOutlined />} color={record.active ? 'green' : 'red'}>
                        {text}
                    </Tag>
                </Space>
            )
        },
        {
            title: 'Domaine',
            dataIndex: 'domain',
            key: 'domain',
            render: (domain) => <Tag color="blue">{domain}</Tag>
        },
        {
            title: 'Membres',
            dataIndex: 'members',
            key: 'members',
            render: (members) => `${members} députés`
        },
        {
            title: 'Statut',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <Badge
                    status={active ? 'success' : 'error'}
                    text={active ? 'Active' : 'Inactive'}
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditCommission(record)}
                    />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette commission ?"
                        onConfirm={() => handleDeleteCommission(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="assemblee-page">
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                style={{ marginRight: 16, marginBottom: 16 }}
            >
                Retour
            </Button>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                {/* Onglet Bureau Collégial */}
                <TabPane
                    tab={
                        <span>
              <AppstoreOutlined /> Bureau Collégial
            </span>
                    }
                    key="bureau"
                >
                    <Card
                        title="Création du Bureau Collégial"
                        bordered={false}
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsRoleModalVisible(true)}
                                    disabled={isPublie}
                                >
                                    Créer un rôle
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handlePublier}
                                    disabled={isPublie || bureau.length === 0}
                                >
                                    {isPublie ? 'Publié' : (onPublishBureau ? 'Publication en cours...' : 'Publier le bureau')}
                                </Button>
                                {isPublie && <Tag icon={<CheckOutlined />} color="success">Publié</Tag>}
                            </Space>
                        }
                    >
                        <div className="bureau-header">
                            <div className="instructions">
                                <p>
                                    Créez ici le bureau collégial de l'Assemblée en attribuant les différents rôles aux députés.
                                    Tous les rôles doivent être attribués avant publication.
                                </p>
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                disabled={isPublie}
                            >
                                Ajouter un membre
                            </Button>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h3>Rôles disponibles</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {bureauRoles.map(role => (
                                    <Tag
                                        key={role.id}
                                        color={getRoleColor(role.name)}
                                        closable
                                        onClose={(e) => {
                                            e.preventDefault();
                                            handleDeleteRole(role.id);
                                        }}
                                    >
                                        {role.name}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <Table
                            columns={bureauColumns}
                            dataSource={bureau}
                            rowKey="id"
                            bordered
                            pagination={false}
                            className="bureau-table"
                            locale={{
                                emptyText: 'Aucun membre ajouté au bureau collégial'
                            }}
                        />

                        {bureau.length > 0 && (
                            <div className="bureau-preview">
                                <h3>Aperçu du bureau collégial</h3>
                                <Row gutter={[16, 16]}>
                                    {bureau.map((membre, index) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                            <Card className="membre-card">
                                                <div className="membre-role">
                                                    <Tag color={getRoleColor(membre.role.name)}>{membre.role.name}</Tag>
                                                </div>
                                                <div className="membre-content">
                                                    <Avatar size={64} src={membre.membre.photo} icon={<UserOutlined />} />
                                                    <h4>{membre.membre.nom}</h4>
                                                    <Tag color={getPartiColor(membre.membre.parti)}>
                                                        {membre.membre.parti}
                                                    </Tag>
                                                    {membre.description && (
                                                        <p className="membre-description">{membre.description}</p>
                                                    )}
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Card>
                </TabPane>

                {/* Onglet Commissions */}
                <TabPane
                    tab={
                        <span>
              <AuditOutlined /> Commissions
            </span>
                    }
                    key="commissions"
                >
                    <Card
                        title="Gestion des Commissions"
                        bordered={false}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddCommission}
                            >
                                Créer une commission
                            </Button>
                        }
                    >
                        <Table
                            columns={commissionColumns}
                            dataSource={commissions}
                            rowKey="id"
                            bordered
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </TabPane>
            </Tabs>

            {/* Modal pour les membres du Bureau */}
            <Modal
                title={currentMembre ? "Modifier le membre" : "Ajouter un membre au bureau"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        icon={currentMembre ? <EditOutlined /> : <PlusOutlined />}
                        onClick={handleSubmit}
                    >
                        {currentMembre ? (onUpdatingBureau ? "Modification en cours..." : "Modifier") : (onCreateBureau ? "Ajout en cours..." : "Ajouter")}
                    </Button>
                ]}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Rôle"
                                rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
                            >
                                <Select placeholder="Sélectionnez un rôle">
                                    {bureauRoles.map(role => (
                                        <Option
                                            key={role.id}
                                            value={role.id}
                                            disabled={bureau.some(m => m.role.id === role.id) && (!currentMembre || bureau[currentMembre.index].role.id !== role.id)}
                                        >
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="membreId"
                                label="Député"
                                rules={[{ required: true, message: 'Veuillez sélectionner un député' }]}
                            >
                                <Select
                                    placeholder="Sélectionnez un député"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {deputies.map(depute => (
                                        <Option key={depute.id} value={depute.id}>
                                            <div className="depute-option">
                                                <Avatar size="small" src={depute.photo} icon={<UserOutlined />} />
                                                <span>{depute.nom}</span>
                                                <Tag color={getPartiColor(depute.parti)}>{depute.parti}</Tag>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description (optionnel)"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Ajoutez une description ou une note concernant ce membre..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour les rôles */}
            <Modal
                title="Créer un nouveau rôle"
                visible={isRoleModalVisible}
                onCancel={() => setIsRoleModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsRoleModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateRole}
                    >
                        Créer le rôle
                    </Button>
                ]}
            >
                <Form form={roleForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nom du rôle"
                        rules={[{ required: true, message: 'Veuillez entrer un nom pour le rôle' }]}
                    >
                        <Input placeholder="Ex: PRESIDENT, VICE PRESIDENT, etc." />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description (optionnel)"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Description du rôle et de ses responsabilités..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour les commissions */}
            <Modal
                title={currentCommission ? "Modifier la commission" : "Créer une nouvelle commission"}
                visible={isCommissionModalVisible}
                onCancel={() => setIsCommissionModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsCommissionModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleCommissionSubmit}
                    >
                        {currentCommission ? "Modifier" : "Créer"}
                    </Button>
                ]}
            >
                <Form form={commissionForm} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Nom de la commission"
                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                    >
                        <Input placeholder="Ex: Commission Budget" />
                    </Form.Item>

                    <Form.Item
                        name="domain"
                        label="Domaine"
                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                    >
                        <Select placeholder="Sélectionnez un domaine">
                            {commissionDomains.map(domain => (
                                <Option key={domain} value={domain}>{domain}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="members"
                        label="Nombre de membres"
                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                    >
                        <Input type="number" min="1" />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label="Statut"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            defaultChecked
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Assemblee;