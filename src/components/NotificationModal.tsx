import React from 'react';
import { X, Bell, Sparkles, Heart, Check, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { LocalAppNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: LocalAppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectNotificationChild?: (childId: string) => void;
  onRequestNativePermission: () => void;
  nativePermission: NotificationPermission;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectNotificationChild,
  onRequestNativePermission,
  nativePermission,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#180E2B] text-white rounded-[32px] p-5 sm:p-6 border border-purple-500/40 shadow-2xl space-y-4 my-auto overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-purple-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Central de Notificações</h3>
              <p className="text-[10px] text-purple-300 font-medium">Alertas de apadrinhamento e novas cartinhas</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-purple-900/60 text-purple-200 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Native Notification Permission Box */}
        {nativePermission !== 'granted' && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] text-amber-200">
                Receba alertas no seu celular quando uma nova criança chegar!
              </span>
            </div>
            <button
              onClick={onRequestNativePermission}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-[10px] shrink-0 active:scale-95 transition shadow"
            >
              Ativar
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bell className="w-10 h-10 text-purple-400 mx-auto opacity-40" />
              <p className="text-xs text-purple-300">Nenhuma notificação no momento.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => {
                  if (notif.childId && onSelectNotificationChild) {
                    onSelectNotificationChild(notif.childId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition active:scale-[0.99] cursor-pointer ${
                  notif.read 
                    ? 'bg-[#1F1235]/60 border-purple-900/40 text-purple-300' 
                    : 'bg-gradient-to-r from-[#2B1544] to-[#1F1035] border-pink-500/40 text-white shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {notif.type === 'new_child' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
                    {notif.type === 'status_change' && <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />}
                    {notif.type === 'system' && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
                  </div>
                  <span className="text-[9px] text-purple-400 shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug pl-6">
                  {notif.body}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        {notifications.length > 0 && (
          <div className="pt-2 border-t border-purple-900/60 flex items-center justify-between text-[11px]">
            <button
              onClick={onMarkAllAsRead}
              className="text-pink-400 hover:text-pink-300 font-bold transition flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Marcar todas como lidas</span>
            </button>
            <button
              onClick={onClearNotifications}
              className="text-purple-400 hover:text-red-400 font-medium transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
