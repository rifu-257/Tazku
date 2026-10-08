import React from 'react';
import { Bell, X, CheckCircle2, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { NotificationItem } from '../types';

interface ZakkuNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const ZakkuNotificationDrawer: React.FC<ZakkuNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-b-[2.5rem] sm:rounded-3xl p-5 shadow-2xl border border-[#EBE5D8] animate-in slide-in-from-top-4 duration-200 mt-0 sm:mt-12">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE5D8]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E9F3ED] text-[#1B4332] rounded-xl font-bold">
              <Bell className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-[#112A20]">Mahallu Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-[#40916C] hover:text-[#1B4332] hover:underline cursor-pointer"
            >
              Mark read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#EBE5D8] max-h-80 overflow-y-auto mt-2">
          {notifications.map((n) => (
            <div key={n.id} className="py-3 px-1 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5 border border-[#40916C]/20">
                {n.type === 'disbursement' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#40916C]" />
                ) : n.type === 'approval' ? (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                ) : (
                  <FileText className="w-4 h-4 text-[#1B4332]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#112A20] truncate">{n.title}</h4>
                  <span className="text-[10px] text-[#526059]">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#526059] mt-0.5 line-clamp-2 leading-relaxed">
                  {n.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
