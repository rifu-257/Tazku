import React, { useState } from 'react';
import { HelpCircle, Headphones, X, ChevronDown, Send, MessageCircle, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface FAQSupportModalProps {
  initialTab: 'faq' | 'support';
  isOpen: boolean;
  onClose: () => void;
}

export const FAQSupportModal: React.FC<FAQSupportModalProps> = ({
  initialTab,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'support'>(initialTab);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "Who qualifies as a Zakat recipient under Quranic rules?",
      a: "Surah At-Tawbah 9:60 specifies 8 categories: Al-Fuqara (the destitute), Al-Masakin (the needy), Al-Amilina Alayha (administrators), Al-Mu'allafati Qulubuhum, Fir-Riqab, Al-Gharimin (debtors in distress), Fi Sabilillah, and Ibnus-Sabil (wayfarers)."
    },
    {
      q: "What is the difference between Gold Nisab and Silver Nisab?",
      a: "Gold Nisab is 87.48 grams (~₹6.43 Lakhs), standard for gold and commercial investments. Silver Nisab is 612.36 grams (~₹56,337), classical conservative standard recommended for cash savings to maximize aid to the poor."
    },
    {
      q: "What is 'Naqlu Zakat' (transferring Zakat to another Mahal)?",
      a: "In Islamic jurisprudence, Zakat should primarily be disbursed in the locality where wealth is generated. However, it may be transferred (Naqlu Zakat) if another community suffers severe disaster or famine, or if you have impoverished relatives there."
    },
    {
      q: "What is a 'Vakeel' in Zakat distribution?",
      a: "A Vakeel is an authorized proxy (Wakil bil-Qabd) appointed by the donor or the community to take physical possession of Zakat on behalf of the poor and distribute it faithfully."
    },
    {
      q: "Does Tazku charge any administrative commission?",
      a: "Zero commission (0.00%). 100% of your Zakat reaches verified recipients directly. Operational costs are covered by community endowments (Waqf)."
    }
  ];

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setSupportMessage('');
      setSupportSubject('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E2ECE9] animate-in slide-in-from-bottom-6 space-y-4">
        {/* Header with Tab switcher */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'faq' ? 'bg-[#0D7C66] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'support' ? 'bg-[#0D7C66] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Help & Support
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Tab 1: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2.5">
            {faqs.map((f, i) => {
              const isOpen = openFAQIndex === i;
              return (
                <div
                  key={i}
                  className="bg-[#F8FAF9] rounded-2xl border border-gray-100 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQIndex(isOpen ? null : i)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-gray-900 gap-2"
                  >
                    <span>{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Help & Support */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#E8F6F3] rounded-2xl text-xs text-gray-800 space-y-1">
              <span className="font-bold text-[#0D7C66] block">Tazku Mahallu Assistance Desk</span>
              <p className="text-[11px] text-gray-600">
                Reach our Shariah advisory board or Mahallu technical support team.
              </p>
            </div>

            {/* Quick Contact Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="mailto:rifahip257@gmail.com"
                className="p-2.5 bg-[#F8FAF9] rounded-xl border border-gray-200 flex items-center gap-2 text-gray-700 hover:text-[#0D7C66]"
              >
                <Mail className="w-4 h-4 text-[#0D7C66]" />
                <span className="font-semibold text-[11px]">Email Support</span>
              </a>
              <a
                href="tel:+919800012345"
                className="p-2.5 bg-[#F8FAF9] rounded-xl border border-gray-200 flex items-center gap-2 text-gray-700 hover:text-[#0D7C66]"
              >
                <Phone className="w-4 h-4 text-[#0D7C66]" />
                <span className="font-semibold text-[11px]">Helpline</span>
              </a>
            </div>

            {/* Send Support Ticket */}
            <form onSubmit={handleSendSupport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder="e.g. Fiqh calculation inquiry, Ward registration"
                  className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Message</label>
                <textarea
                  rows={3}
                  required
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your question or difficulty..."
                  className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#0D7C66] focus:outline-hidden leading-relaxed"
                />
              </div>

              {messageSent ? (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message sent to Mahallu Support! We will reply promptly.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request to Support Team</span>
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
