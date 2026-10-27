import React from 'react';
import { Heart, Menu, Gift, Volume2, VolumeX, Bell, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Screen } from '../types';

interface TopNavProps {
  projectName: string;
  institutionName: string;
  currentScreenId: Screen;
  onNavigate: (screenIndex: number) => void;
  onOpenMenu: () => void;
  onDonateClick: () => void;
  onOpenSafePanel: () => void;
  onToggleSound: () => void;
  isSoundEnabled: boolean;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  projectName,
  institutionName,
  currentScreenId,
  onNavigate,
  onOpenMenu,
  onDonateClick,
  onOpenSafePanel,
  onToggleSound,
  isSoundEnabled,
  unreadNotifsCount,
  onOpenNotifs,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0620]/90 backdrop-blur-xl border-b border-purple-500/20 px-3 sm:px-6 py-3 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element + Heart icon) */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button 
            type="button"
            onClick={onOpenMenu}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#1D0E35] border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-800 transition active:scale-95 shadow md:hidden"
            title="Abrir Menu"
          >
            <Menu className="w-5 h-5 text-pink-400" />
          </button>

          <button 
            type="button"
            onClick={() => onNavigate(0)}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#180E2B] rounded-[14px] flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-black tracking-tight text-white whitespace-nowrap block group-hover:text-pink-300 transition">
                {projectName}
              </span>
              <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase block -mt-0.5 truncate">
                {institutionName}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Clean Navigation Links (Single-line, no wraps) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-bold text-purple-200">
          <button 
            type="button"
            onClick={() => onNavigate(0)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentScreenId === 'home' ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5' : ''
            }`}
          >
            Início
          </button>
          <button 
            type="button"
            onClick={() => onNavigate(8)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentScreenId === 'waiting_area' ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5' : ''
            }`}
          >
            Cartinhas de Natal
          </button>
          <button 
            type="button"
            onClick={() => onNavigate(9)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentScreenId === 'gallery' ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5' : ''
            }`}
          >
            Galeria de Fotos
          </button>
          <button 
            type="button"
            onClick={() => onNavigate(5)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentScreenId === 'sponsor_profile' ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5' : ''
            }`}
          >
            Padrinhos
          </button>
          <button 
            type="button"
            onClick={() => onNavigate(4)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentScreenId === 'family_profile' ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5' : ''
            }`}
          >
            Famílias Acolhedoras
          </button>
        </nav>

        {/* Zone 3: Actions Cluster (Sound, Notification, Donate PIX, Safe Panel) */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Sound Toggle */}
          <button 
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isSoundEnabled 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-purple-950/40 text-purple-400 border-purple-900/60'
            }`}
            title={isSoundEnabled ? 'Desativar Som Festivo' : 'Ativar Som Festivo'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <button 
            type="button"
            onClick={onOpenNotifs}
            className="p-2 rounded-xl bg-purple-950/50 hover:bg-purple-900 text-purple-200 border border-purple-500/30 transition relative active:scale-95"
            title="Central de Notificações"
          >
            <Bell className="w-4 h-4 text-purple-300" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center shadow">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Donate PIX Primary Action */}
          <button 
            type="button"
            onClick={onDonateClick}
            className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 hover:from-amber-400 hover:to-pink-500 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Doar PIX</span>
          </button>

          {/* Safe Admin Panel Button */}
          <button 
            type="button"
            onClick={onOpenSafePanel}
            className="p-2 rounded-xl bg-[#221038] hover:bg-[#2F164C] text-amber-300 border border-amber-500/30 transition active:scale-95 shadow"
            title="Painel Seguro (Gestão)"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
