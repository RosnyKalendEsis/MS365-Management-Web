import React, {useContext, useEffect, useState} from 'react';
import {
    Card, Button, Form, Input, Select, Avatar, Row, Col,
    Table, Tag, Modal, message, Upload, Space
} from 'antd';
import {
    UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
    SaveOutlined, UploadOutlined, CheckOutlined
} from '@ant-design/icons';
import '../styles/Assemblee.css';
import {BureauContext} from "../providers/BureauProvider";
import {DeputyContext} from "../providers/DeputyProvider";

const { Option } = Select;
const { TextArea } = Input;

const Assemblee = () => {
    // États
    const { bureauLoading, bureauError,bureauRoles,createMember, members } = useContext(BureauContext);
    const { deputies } = useContext(DeputyContext);
    const [bureau, setBureau] = useState(members);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMembre, setCurrentMembre] = useState(null);
    const [isPublie, setIsPublie] = useState(false);
    const [form] = Form.useForm();
    const [newPhoto, setNewPhoto] = useState({photo:null});

    // Rôles disponibles
    const [roles, setRoles] = useState(bureauRoles);

    useEffect(() => {
        setRoles(bureauRoles);
    },[bureauRoles]);

    // Données de députés (simulées)
    const [deputes, setDeputes] = useState(deputies);
    useEffect(() => {
        setDeputes(deputies);
    },[deputies]);

    useEffect(() => {
        setBureau(members);
    }, [members]);

    // Colonnes du tableau
    const columns = [
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

    const handleAdd = () => {
        setCurrentMembre(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (index) => {
        setCurrentMembre({ ...bureau[index], index });
        form.setFieldsValue({
            role: bureau[index].role.name,
            membreId: bureau[index].membre.id
        });
        setIsModalVisible(true);
    };

    const handleDelete = (index) => {
        const newBureau = [...bureau];
        newBureau.splice(index, 1);
        setBureau(newBureau);
        message.success('Membre retiré du bureau avec succès');
    };

    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            const membreSelectionne = deputes.find(d => d.id === values.membreId);

            // Mettre à jour le state newMember avec les nouvelles valeurs
            const newMember ={
                deputyId: membreSelectionne.id,
                roleId: values.role,
                description: values.description
            };

            if (currentMembre !== null) {
                // Modification locale (à implémenter côté backend si besoin)
                // const newBureau = [...bureau];
                // newBureau[currentMembre.index] = {
                //     ...newBureau[currentMembre.index],
                //     ...newMembre
                // };
                // setBureau(newBureau);
                message.success("Membre modifié avec succès");
            } else {
                // Ajout via API
                if (bureau.some(m => m.role.id === values.role)) {
                    message.error("Ce rôle est déjà attribué à un autre membre");
                    return;
                }

                await createMember(newMember, newPhoto);
            }

            setIsModalVisible(false);
            form.resetFields();
        });
    };


    const handlePublier = () => {
        // Vérifier que tous les rôles sont attribués
        const rolesManquants = roles.filter(role => !bureau.some(m => m.role.id === role));

        if (rolesManquants.length > 0) {
            message.error(`Certains rôles ne sont pas attribués : ${rolesManquants.join(', ')}`);
            return;
        }

        setIsPublie(true);
        message.success('Le bureau collégial a été publié avec succès');
    };

    return (
        <div className="assemblee-page">
            <Card
                title="Création du Bureau Collégial"
                bordered={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handlePublier}
                            disabled={isPublie || bureau.length === 0}
                        >
                            {isPublie ? 'Publié' : 'Publier le bureau'}
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

                <Table
                    columns={columns}
                    dataSource={bureau}
                    rowKey="role"
                    bordered
                    pagination={false}
                    className="bureau-table"
                    locale={{
                        emptyText: 'Aucun membre ajouté au bureau collégial'
                    }}
                />

                {/* Aperçu du bureau */}
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
                                            {membre.membre.description && (
                                                <p className="membre-description">{membre.membre.description}</p>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Card>

            {/* Modal pour ajouter/modifier un membre */}
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
                        {currentMembre ? "Modifier" : "Ajouter"}
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
                                    {roles.map(role => (
                                        <Option
                                            key={role.id}
                                            value={role.id}
                                            disabled={bureau.some(m => m.role.id === role) && (!currentMembre || bureau[currentMembre.index].role.id !== role)}
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
                                    {deputes.map(depute => (
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

                    <Form.Item label="Photo (optionnel)">
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                console.log("file:", file);
                                // On capture le fichier ici ✅
                                setNewPhoto({
                                    ...newPhoto,
                                    photo: URL.createObjectURL(file),
                                    photoFile: file
                                });
                                return false; // empêcher le chargement automatique
                            }}
                        >
                            {newPhoto.photo ? (
                                <img src={newPhoto.photo} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Changer la photo</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Assemblee;