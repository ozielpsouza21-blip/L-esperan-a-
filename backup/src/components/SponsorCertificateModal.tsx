import React from 'react';
import { X, Award, Heart, Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Child, UserProfile } from '../types';

interface SponsorCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  sponsorUser: UserProfile;
  institutionName: string;
}

export const SponsorCertificateModal: React.FC<SponsorCertificateModalProps> = ({
  isOpen,
  onClose,
  child,
  sponsorUser,
  institutionName,
}) => {
  if (!isOpen || !child) return null;

  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#FFFDF7] text-[#2C1810] rounded-[36px] p-6 sm:p-8 border-4 border-[#C88A42] shadow-2xl my-auto overflow-hidden flex flex-col space-y-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#E5D2B3] hover:bg-[#D4BC96] text-[#4A2810] transition active:scale-95 z-20 shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Emblem */}
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-1 shadow-xl flex items-center justify-center">
          <div className="w-full h-full bg-[#FAF5E8] rounded-full flex items-center justify-center border border-[#C88A42]">
            <Award className="w-8 h-8 text-[#B83A4B]" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest font-black text-[#A05C2B]">
            Certificado de Honra ao Mérito
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#381B0F] tracking-tight">
            Padrinho do Coração
          </h2>
          <p className="text-xs text-[#8A522C] font-semibold">
            {institutionName} · Campanha de Natal 2026
          </p>
        </div>

        {/* Main Certificate Text */}
        <div className="p-4 rounded-2xl bg-[#F8EFE0] border border-[#DECDB0] space-y-2.5 text-xs text-[#422212] leading-relaxed">
          <p>
            Certificamos com imensa alegria e gratidão que
          </p>
          <p className="text-base sm:text-lg font-black text-[#7A1D2A] uppercase tracking-wide">
            {sponsorUser.name || 'Padrinho Solidário'}
          </p>
          <p>
            assumiu com amor e generosidade o apadrinhamento de
          </p>
          <p className="text-base sm:text-lg font-black text-[#A03548]">
            {child.name}
          </p>
          <p className="text-[11px] text-[#784628] italic">
            "Seu gesto acolhedor transforma vidas, semeia esperança e faz brilhar a verdadeira luz do Natal no coração de uma criança."
          </p>
        </div>

        {/* Date and Signatures */}
        <div className="pt-2 flex justify-between items-end border-t border-[#DECDB0] text-left text-[11px] text-[#7A4B29]">
          <div>
            <span className="block font-bold">Data de Emissão:</span>
            <span>{todayFormatted}</span>
          </div>
          <div className="text-right">
            <span className="block font-black text-[#381B0F]">Coordenação Geral</span>
            <span className="text-[10px] text-[#8C5532]">Lar Esperança</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            window.print ? window.print() : null;
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-pink-600 to-amber-600 text-white font-black text-xs shadow-xl active:scale-95 transition flex items-center justify-center space-x-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Imprimir / Salvar Certificado</span>
        </button>
      </div>
    </div>
  );
};
