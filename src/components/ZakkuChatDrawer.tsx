import React, { useState } from 'react';
import { ArrowLeft, Send, ShieldCheck, CheckCheck } from 'lucide-react';
import { MessageContact } from '../types';

interface ZakkuChatDrawerProps {
  contact: MessageContact | null;
  onClose: () => void;
  onSendMessage: (contactId: string, text: string) => void;
}

export const ZakkuChatDrawer: React.FC<ZakkuChatDrawerProps> = ({
  contact,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  if (!contact) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(contact.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-[#0D7C66] text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 font-bold flex items-center justify-center text-sm">
            {contact.avatarText}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <span>{contact.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            </h3>
            <span className="text-[10px] text-teal-100">{contact.role}</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-[#E8F6F3] p-2 text-center text-[10px] text-[#0D7C66] font-semibold border-b border-[#0D7C66]/10">
        🔒 Official Mahallu Encrypted Communication Channel
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAF9]">
        {contact.messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#0D7C66] text-white rounded-tr-xs'
                    : 'bg-white text-gray-900 border border-gray-100 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                {m.time}
                {isUser && <CheckCheck className="w-3 h-3 text-[#0D7C66]" />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${contact.name.split(' ')[0]}...`}
          className="flex-1 px-4 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-[#0D7C66] text-white flex items-center justify-center hover:bg-[#0A6654] transition disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
