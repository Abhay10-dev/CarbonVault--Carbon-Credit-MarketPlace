import React from 'react';
import { X, Check, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { formatDateTime } from '@/lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen || !user) return null;

  const userNotifications = notifications
    .filter(n => n.userId === user.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    info: <Info className="w-4 h-4 text-blue-600" />,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-forest-100 text-forest-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead(user.id)}
                  className="text-xs text-forest-700 hover:text-forest-800 font-medium flex items-center gap-1 hover:underline"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {userNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              userNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-gray-50 flex gap-3 ${
                    !notification.read ? 'bg-forest-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{iconMap[notification.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4
                        className={`text-sm ${
                          !notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                        {formatDateTime(notification.date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
