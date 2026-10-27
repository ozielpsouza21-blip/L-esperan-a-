import React, { useState } from 'react';
import { BookOpen, RotateCw, Copy, Check, Sparkles } from 'lucide-react';
import { EvangelicalTheme, EvangelicalMessage } from '../types';

interface EvangelicalCardProps {
  theme: EvangelicalTheme;
  message: EvangelicalMessage;
  onCycleMessage: () => void;
  onCopySuccess: (msg: string) => void;
}

export const EvangelicalCard: React.FC<EvangelicalCardProps> = ({
  theme,
  message,
  onCycleMessage,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `"${message.verse}" - ${message.reference} (Corações que Acolhe - Lar Esperança)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onCopySuccess('Versículo bíblico copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-[28px] bg-gradient-to-r ${theme.bgGradient} border ${theme.borderColor} shadow-2xl relative overflow-hidden transition-all duration-300`}>
      {/* Decorative ambient background icon */}
      <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none text-white">
        <BookOpen className="w-36 h-36" />
      </div>

      {/* Header with Theme Title & Category */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${theme.iconBg} flex items-center justify-center shadow`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase text-amber-200 block">
              {theme.name}
            </span>
            <span className="text-[10px] text-purple-200/80 block">
              Palavra de Fé & Esperança
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme.badgeBg}`}>
            {message.category}
          </span>
          <button 
            type="button"
            onClick={onCycleMessage}
            className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition active:scale-95 shadow"
            title="Próximo Versículo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Verse text */}
      <p className={`text-xs sm:text-sm ${theme.textColor} italic leading-relaxed pt-1 relative z-10 font-medium`}>
        "{message.verse}"
      </p>

      {/* Reference & Actions */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 relative z-10">
        <span className="text-xs font-black text-amber-300">
          — {message.reference}
        </span>

        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-bold text-amber-200 hover:text-white flex items-center space-x-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <span>·</span>
          <button 
            type="button"
            onClick={onCycleMessage}
            className="text-[11px] font-bold text-amber-300 hover:underline transition"
          >
            Outra Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};
