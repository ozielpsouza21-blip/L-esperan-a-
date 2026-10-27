import React, { useState } from 'react';
import { X, Heart, Gift, Share2, Sparkles, User, Calendar, Check, Award, ZoomIn, FileText, Camera } from 'lucide-react';
import { Child } from '../types';

interface LetterModalProps {
  child: Child | null;
  onClose: () => void;
  onSponsor: (childId: string) => void;
  onZoomImage: (url: string) => void;
  getAgeDisplay: (birthDate?: string, age?: number | string) => string;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  child,
  onClose,
  onSponsor,
  onZoomImage,
  getAgeDisplay,
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'letter'>('photo');

  if (!child) return null;

  const isSponsored = child.status === 'Apadrinhado';

  const handleShareWhatsApp = () => {
    const text = `Oi! Conheci a cartinha de Natal da ${child.name} (${getAgeDisplay(child.birthDate, child.age)}) no projeto Corações que Acolhe - Lar Esperança! O sonho dela é: "${child.desiredGift || child.dream}". Vamos apadrinhar e fazer o Natal dela inesquecível?`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#FAF5E8] text-[#2C1810] rounded-[32px] p-5 sm:p-7 shadow-2xl border-4 border-[#E2CA9E] my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Postal Stamp */}
        <div className="absolute top-4 right-14 sm:right-16 rotate-6 select-none pointer-events-none opacity-90 hidden sm:flex flex-col items-center border-2 border-dashed border-[#B83A4B] p-2 rounded-xl bg-[#FFF9EE] shadow-sm">
          <div className="flex items-center space-x-1 text-[9px] font-black uppercase text-[#B83A4B] tracking-wider">
            <Heart className="w-3 h-3 fill-[#B83A4B]" />
            <span>Natal Solidário</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#781D2A] mt-0.5">2026</span>
          <span className="text-[8px] text-[#A66E4E]">Lar Esperança</span>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#E5D2B3] hover:bg-[#D4BC96] text-[#4A2810] transition active:scale-95 z-20 shadow"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto pr-1 space-y-4">
          
          {/* Header with Child Info */}
          <div className="pb-3 border-b-2 border-[#E5D2B3]/80">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-[#E8D4B4] text-[#693816] inline-block mb-1">
                Cartinha & Foto Oficial do Lar
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isSponsored ? 'bg-emerald-600 text-white' : 'bg-[#D97706] text-white'
              }`}>
                {isSponsored ? 'Apadrinhada ❤️' : 'Aguardando ⭐'}
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-[#381B0F] tracking-tight truncate font-['Plus_Jakarta_Sans'] mt-1">
              {child.name}
            </h3>
            <p className="text-xs text-[#7A4B29] font-semibold mt-0.5">
              {getAgeDisplay(child.birthDate, child.age)} · {child.gender || 'Infantil'}
            </p>
          </div>

          {/* View Mode Toggle: Foto de Dentro vs Cartinha Escrita */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#E8D7B8] text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'photo'
                  ? 'bg-[#381B0F] text-amber-200 shadow-md'
                  : 'text-[#693816] hover:text-[#381B0F]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto de Dentro</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('letter')}
              className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'letter'
                  ? 'bg-[#381B0F] text-amber-200 shadow-md'
                  : 'text-[#693816] hover:text-[#381B0F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cartinha de Natal</span>
            </button>
          </div>

          {/* TAB 1: FOTO DE DENTRO (Full Portrait Presentation, uncropped with zoom) */}
          {activeTab === 'photo' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div 
                className="w-full aspect-[4/5] max-h-80 sm:max-h-96 rounded-2xl overflow-hidden border-2 border-[#C88A42] shadow-xl relative cursor-pointer group bg-black/30 flex items-center justify-center"
                onClick={() => onZoomImage(child.image)}
                title="Toque para ver em tela cheia com zoom"
              >
                <img 
                  src={child.image} 
                  alt={child.name} 
                  className="w-full h-full object-cover object-top sm:object-[center_15%] group-hover:scale-105 transition duration-500"
                />

                {/* Floating Zoom Indicator Button */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg border border-white/20 transition">
                  <ZoomIn className="w-4 h-4 text-amber-300" />
                  <span>Ver em Tela Cheia</span>
                </div>
              </div>

              {/* Presente Desejado & Destaque do Sonho */}
              {child.desiredGift && (
                <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8D7B8] flex items-center space-x-2.5 text-xs text-[#522912] shadow-sm">
                  <Gift className="w-5 h-5 text-[#B83A4B] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A522C] block">Sonho de Natal:</span>
                    <strong className="text-sm font-black text-[#962635]">{child.desiredGift}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CARTINHA DE NATAL (Parchment Styled with handwritten letter) */}
          {activeTab === 'letter' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF7] border border-[#E8D7B8] shadow-inner relative space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#8A522C] border-b border-[#E8D7B8]/70 pb-1.5">
                  <span className="italic flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Querido Papai Noel & Padrinho do Coração:</span>
                  </span>
                </div>

                <p className="font-letter text-2xl sm:text-3xl text-[#2B170F] leading-snug whitespace-pre-line tracking-wide">
                  "{child.letter || 'Gostaria muito de ganhar um presente especial neste Natal para ficar muito feliz!'}"
                </p>

                {child.desiredGift && (
                  <div className="pt-2 border-t border-[#E8D7B8]/60 flex items-center space-x-2 text-xs font-semibold text-[#663518]">
                    <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Presente dos Sonhos: <strong className="text-[#962635] font-black">{child.desiredGift}</strong></span>
                  </div>
                )}
              </div>

              {/* Wishlist Items if available */}
              {child.wishlist && child.wishlist.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#F4E9D4] border border-[#DECDB0] space-y-2">
                  <h4 className="text-xs font-black text-[#4E2712] uppercase tracking-wider flex items-center space-x-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#B83A4B]" />
                    <span>Sugestões de Presente / Lista de Desejos:</span>
                  </h4>
                  <div className="space-y-1.5">
                    {child.wishlist.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1 px-2.5 rounded-lg bg-white/70 border border-[#DFCEB1]">
                        <span className="font-semibold text-[#381B0F]">{item.name}</span>
                        {item.price > 0 && (
                          <span className="font-bold text-[#8C2433]">Aprox. R$ {item.price.toFixed(2)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sizing & Dream Highlights (Shared across tabs) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            {child.clothesSize && (
              <div className="p-2 rounded-xl bg-[#F0E4CE] border border-[#DFCEB1] text-center">
                <span className="text-[9px] font-bold text-[#7A4B29] uppercase tracking-wider block">Roupa</span>
                <span className="text-xs font-black text-[#381B0F] mt-0.5 block">{child.clothesSize}</span>
              </div>
            )}
            {child.shoeSize && (
              <div className="p-2 rounded-xl bg-[#F0E4CE] border border-[#DFCEB1] text-center">
                <span className="text-[9px] font-bold text-[#7A4B29] uppercase tracking-wider block">Calçado</span>
                <span className="text-xs font-black text-[#381B0F] mt-0.5 block">Nº {child.shoeSize}</span>
              </div>
            )}
            {child.dream && (
              <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-[#F0E4CE] border border-[#DFCEB1] text-center">
                <span className="text-[9px] font-bold text-[#7A4B29] uppercase tracking-wider block">Maior Sonho</span>
                <span className="text-xs font-black text-[#381B0F] mt-0.5 block truncate">{child.dream}</span>
              </div>
            )}
          </div>

          {/* Sponsor Status or Message */}
          {isSponsored && child.sponsorName && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2.5 shadow-sm">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-black block">Apadrinhada por {child.sponsorName}</span>
                <span className="text-[11px] text-emerald-800">Esta criança já tem um padrinho abençoado!</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E5D2B3] flex items-center space-x-2 mt-2">
          {!isSponsored ? (
            <button
              onClick={() => {
                onSponsor(child.id);
                onClose();
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#C23145] via-[#D93D54] to-[#B82B3E] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl active:scale-95 transition flex items-center justify-center space-x-2 border border-[#E66275]"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Quero Apadrinhar {child.name}!</span>
            </button>
          ) : (
            <div className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center space-x-1.5 shadow">
              <Check className="w-4 h-4" />
              <span>Criança Já Apadrinhada</span>
            </div>
          )}

          <button
            onClick={handleShareWhatsApp}
            className="p-3.5 rounded-2xl bg-[#E8D4B4] hover:bg-[#DBC39E] text-[#42200E] font-bold text-xs transition active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 shadow"
            title="Compartilhar no WhatsApp"
          >
            <Share2 className="w-4 h-4 text-[#8A3B1B]" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>

      </div>
    </div>
  );
};

