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
      <div className="bg-[#1B4332] text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 font-bold flex items-center justify-center text-sm">
            {contact.avatarText}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <span>{contact.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#E9F3ED]" />
            </h3>
            <span className="text-[10px] text-[#F3EFE6]">{contact.role}</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-[#E9F3ED] p-2 text-center text-[10px] text-[#1B4332] font-semibold border-b border-[#40916C]/20">
        🔒 Official Mahallu Encrypted Communication Channel
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBF9]">
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
                    ? 'bg-[#1B4332] text-white rounded-tr-xs'
                    : 'bg-white text-[#112A20] border border-[#EBE5D8] rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#526059] mt-1 px-1 flex items-center gap-1">
                {m.time}
                {isUser && <CheckCheck className="w-3 h-3 text-[#40916C]" />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EBE5D8] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${contact.name.split(' ')[0]}...`}
          className="flex-1 px-4 py-2.5 bg-[#FBFBF9] border border-[#EBE5D8] rounded-full text-xs text-[#112A20] placeholder-[#526059] focus:bg-white focus:border-[#40916C] focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition disabled:opacity-40 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
