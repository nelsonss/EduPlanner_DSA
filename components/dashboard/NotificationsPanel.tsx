
import React from 'react';
import { Card } from '../shared/Card';
import { NOTIFICATIONS_DATA } from '../../constants';
import { Notification, NotificationType } from '../../types';
import { Icon } from '../shared/Icon';

const typeInfo: { [key in NotificationType]: { icon: string, color: string } } = {
    [NotificationType.Achievement]: { icon: 'achievement', color: 'text-yellow-400' },
    [NotificationType.Reminder]: { icon: 'clock', color: 'text-blue-400' },
    [NotificationType.Alert]: { icon: 'alert', color: 'text-red-400' },
    [NotificationType.Suggestion]: { icon: 'suggestion', color: 'text-green-400' },
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { icon, color } = typeInfo[notification.type];
    return (
        <div className={`flex items-start space-x-4 p-3 rounded-lg ${!notification.read ? 'bg-background-light' : ''}`}>
            <div className={`mt-1 ${color}`}>
                <Icon name={icon} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-text-primary text-sm">{notification.title}</h4>
                    <span className="text-xs text-text-secondary">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
            </div>
            {!notification.read && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full self-center flex-shrink-0"></div>}
        </div>
    );
}

export const NotificationsPanel: React.FC = () => {
    return (
        <Card title="Notifications & Alerts">
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {NOTIFICATIONS_DATA.map(notif => (
                    <NotificationItem key={notif.id} notification={notif} />
                ))}
            </div>
        </Card>
    );
};
