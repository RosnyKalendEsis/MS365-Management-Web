import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Tooltip, Typography, Spin, message } from 'antd';
import { CopyOutlined, ReloadOutlined, CloseCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { useAzureState } from "../providers/AzureStateProvider";
import '../styles/ModalAzureDisconnected.css';

const { Title, Text, Paragraph, Link } = Typography;

const ModalAzureDisconnected = () => {
    const { azureStates,fetchAzureStates } = useAzureState();
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const state = azureStates[0];

    useEffect(() => {
        if (azureStates.length > 0 && azureStates[0].connected === false) {
            setShowModal(true);
        }
    }, [azureStates]);

    const handleCopy = () => {
        navigator.clipboard.writeText(state.code).then(() => {
            setCopied(true);
            message.success("✅ Code copié dans le presse-papier !");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleRetry = () => {
        window.location.reload();
    };

    if (!state) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: 50 }} />;
    }

    return (
        <Modal
            title="🔒 Connexion Azure AD requise"
            open={showModal}
            footer={null}
            closable={false}
            centered
            width={650}
            className="azure-modal"
        >
            <div style={{ padding: 10 }}>
                <Paragraph type="warning">
                    Votre application <strong>n'est pas connectée</strong> à Azure Active Directory.<br />
                    Veuillez suivre les instructions ci-dessous pour activer la connexion.
                </Paragraph>

                <div style={{ marginTop: 30 }}>
                    <Title level={5}>Code d'autorisation</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Input
                            value={state.code || 'Aucun code'}
                            readOnly
                            style={{ width: '100%' }}
                        />
                        <Tooltip title="Copier le code">
                            <Button
                                icon={<CopyOutlined />}
                                onClick={handleCopy}
                                disabled={!state.code}
                            />
                        </Tooltip>
                    </div>
                </div>

                <div style={{ marginTop: 25 }}>
                    <Title level={5}>Callback URL</Title>
                    {state.callback ? (
                        <Link
                            href={state.callback}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ wordBreak: 'break-all' }}
                        >
                            <LinkOutlined /> {state.callback}
                        </Link>
                    ) : (
                        <Text type="secondary">Aucune URL fournie</Text>
                    )}
                </div>

                <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Button type="primary" icon={<ReloadOutlined />} onClick={handleRetry}>
                        Réessayer
                    </Button>
                    <Button danger icon={<CloseCircleOutlined />} onClick={() => window.close()}>
                        Fermer l'application
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAzureDisconnected;