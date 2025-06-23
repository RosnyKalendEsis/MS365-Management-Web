import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Select,
    Divider,
    Tabs,
    Upload,
    Avatar,
    message,
    Row,
    Col,
    Modal,
    Descriptions,
    Tag,
    Badge,
    Alert
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    GlobalOutlined,
    NotificationOutlined,
    SecurityScanOutlined,
    ApiOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined, PlusOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import '../styles/Settings.css';

const { Option } = Select;
const { TabPane } = Tabs;

const SettingsPage = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('general');
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Données de l'administrateur (simulées)
    const adminData = {
        name: 'Admin Gouvernement',
        email: 'admin@gouv.cd',
        avatar: null,
        lastLogin: '2023-07-20 14:30',
        role: 'Administrateur',
        permissions: ['full_access']
    };

    // Paramètres de l'application
    const [settings, setSettings] = useState({
        siteTitle: 'Portail Gouvernemental RDC',
        siteUrl: 'https://gouv.cd',
        maintenanceMode: false,
        timezone: 'Africa/Kinshasa',
        dateFormat: 'DD/MM/YYYY',
        apiEnabled: true,
        notificationEnabled: true,
        backupFrequency: 'weekly'
    });

    const handleSaveSettings = (values) => {
        setLoading(true);
        // Simulation de sauvegarde
        setTimeout(() => {
            setSettings({ ...settings, ...values });
            message.success('Paramètres sauvegardés avec succès');
            setLoading(false);
        }, 1000);
    };

    const handlePasswordChange = (values) => {
        setLoading(true);
        // Simulation de changement de mot de passe
        setTimeout(() => {
            message.success('Mot de passe changé avec succès');
            setIsPasswordModalVisible(false);
            setLoading(false);
        }, 1500);
    };

    const handleAccountDelete = () => {
        setLoading(true);
        // Simulation de suppression
        setTimeout(() => {
            message.success('Compte supprimé avec succès');
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 2000);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Vous ne pouvez uploader que des images!');
        }
        return isImage;
    };

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} uploadé avec succès`);
            // Ici vous mettriez à jour l'avatar dans le state
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} échec de l'upload.`);
        }
    };

    return (
        <div className="settings-page">
            <Card title="Paramètres du Système" bordered={false}>
                <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => window.history.back()}
                    style={{ marginRight: 16, marginBottom: 16 }}
                >
                    Retour
                </Button>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabPosition="left"
                    className="settings-tabs"
                >
                    {/* Onglet Général */}
                    <TabPane
                        tab={
                            <span>
                <GlobalOutlined />
                Général
              </span>
                        }
                        key="general"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={settings}
                            onFinish={handleSaveSettings}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="siteTitle"
                                        label="Titre du site"
                                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                    >
                                        <Input placeholder="Portail Gouvernemental" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="siteUrl"
                                        label="URL du site"
                                        rules={[
                                            { required: true, message: 'Ce champ est obligatoire' },
                                            { type: 'url', message: 'URL invalide' }
                                        ]}
                                    >
                                        <Input prefix={<GlobalOutlined />} placeholder="https://votresite.gouv.cd" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="timezone"
                                        label="Fuseau horaire"
                                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                    >
                                        <Select>
                                            <Option value="Africa/Kinshasa">Kinshasa (UTC+1)</Option>
                                            <Option value="Africa/Lubumbashi">Lubumbashi (UTC+2)</Option>
                                            <Option value="UTC">UTC</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="dateFormat"
                                        label="Format de date"
                                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                                    >
                                        <Select>
                                            <Option value="DD/MM/YYYY">JJ/MM/AAAA</Option>
                                            <Option value="MM/DD/YYYY">MM/JJ/AAAA</Option>
                                            <Option value="YYYY-MM-DD">AAAA-MM-JJ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="backupFrequency"
                                        label="Fréquence de sauvegarde"
                                    >
                                        <Select>
                                            <Option value="daily">Quotidienne</Option>
                                            <Option value="weekly">Hebdomadaire</Option>
                                            <Option value="monthly">Mensuelle</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="maintenanceMode"
                                label="Mode maintenance"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Activé"
                                    unCheckedChildren="Désactivé"
                                />
                            </Form.Item>

                            <Divider orientation="left">Logo et Favicon</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Logo du site">
                                        <Upload
                                            name="logo"
                                            action="/upload"
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            onChange={handleUpload}
                                        >
                                            <div>
                                                <CloudUploadOutlined />
                                                <div style={{ marginTop: 8 }}>Uploader</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Favicon">
                                        <Upload
                                            name="favicon"
                                            action="/upload"
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            onChange={handleUpload}
                                        >
                                            <div>
                                                <CloudUploadOutlined />
                                                <div style={{ marginTop: 8 }}>Uploader</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                                    Sauvegarder les paramètres
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* Onglet Compte */}
                    <TabPane
                        tab={
                            <span>
                <UserOutlined />
                Mon Compte
              </span>
                        }
                        key="account"
                    >
                        <div className="account-section">
                            <Descriptions
                                title="Informations du compte"
                                bordered
                                column={1}
                                extra={
                                    <Button icon={<EditOutlined />} type="primary">
                                        Modifier
                                    </Button>
                                }
                            >
                                <Descriptions.Item label="Nom">{adminData.name}</Descriptions.Item>
                                <Descriptions.Item label="Email">{adminData.email}</Descriptions.Item>
                                <Descriptions.Item label="Rôle">
                                    <Tag color="gold">{adminData.role}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Dernière connexion">
                                    {adminData.lastLogin}
                                </Descriptions.Item>
                                <Descriptions.Item label="Permissions">
                                    {adminData.permissions.map(perm => (
                                        <Tag key={perm} color="blue">{perm}</Tag>
                                    ))}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider orientation="left">Photo de profil</Divider>

                            <div className="avatar-upload">
                                <Avatar
                                    size={128}
                                    src={adminData.avatar}
                                    icon={<UserOutlined />}
                                    className="profile-avatar"
                                />
                                <Upload
                                    name="avatar"
                                    action="/upload"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleUpload}
                                >
                                    <Button icon={<CloudUploadOutlined />} style={{ marginLeft: 16 }}>
                                        Changer la photo
                                    </Button>
                                </Upload>
                            </div>

                            <Divider orientation="left">Sécurité</Divider>

                            <div className="security-actions">
                                <Button
                                    type="primary"
                                    icon={<LockOutlined />}
                                    onClick={() => setIsPasswordModalVisible(true)}
                                >
                                    Changer le mot de passe
                                </Button>

                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    style={{ marginLeft: 16 }}
                                    onClick={() => setIsDeleteModalVisible(true)}
                                >
                                    Supprimer le compte
                                </Button>
                            </div>
                        </div>
                    </TabPane>

                    {/* Onglet Sécurité */}
                    <TabPane
                        tab={
                            <span>
                <SecurityScanOutlined />
                Sécurité
              </span>
                        }
                        key="security"
                    >
                        <Form layout="vertical">
                            <Alert
                                message="Paramètres de sécurité avancés"
                                description="Ces paramètres affectent la sécurité globale du système. Modifiez avec prudence."
                                type="warning"
                                showIcon
                                style={{ marginBottom: 24 }}
                            />

                            <Form.Item
                                label="Authentification à deux facteurs"
                                name="twoFactorAuth"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Activé"
                                    unCheckedChildren="Désactivé"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Durée de session"
                                name="sessionDuration"
                                help="Durée d'inactivité avant déconnexion automatique"
                            >
                                <Select>
                                    <Option value="30">30 minutes</Option>
                                    <Option value="60">1 heure</Option>
                                    <Option value="120">2 heures</Option>
                                    <Option value="0">Jamais</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Limite de tentatives de connexion"
                                name="loginAttempts"
                                help="Nombre de tentatives avant blocage du compte"
                            >
                                <Select>
                                    <Option value="3">3 tentatives</Option>
                                    <Option value="5">5 tentatives</Option>
                                    <Option value="10">10 tentatives</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Journalisation des accès"
                                name="accessLogging"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Activé"
                                    unCheckedChildren="Désactivé"
                                />
                            </Form.Item>

                            <Divider orientation="left">Sessions actives</Divider>

                            <div className="active-sessions">
                                <Descriptions bordered size="small" column={1}>
                                    <Descriptions.Item label="Session actuelle">
                                        <Badge status="success" text="Active" /> - Navigateur Chrome sur Windows 10
                                        <Button type="link" danger size="small" style={{ float: 'right' }}>
                                            Déconnecter
                                        </Button>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Autre session">
                                        <Badge status="default" text="Inactive" /> - Navigateur Firefox sur Android
                                        <Button type="link" danger size="small" style={{ float: 'right' }}>
                                            Déconnecter
                                        </Button>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>

                            <Form.Item style={{ marginTop: 24 }}>
                                <Button type="primary" icon={<SaveOutlined />} loading={loading}>
                                    Sauvegarder les paramètres
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* Onglet Notifications */}
                    <TabPane
                        tab={
                            <span>
                <NotificationOutlined />
                Notifications
              </span>
                        }
                        key="notifications"
                    >
                        <Form
                            layout="vertical"
                            initialValues={{
                                notificationEnabled: settings.notificationEnabled,
                                emailNotifications: true,
                                pushNotifications: false,
                                notifyNewUser: true,
                                notifyFailedLogin: true
                            }}
                        >
                            <Form.Item
                                label="Activer les notifications"
                                name="notificationEnabled"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Activé"
                                    unCheckedChildren="Désactivé"
                                />
                            </Form.Item>

                            <Divider orientation="left">Préférences de notification</Divider>

                            <Form.Item
                                label="Notifications par email"
                                name="emailNotifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="Notifications push"
                                name="pushNotifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Divider orientation="left">Types de notifications</Divider>

                            <Form.Item
                                label="Nouvel utilisateur enregistré"
                                name="notifyNewUser"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="Tentative de connexion échouée"
                                name="notifyFailedLogin"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="Adresse email pour les notifications"
                                name="notificationEmail"
                                rules={[{ type: 'email', message: 'Email invalide' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="notifications@votredomaine.cd" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" icon={<SaveOutlined />} loading={loading}>
                                    Sauvegarder les préférences
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* Onglet API */}
                    <TabPane
                        tab={
                            <span>
                <ApiOutlined />
                API
              </span>
                        }
                        key="api"
                    >
                        <Form layout="vertical" initialValues={{ apiEnabled: settings.apiEnabled }}>
                            <Form.Item
                                label="Activer l'API"
                                name="apiEnabled"
                                valuePropName="checked"
                                help="Autorise l'accès aux données via l'API REST"
                            >
                                <Switch
                                    checkedChildren="Activé"
                                    unCheckedChildren="Désactivé"
                                />
                            </Form.Item>

                            <Divider orientation="left">Clés API</Divider>

                            <Alert
                                message="Clé API actuelle"
                                description={
                                    <span>
                    <code style={{ fontSize: '0.9em' }}>sk_live_abc123xyz4567890</code>
                    <Button type="link" danger size="small" style={{ float: 'right' }}>
                      Révoquer
                    </Button>
                  </span>
                                }
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />

                            <Button type="primary" icon={<PlusOutlined />}>
                                Générer une nouvelle clé
                            </Button>

                            <Divider orientation="left">Permissions API</Divider>

                            <Form.Item
                                label="Accès en lecture"
                                name="apiRead"
                                valuePropName="checked"
                            >
                                <Switch defaultChecked disabled={!settings.apiEnabled} />
                            </Form.Item>

                            <Form.Item
                                label="Accès en écriture"
                                name="apiWrite"
                                valuePropName="checked"
                            >
                                <Switch disabled={!settings.apiEnabled} />
                            </Form.Item>

                            <Form.Item
                                label="Limite de requêtes"
                                name="apiRateLimit"
                                help="Requêtes par minute par adresse IP"
                                disabled={!settings.apiEnabled}
                            >
                                <Select defaultValue="60">
                                    <Option value="30">30 req/min</Option>
                                    <Option value="60">60 req/min</Option>
                                    <Option value="120">120 req/min</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" icon={<SaveOutlined />} loading={loading}>
                                    Sauvegarder les paramètres
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Modal de changement de mot de passe */}
            <Modal
                title="Changer le mot de passe"
                visible={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handlePasswordChange}>
                    <Form.Item
                        name="currentPassword"
                        label="Mot de passe actuel"
                        rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Nouveau mot de passe"
                        rules={[
                            { required: true, message: 'Ce champ est obligatoire' },
                            { min: 8, message: 'Minimum 8 caractères' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirmer le nouveau mot de passe"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Ce champ est obligatoire' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                },
                            }),
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Changer le mot de passe
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de suppression de compte */}
            <Modal
                title="Confirmer la suppression du compte"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDeleteModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        loading={loading}
                        onClick={handleAccountDelete}
                    >
                        Supprimer définitivement
                    </Button>,
                ]}
            >
                <Alert
                    message="Attention ! Cette action est irréversible."
                    description="Toutes vos données seront supprimées définitivement. Veuillez confirmer votre mot de passe pour continuer."
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Veuillez confirmer votre mot de passe' }]}
                >
                    <Input.Password placeholder="Confirmez votre mot de passe" prefix={<LockOutlined />} />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default SettingsPage;