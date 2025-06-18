import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    message,
    Descriptions,
    Tag,
    Divider,
    Tabs,
    Row,
    Col,
    Select,
    Modal,
    Badge,
    Avatar,
    Switch, Space
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    EditOutlined,
    SaveOutlined,
    SafetyOutlined,
    AuditOutlined,
    LogoutOutlined,
    CameraOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import '../styles/ProfileAdmin.css';
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProfileAdmin = () => {
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('infos');
    const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);

    // Données de l'administrateur
    const [adminData, setAdminData] = useState({
        nom: 'KABILA',
        prenom: 'Jean',
        email: 'admin@gouv.rdc',
        telephone: '+243 81 234 5678',
        role: 'Super Administrateur',
        permissions: ['gestion_comptes', 'moderation', 'configuration_systeme'],
        derniereConnexion: '2023-07-15 14:30',
        adresse: "Tour de l'Échangeur, Kinshasa",
        bio: 'Administrateur principal du portail gouvernemental'
    });

    // Options
    const roles = [
        'Super Administrateur',
        'Administrateur Technique',
        'Modérateur',
        'Gestionnaire de Contenu'
    ];

    const permissions = [
        { value: 'gestion_comptes', label: 'Gestion des comptes' },
        { value: 'moderation', label: 'Modération' },
        { value: 'configuration_systeme', label: 'Configuration système' },
        { value: 'gestion_documents', label: 'Gestion des documents' }
    ];

    // Handlers
    const handleSave = (values) => {
        setAdminData({ ...adminData, ...values });
        message.success('Profil mis à jour avec succès');
        setEditing(false);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Vous ne pouvez uploader que des images!');
        }
        return isImage;
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'done') {
            setAvatar(info.file.originFileObj);
            message.success('Photo de profil mise à jour');
        }
    };

    const enable2FA = () => {
        setIsSecurityModalVisible(true);
    };

    return (
        <div className="profile-admin">
            <Card
                title={
                    <Space>
                        <UserOutlined />
                        <span>Profil Administrateur</span>
                        <Tag color="blue" icon={<SafetyOutlined />}>
                            {adminData.role}
                        </Tag>
                    </Space>
                }
                bordered={false}
                extra={
                    <Space>
                        {editing ? (
                            <>
                                <Button onClick={() => setEditing(false)}>Annuler</Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={() => form.submit()}
                                >
                                    Enregistrer
                                </Button>
                            </>
                        ) : (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setEditing(true)}
                            >
                                Modifier
                            </Button>
                        )}
                    </Space>
                }
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Informations" key="infos" icon={<UserOutlined />} />
                    <TabPane tab="Sécurité" key="security" icon={<LockOutlined />} />
                    <TabPane tab="Activité" key="activity" icon={<AuditOutlined />} />
                </Tabs>

                {activeTab === 'infos' && (
                    <Form
                        form={form}
                        initialValues={adminData}
                        onFinish={handleSave}
                        layout="vertical"
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={8}>
                                <div className="avatar-section">
                                    <Upload
                                        name="avatar"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleAvatarChange}
                                        disabled={!editing}
                                    >
                                        <Avatar
                                            size={128}
                                            src={avatar ? URL.createObjectURL(avatar) : null}
                                            icon={<UserOutlined />}
                                            className="admin-avatar"
                                        />
                                        {editing && (
                                            <div className="avatar-edit-overlay">
                                                <CameraOutlined />
                                            </div>
                                        )}
                                    </Upload>
                                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                                        <Tag color="green" icon={<CheckCircleOutlined />}>
                                            Vérifié
                                        </Tag>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={16}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="nom" label="Nom">
                                            <Input prefix={<UserOutlined />} disabled={!editing} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="prenom" label="Prénom">
                                            <Input prefix={<UserOutlined />} disabled={!editing} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item name="email" label="Email">
                                    <Input prefix={<MailOutlined />} disabled={!editing} />
                                </Form.Item>

                                <Form.Item name="telephone" label="Téléphone">
                                    <Input prefix={<PhoneOutlined />} disabled={!editing} />
                                </Form.Item>

                                <Form.Item name="role" label="Rôle">
                                    <Select disabled={!editing}>
                                        {roles.map(role => (
                                            <Option key={role} value={role}>{role}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item name="adresse" label="Adresse">
                                    <Input disabled={!editing} />
                                </Form.Item>

                                <Form.Item name="bio" label="Biographie">
                                    <TextArea rows={4} disabled={!editing} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}

                {activeTab === 'security' && (
                    <div className="security-section">
                        <Card title="Authentification" bordered={false}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Dernière connexion">
                                    {moment(adminData.derniereConnexion).format('LLL')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Authentification à deux facteurs">
                                    <Switch
                                        checkedChildren="Activé"
                                        unCheckedChildren="Désactivé"
                                        defaultChecked={false}
                                        onChange={enable2FA}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Permissions">
                                    <Space wrap>
                                        {adminData.permissions.map(perm => (
                                            <Tag key={perm} color="blue">
                                                {permissions.find(p => p.value === perm)?.label || perm}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Button
                                type="primary"
                                danger
                                icon={<LogoutOutlined />}
                                style={{ marginRight: 16 }}
                            >
                                Déconnexion globale
                            </Button>

                            <Button
                                type="primary"
                                icon={<SafetyOutlined />}
                                onClick={() => setIsSecurityModalVisible(true)}
                            >
                                Modifier le mot de passe
                            </Button>
                        </Card>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <Card title="Activité récente" bordered={false}>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Dernières actions">
                                <ul className="activity-list">
                                    <li>Modification du député MK-45 (15/07 14:30)</li>
                                    <li>Publication d'une actualité (14/07 10:15)</li>
                                    <li>Création d'une consultation (13/07 16:45)</li>
                                </ul>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sessions actives">
                                <Badge status="success" text="2 appareils connectés" />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
            </Card>

            {/* Modal de sécurité */}
            <Modal
                title="Paramètres de sécurité"
                visible={isSecurityModalVisible}
                onCancel={() => setIsSecurityModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="Ancien mot de passe">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Nouveau mot de passe">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Confirmation">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">Mettre à jour</Button>
                    </Form.Item>
                </Form>

                <Divider orientation="left">Authentification à deux facteurs</Divider>

                <div style={{ textAlign: 'center' }}>
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2FAKEY-ADMIN-123"
                        alt="QR Code 2FA"
                    />
                    <p style={{ marginTop: 16 }}>
                        Scannez ce QR code avec votre application d'authentification
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileAdmin;