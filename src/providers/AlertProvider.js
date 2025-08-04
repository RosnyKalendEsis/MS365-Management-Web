import React, { createContext, useContext, useState, useEffect } from 'react';
import {Ajax} from "../services/ajax";
import moment from "moment";
import {FaUsers} from "react-icons/fa";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const AlertProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [notificationItems, setNotificationItems] = useState([]);

    const getNotifications = async () => {
        setLoading(true);
        try {
            const { data } = await Ajax.getRequest(`/api/notifications`);
            console.log("notifications recipient", data);

            const transformed = data.map((notif, index) => ({
                id: notif.id,
                from: 'taxes@dgrk.cd',
                to: `${notif.recipient.mail}`,
                subject: notif.title,
                content: notif.body,
                date: moment(notif.dateTime).format('YYYY-MM-DD HH:mm'),
                read: notif.msgRead,
                starred: false,
                labels: ['note fiscale', 'expiration'],
                attachments: []
            }));

            const transformedItem = data.map((notif, index) => ({
                id: notif.id,
                icon: <FaUsers size={14} />,
                iconBg: "info",
                text: notif.body,
                time: moment(notif.dateTime).format('YYYY-MM-DD HH:mm'),
                read: notif.msgRead,
            }));

            setUnreadNotifications(transformed.filter(notification => !notification.read).length);
            setNotifications(transformed);
            setNotificationItems(transformedItem.slice(0, 2));
        } catch (error) {
            console.log("❌ Erreur lors du chargement des notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notification) => {
        try {
            const response = await Ajax.putRequest(`/api/notifications/${notification}/read`);
            if (response.status === 200) {
                await getNotifications()
            }
        }catch (err) {
            console.log("erreur")
        }
    }

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                loading,
                notifications,
                markAsRead,
                unreadNotifications,
                notificationItems
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};