import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, CheckCircleOutlined, AppstoreOutlined, ClockCircleOutlined } from '@ant-design/icons';

const UserStats = ({ stats }) => {
    return (
        <div style={{ marginBottom: 24 }}>
            <Row gutter={16}>
                <Col xs={24} sm={12} md={6} lg={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Total utilisateurs"
                            value={stats.total}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Actifs"
                            value={stats.actifs}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Départements"
                            value={stats.departments}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Utilisateurs récents"
                            value={stats.recent}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserStats;