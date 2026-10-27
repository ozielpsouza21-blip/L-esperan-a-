import React, { useState } from 'react';
import { X, Gift, Copy, Check, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface DonationPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixKey: string;
  pixBankName: string;
  pixQrCode: string;
  donationCustomMessage: string;
  onCopySuccess: (msg: string) => void;
}

export const DonationPixModal: React.FC<DonationPixModalProps> = ({
  isOpen,
  onClose,
  pixKey,
  pixBankName,
  pixQrCode,
  donationCustomMessage,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopied(true);
    onCopySuccess('Chave PIX copiada com sucesso para a área de transferência!');
    setTimeout(() => setCopied(false), 2500);
  };

  const amounts = [
    { value: 30, label: 'R$ 30', desc: 'Kit de doces e carinho' },
    { value: 50, label: 'R$ 50', desc: 'Calçado novinho de Natal' },
    { value: 100, label: 'R$ 100', desc: 'Roupa completa + brinquedo' },
    { value: 250, label: 'R$ 250', desc: 'Apoio mensal de acolhimento' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#180E2B] text-white rounded-[32px] p-5 sm:p-6 border-2 border-amber-500/40 shadow-2xl space-y-4 my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-purple-900/60 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Doação via PIX Instantâneo</h3>
              <p className="text-[10px] text-amber-300 font-semibold">Lar Esperança · Solidariedade Real</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 transition active:scale-95"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inspiring Shelter Message */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/60 to-amber-950/60 border border-amber-500/30 text-xs text-purple-100 italic leading-relaxed text-center shadow-inner relative z-10">
          "{donationCustomMessage}"
        </div>

        {/* Quick Amount Suggestion Buttons */}
        <div className="space-y-1.5 relative z-10">
          <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
            Escolha um valor ou doe o que puder:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {amounts.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedAmount(item.value)}
                className={`p-2.5 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                  selectedAmount === item.value
                    ? 'bg-gradient-to-r from-pink-600 to-amber-500 border-amber-300 text-white shadow-lg'
                    : 'bg-[#22133B] border-purple-500/30 text-purple-200 hover:border-purple-400'
                }`}
              >
                <span className="text-sm font-black">{item.label}</span>
                <span className="text-[9px] opacity-90 truncate">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Frame */}
        <div className="text-center space-y-2.5 relative z-10">
          <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-3xl shadow-2xl border-4 border-amber-400/60 select-none flex items-center justify-center">
            <img 
              src={pixQrCode} 
              alt="QR Code PIX Lar Esperança" 
              className="w-full h-full object-contain select-none pointer-events-none" 
            />
          </div>
          <span className="text-[10px] text-purple-300 font-medium block">
            Abra o app do seu banco e aponte a câmera para o QR Code acima
          </span>
        </div>

        {/* Bank & Key Details */}
        <div className="bg-[#24133A] p-3.5 rounded-2xl border border-purple-500/40 space-y-1.5 relative z-10">
          <div className="flex justify-between items-center text-[10px] text-purple-300">
            <span>Instituição:</span>
            <span className="font-bold text-white">{pixBankName}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-purple-300">
            <span>Chave PIX:</span>
            <span className="font-bold text-amber-300 select-all font-mono">{pixKey}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          className={`w-full py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl active:scale-95 transition flex items-center justify-center space-x-2 relative z-10 ${
            copied 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:from-amber-400 hover:to-pink-500 text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Chave PIX Copiada com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Chave PIX (Pix Copia e Cola)</span>
            </>
          )}
        </button>

        {/* Trust badge */}
        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-emerald-400/90 pt-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Doação 100% segura e direta para as crianças acolhidas</span>
        </div>
      </div>
    </div>
  );
};
