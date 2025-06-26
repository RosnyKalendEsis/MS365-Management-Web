import React, {useContext, useEffect, useState} from 'react';
import {
    Table, Button, Input, Space, Tag, Avatar, Card, Row, Col, Popconfirm,
    message, Select, Badge, Descriptions, Tabs, Statistic, Switch,
    Modal, List, Timeline, Dropdown, Menu, Upload, Tooltip
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
    SyncOutlined, UserOutlined, FileExcelOutlined, FilePdfOutlined,
    InfoCircleOutlined, AppstoreOutlined, UnorderedListOutlined,
    HistoryOutlined, ArrowDownOutlined, CheckOutlined, SendOutlined, CloseOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import '../styles/Deputes.css';
import { Form } from 'antd';
import {AssemblyContext} from "../providers/AssemblyProvider";
import {DeputyContext} from "../providers/DeputyProvider";
import {BureauContext} from "../providers/BureauProvider";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;

const Deputes = () => {
    // États
    const [, setSearchText] = useState('');
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedParti, setSelectedParti] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [selectedDepute, setSelectedDepute] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [, setActiveTab] = useState('1');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { deputies,createDeputy,publishDeputy,deleteDeputy,onCreateDeputy,onUpdateDeputy } = useContext(DeputyContext);
    const { provincialAssembly } = useContext(AssemblyContext);
    const {commissions} = useContext(BureauContext);
    const [newDepute, setNewDepute] = useState({
        nom: '',
        circonscription: '',
        region: '',
        parti: '',
        commission: '',
        statut: 'actif',
        telephone: '',
        email: '',
        published: false
    });

    // Données des députés
    const [deputes, setDeputes] = useState(deputies);
    useEffect(() => {
        setDeputes(deputies);
    }, [deputies]);

    // Historique des modifications
    const historyData = [
        { id: 1, date: '2023-06-15 10:30', action: 'Modification', champ: 'Commission', ancien: 'Santé', nouveau: 'Budget' },
        { id: 2, date: '2023-05-20 14:15', action: 'Ajout', champ: 'Député', nouveau: 'Jean Kabila' },
    ];

    // Options pour les filtres
    const regions = ['Kinshasa', 'Kongo-Central', 'Nord-Kivu', 'Haut-Katanga', 'Kasaï-Oriental'];
    const partis = ['PPRD', 'UDPS', 'UNC', 'AFDC', 'MLC'];
    const statuts = ['actif', 'inactif', 'en congé'];
    //const commissions = ['Budget et Finances', 'Affaires Étrangères', 'Défense Nationale', 'Santé Publique'];

    // Menu déroulant pour export
    const exportMenu = (
        <Menu>
            <Menu.Item key="excel" icon={<FileExcelOutlined />}>
                Exporter en Excel
            </Menu.Item>
            <Menu.Item key="pdf" icon={<FilePdfOutlined />}>
                Exporter en PDF
            </Menu.Item>
        </Menu>
    );

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
            // Appelle publishDeputy avec true pour chaque id sélectionné
            await Promise.all(
                selectedRowKeys.map(id => publishDeputy(id, true))
            );

            // Met à jour localement le state après confirmation API
            setDeputes(deputes.map(depute =>
                selectedRowKeys.includes(depute.id)
                    ? { ...depute, published: true }
                    : depute
            ));
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
            // Appelle publishDeputy avec false pour chaque id sélectionné
            await Promise.all(
                selectedRowKeys.map(id => publishDeputy(id, false))
            );

            setDeputes(deputes.map(depute =>
                selectedRowKeys.includes(depute.id)
                    ? { ...depute, published: false }
                    : depute
            ));
            message.success(`${selectedRowKeys.length} député(s) retiré(s) de la publication`);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error("Erreur lors du retrait de publication des députés");
        }
    };


    // Colonnes du tableau
    const columns = [
        {
            title: 'Député',
            dataIndex: 'nom',
            key: 'nom',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="large"
                        src={record.photo}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#1a3a8f',
                            border: record.published ? '2px solid #52c41a' : 'none'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.circonscription}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Parti',
            dataIndex: 'parti',
            key: 'parti',
            render: (parti) => <Tag color={getPartiColor(parti)}>{parti}</Tag>,
            filters: partis.map(p => ({ text: p, value: p })),
            onFilter: (value, record) => record.parti === value,
        },
        {
            title: 'Région',
            dataIndex: 'region',
            key: 'region',
            filters: regions.map(r => ({ text: r, value: r })),
            onFilter: (value, record) => record.region === value,
        },
        {
            title: 'Commission',
            dataIndex: 'commission',
            key: 'commission',
            filters: commissions.map(c => ({ text: c, value: c })),
            onFilter: (value, record) => record.commission === value,
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut, record) => (
                <Badge
                    status={statut === 'actif' ? 'success' : statut === 'inactif' ? 'error' : 'warning'}
                    text={
                        <span>
                            {statut === 'actif' ? 'Actif' : statut === 'inactif' ? 'Inactif' : 'En congé'}
                            {record.published && (
                                <Tag icon={<CheckOutlined />} color="success" style={{ marginLeft: 8 }}>
                                    Publié
                                </Tag>
                            )}
                        </span>
                    }
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Détails">
                        <Button
                            type="link"
                            icon={<InfoCircleOutlined />}
                            onClick={() => showDeputeDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer ce député ?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Historique">
                        <Button
                            type="link"
                            icon={<HistoryOutlined />}
                            onClick={() => showHistory(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title={record.published ? "Retirer de la publication" : "Publier"}>
                        <Button
                            type="link"
                            icon={record.published ? <CloseOutlined /> : <SendOutlined />}
                            onClick={() => handleTogglePublish(record.id)}
                            style={{ color: record.published ? '#ff4d4f' : '#52c41a' }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Fonctions utilitaires
    const getPartiColor = (parti) => {
        const colors = {
            'PPRD': 'volcano',
            'UDPS': 'geekblue',
            'UNC': 'green',
            'AFDC': 'orange',
            'MLC': 'purple'
        };
        return colors[parti] || 'gray';
    };

    const showDeputeDetails = (depute) => {
        setSelectedDepute(depute);
        setIsModalVisible(true);
    };

    const showHistory = (id) => {
        setIsHistoryVisible(true);
    };

    const handleEdit = (id) => {
        const deputeToEdit = deputes.find(d => d.id === id);
        setNewDepute(deputeToEdit);
        setIsAddModalVisible(true);
        message.info(`Modification du député ${id}`);
    };

    const handleDelete = async (id) => {
        await deleteDeputy(id);
        message.success('Député supprimé avec succès');
    };

    const handleTogglePublish = async (id) => {
        try {
            // Trouve le député courant
            const deputy = deputes.find(d => d.id === id);
            if (!deputy) return;

            const newPublished = !deputy.published;

            // Appelle l'API pour changer le statut
            await publishDeputy(id, newPublished);

            // Met à jour localement après succès
            setDeputes(deputes.map(d =>
                d.id === id ? { ...d, published: newPublished } : d
            ));

            message.success(`Député ${newPublished ? 'publié' : 'retiré de la publication'} avec succès`);
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut de publication");
        }
    };


    // Statistiques
    const stats = {
        total: deputes.length,
        actifs: deputes.filter(d => d.statut === 'actif').length,
        regions: [...new Set(deputes.map(d => d.region))].length,
        commissions: [...new Set(deputes.map(d => d.commission))].length,
        published: deputes.filter(d => d.published).length,
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
                title="Gestion des Députés"
                bordered={false}
                extra={
                    <Space>
                        <span>Mode carte</span>
                        <Switch
                            checked={viewMode === 'list'}
                            onChange={(checked) => setViewMode(checked ? 'list' : 'card')}
                            checkedChildren={<UnorderedListOutlined />}
                            unCheckedChildren={<AppstoreOutlined />}
                        />
                        <span>Mode liste</span>
                    </Space>
                }
            >
                {/* Barre d'outils */}
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Search
                                placeholder="Rechercher un député..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onChange={e => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} lg={18} style={{ textAlign: 'right' }}>
                            <Space>
                                <Select
                                    placeholder="Région"
                                    style={{ width: 150 }}
                                    onChange={setSelectedRegion}
                                    allowClear
                                    value={selectedRegion}
                                >
                                    {regions.map(region => (
                                        <Option key={region} value={region}>{region}</Option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Parti politique"
                                    style={{ width: 180 }}
                                    onChange={setSelectedParti}
                                    allowClear
                                    value={selectedParti}
                                >
                                    {partis.map(parti => (
                                        <Option key={parti} value={parti}>{parti}</Option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Statut"
                                    style={{ width: 120 }}
                                    onChange={setSelectedStatut}
                                    allowClear
                                    value={selectedStatut}
                                >
                                    {statuts.map(statut => (
                                        <Option key={statut} value={statut}>
                                            {statut === 'actif' ? 'Actif' : statut === 'inactif' ? 'Inactif' : 'En congé'}
                                        </Option>
                                    ))}
                                </Select>
                                <Dropdown overlay={exportMenu} trigger={['click']}>
                                    <Button icon={<ArrowDownOutlined />}>
                                        Exporter
                                    </Button>
                                </Dropdown>
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={() => {
                                        setSearchText('');
                                        setSelectedRegion(null);
                                        setSelectedParti(null);
                                        setSelectedStatut(null);
                                    }}
                                >
                                    Réinitialiser
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Ajouter
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
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Card className="stats-card">
                                <Statistic
                                    title="Total députés"
                                    value={stats.total}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Card className="stats-card">
                                <Statistic
                                    title="Députés actifs"
                                    value={stats.actifs}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Card className="stats-card">
                                <Statistic
                                    title="Régions"
                                    value={stats.regions}
                                    prefix={<AppstoreOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Card className="stats-card">
                                <Statistic
                                    title="Publiés"
                                    value={stats.published}
                                    valueStyle={{ color: '#1890ff' }}
                                    prefix={<CheckOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Contenu principal */}
                {viewMode === 'list' ? (
                    <Table
                        columns={columns}
                        dataSource={deputes}
                        rowKey="id"
                        bordered
                        size="middle"
                        rowSelection={rowSelection}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `${total} députés`,
                        }}
                        className="deputes-table"
                    />
                ) : (
                    <Row gutter={[16, 16]}>
                        {deputes.map(depute => (
                            <Col xs={24} sm={12} md={8} lg={6} key={depute.id}>
                                <Card
                                    className={`depute-card ${depute.published ? 'published' : ''}`}
                                    cover={
                                        <Avatar
                                            size={128}
                                            src={depute.photo}
                                            icon={<UserOutlined />}
                                            style={{
                                                backgroundColor: '#1a3a8f',
                                                margin: '16px auto',
                                                display: 'block',
                                                border: depute.published ? '2px solid #52c41a' : 'none'
                                            }}
                                        />
                                    }
                                    actions={[
                                        <Tooltip title="Détails" key="info">
                                            <InfoCircleOutlined onClick={() => showDeputeDetails(depute)} />
                                        </Tooltip>,
                                        <Tooltip title="Modifier" key="edit">
                                            <EditOutlined onClick={() => handleEdit(depute.id)} />
                                        </Tooltip>,
                                        <Tooltip title="Historique" key="history">
                                            <HistoryOutlined onClick={() => showHistory(depute.id)} />
                                        </Tooltip>,
                                        <Tooltip title={depute.published ? "Retirer" : "Publier"} key="publish">
                                            {depute.published ? (
                                                <CloseOutlined
                                                    onClick={() => handleTogglePublish(depute.id)}
                                                    style={{ color: '#ff4d4f' }}
                                                />
                                            ) : (
                                                <SendOutlined
                                                    onClick={() => handleTogglePublish(depute.id)}
                                                    style={{ color: '#52c41a' }}
                                                />
                                            )}
                                        </Tooltip>
                                    ]}
                                >
                                    <Meta
                                        title={depute.nom}
                                        description={
                                            <>
                                                <div>{depute.circonscription}</div>
                                                <Tag color={getPartiColor(depute.parti)}>{depute.parti}</Tag>
                                                <Badge
                                                    status={depute.statut === 'actif' ? 'success' : 'error'}
                                                    text={depute.statut === 'actif' ? 'Actif' : 'Inactif'}
                                                />
                                                {depute.published && (
                                                    <Tag
                                                        icon={<CheckOutlined />}
                                                        color="success"
                                                        style={{ marginTop: 8, display: 'block' }}
                                                    >
                                                        Publié
                                                    </Tag>
                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card>

            {/* Modal de détail */}
            <Modal
                title={`Fiche détaillée - ${selectedDepute?.nom}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                className="depute-modal"
            >
                {selectedDepute && (
                    <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                        <TabPane tab="Informations" key="1">
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="Circonscription">{selectedDepute.circonscription}</Descriptions.Item>
                                <Descriptions.Item label="Région">{selectedDepute.region}</Descriptions.Item>
                                <Descriptions.Item label="Parti politique">
                                    <Tag color={getPartiColor(selectedDepute.parti)}>{selectedDepute.parti}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Commission">{selectedDepute.commission}</Descriptions.Item>
                                <Descriptions.Item label="Statut">
                                    <Badge
                                        status={selectedDepute.statut === 'actif' ? 'success' : 'error'}
                                        text={
                                            <span>
                                                {selectedDepute.statut === 'actif' ? 'Actif' : 'Inactif'}
                                                {selectedDepute.published && (
                                                    <Tag icon={<CheckOutlined />} color="success" style={{ marginLeft: 8 }}>
                                                        Publié
                                                    </Tag>
                                                )}
                                            </span>
                                        }
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Téléphone">{selectedDepute.telephone}</Descriptions.Item>
                                <Descriptions.Item label="Email">{selectedDepute.email}</Descriptions.Item>
                                <Descriptions.Item label="Date d'entrée">{selectedDepute.dateEntree || 'Non spécifiée'}</Descriptions.Item>
                                <Descriptions.Item label="Biographie" span={2}>
                                    {selectedDepute.bio || 'Aucune biographie disponible'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Dernière activité" span={2}>
                                    {selectedDepute.derniereActivite || 'Aucune activité récente'}
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>
                        <TabPane tab="Activités" key="2">
                            <List
                                dataSource={[
                                    'Vote sur la loi de finances 2023',
                                    'Participation à la commission du 15/06',
                                    'Question au gouvernement le 10/06'
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
                title={newDepute.id ? "Modifier un député" : "Ajouter un nouveau député"}
                visible={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    setNewDepute({
                        nom: '',
                        circonscription: '',
                        region: '',
                        parti: '',
                        commission: '',
                        statut: 'actif',
                        telephone: '',
                        email: '',
                        published: false
                    });
                }}
                onOk={async () => {
                    if (newDepute.id) {
                        // ⚠️ Partie modification : à faire plus tard
                        setDeputes(deputes.map(d => d.id === newDepute.id ? newDepute : d));
                        message.success('Député modifié avec succès');
                    } else {
                        // ✅ Création via API
                        const deputyData = {
                            name: newDepute.nom,
                            constituency: newDepute.circonscription,
                            region: newDepute.region,
                            party: newDepute.parti,
                            commission: newDepute.commission,
                            status: newDepute.statut,
                            phone: newDepute.telephone,
                            email: newDepute.email,
                            published: newDepute.published,
                            assemblyId: provincialAssembly?.id // à adapter si nécessaire
                        };

                        try {
                            await createDeputy(deputyData, newDepute.photoFile || null);
                            message.success("Député ajouté avec succès !");
                        } catch (error) {
                            message.error("Erreur lors de la création du député.");
                        }
                    }

                    setIsAddModalVisible(false);
                    setNewDepute({
                        nom: '',
                        circonscription: '',
                        region: '',
                        parti: '',
                        commission: '',
                        statut: 'actif',
                        telephone: '',
                        email: '',
                        published: false,
                        photo: null,
                        photoFile: null,
                    });
                }}
                okText={newDepute.id ? (onUpdateDeputy ? "Modification en cours..." : "Modifier") : (onCreateDeputy ? "Ajout en cours..." : "Ajouter")}
                cancelText="Annuler"
                width={700}
                className="add-depute-modal"
            >
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Nom complet" required>
                                    <Input
                                        value={newDepute.nom}
                                        onChange={(e) => setNewDepute({...newDepute, nom: e.target.value})}
                                        placeholder="Jean Kabila"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Circonscription" required>
                                    <Input
                                        value={newDepute.circonscription}
                                        onChange={(e) => setNewDepute({...newDepute, circonscription: e.target.value})}
                                        placeholder="Kinshasa"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Région" required>
                                    <Select
                                        value={newDepute.region}
                                        onChange={(value) => setNewDepute({...newDepute, region: value})}
                                        placeholder="Sélectionnez une région"
                                    >
                                        {regions.map(region => (
                                            <Option key={region} value={region}>{region}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Parti politique" required>
                                    <Select
                                        value={newDepute.parti}
                                        onChange={(value) => setNewDepute({...newDepute, parti: value})}
                                        placeholder="Sélectionnez un parti"
                                    >
                                        {partis.map(parti => (
                                            <Option key={parti} value={parti}>{parti}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Commission" required>
                                    <Select
                                        value={newDepute.commission}
                                        onChange={(value) => setNewDepute({...newDepute, commission: value})}
                                        placeholder="Sélectionnez une commission"
                                    >
                                        {commissions.map(commission => (
                                            <Option key={commission.id} value={commission.id}>{commission.title}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Statut" required>
                                    <Select
                                        value={newDepute.statut}
                                        onChange={(value) => setNewDepute({...newDepute, statut: value})}
                                    >
                                        <Option value="actif">Actif</Option>
                                        <Option value="inactif">Inactif</Option>
                                        <Option value="en congé">En congé</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Téléphone">
                                    <Input
                                        value={newDepute.telephone}
                                        onChange={(e) => setNewDepute({...newDepute, telephone: e.target.value})}
                                        placeholder="+243 81 234 5678"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Email" required>
                                    <Input
                                        value={newDepute.email}
                                        onChange={(e) => setNewDepute({...newDepute, email: e.target.value})}
                                        placeholder="jean.kabila@assemblee.rdc"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Publication">
                            <Switch
                                checked={newDepute.published}
                                onChange={(checked) => setNewDepute({...newDepute, published: checked})}
                                checkedChildren="Publié"
                                unCheckedChildren="Non publié"
                            />
                        </Form.Item>

                        <Form.Item label="Photo (optionnel)">
                            <Upload
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    console.log("file:", file);
                                    // On capture le fichier ici ✅
                                    setNewDepute({
                                        ...newDepute,
                                        photo: URL.createObjectURL(file),
                                        photoFile: file
                                    });
                                    return false; // empêcher le chargement automatique
                                }}
                            >
                                {newDepute.photo ? (
                                    <img src={newDepute.photo} alt="avatar" style={{ width: '100%' }} />
                                ) : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Uploader</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default Deputes;