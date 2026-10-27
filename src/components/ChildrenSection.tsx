import React, { useState } from 'react';
import { Heart, Search, Gift, X, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { Child } from '../types';

interface ChildrenSectionProps {
  childrenList: Child[];
  onSelectChild: (child: Child) => void;
  onSponsorChild: (childId: string) => void;
  onZoomImage: (url: string) => void;
  getAgeDisplay: (birthDate?: string, age?: number | string) => string;
  isHome?: boolean;
  limit?: number;
  onViewAll?: () => void;
}

export const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  childrenList,
  onSelectChild,
  onSponsorChild,
  onZoomImage,
  getAgeDisplay,
  isHome = false,
  limit,
  onViewAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'sponsored'>('all');
  const [ageFilter, setAgeFilter] = useState<'all' | 'babies' | 'small' | 'kids' | 'teens'>('all');

  // Filter logic
  const filteredChildren = childrenList.filter((child) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        child.name.toLowerCase().includes(q) ||
        (child.desiredGift && child.desiredGift.toLowerCase().includes(q)) ||
        child.dream.toLowerCase().includes(q) ||
        child.letter.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status filter
    if (statusFilter === 'waiting' && child.status !== 'Aguardando Apadrinhamento') return false;
    if (statusFilter === 'sponsored' && child.status !== 'Apadrinhado') return false;

    // Age filter
    if (ageFilter === 'babies') {
      if (child.age !== 0 && !child.birthDate) return false;
      if (child.age > 0) return false;
    } else if (ageFilter === 'small') {
      if (child.age < 1 || child.age > 6) return false;
    } else if (ageFilter === 'kids') {
      if (child.age < 7 || child.age > 12) return false;
    } else if (ageFilter === 'teens') {
      if (child.age < 13) return false;
    }

    return true;
  });

  const displayedChildren = (isHome && limit && limit > 0) 
    ? filteredChildren.slice(0, limit) 
    : filteredChildren;

  return (
    <div className="w-full space-y-4 pt-1 pb-4">
      {/* Section Title with count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span>Adote uma Cartinha · Crianças Acolhidas</span>
          </h3>
          <p className="text-xs text-purple-300 mt-0.5">
            {childrenList.length} crianças aprovadas para apadrinhamento público (18 no total do Lar Esperança)
          </p>
        </div>
        {isHome && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs text-pink-400 hover:text-pink-300 font-bold underline flex items-center space-x-1 transition self-start sm:self-center"
          >
            <span>Ver todas ({childrenList.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Bar & Status Filters */}
      <div className="space-y-2.5">
        <div className="relative flex items-center bg-[#1A1033] border border-purple-500/30 focus-within:border-pink-500 rounded-2xl px-3.5 py-3 shadow transition">
          <Search className="w-4 h-4 text-pink-400 mr-2.5 shrink-0" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, sonho ou presente (ex: bola, skate, boneca)..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-purple-400 focus:outline-none"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-purple-400 hover:text-white transition"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
              statusFilter === 'all' 
                ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white shadow' 
                : 'bg-[#22133B] text-purple-300 border border-purple-500/25 hover:border-purple-400'
            }`}
          >
            Todas ({childrenList.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('waiting')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
              statusFilter === 'waiting' 
                ? 'bg-amber-500 text-black shadow font-black' 
                : 'bg-[#22133B] text-purple-300 border border-purple-500/25 hover:border-purple-400'
            }`}
          >
            Aguardando ({childrenList.filter(c => c.status === 'Aguardando Apadrinhamento').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('sponsored')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
              statusFilter === 'sponsored' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'bg-[#22133B] text-purple-300 border border-purple-500/25 hover:border-purple-400'
            }`}
          >
            Apadrinhadas ({childrenList.filter(c => c.status === 'Apadrinhado').length})
          </button>
        </div>

        {/* Age Segment Filter Chips */}
        <div className="flex items-center space-x-1.5 text-[11px] overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-purple-400 uppercase font-bold mr-1 shrink-0">Idade:</span>
          {[
            { id: 'all', label: 'Todas as Idades' },
            { id: 'babies', label: 'Bebês (0 a 11m)' },
            { id: 'small', label: '1 a 6 anos' },
            { id: 'kids', label: '7 a 12 anos' },
            { id: 'teens', label: '13+ anos' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setAgeFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                ageFilter === f.id
                  ? 'bg-purple-700 text-white font-bold'
                  : 'bg-[#180E2B] text-purple-400 hover:text-purple-200 border border-purple-500/15'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Children Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      {filteredChildren.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#1A1033] border border-purple-500/20 text-center space-y-2">
          <Heart className="w-10 h-10 text-purple-400 mx-auto opacity-50" />
          <h4 className="text-sm font-bold text-white">Nenhuma criança encontrada</h4>
          <p className="text-xs text-purple-300">
            Tente mudar os termos da busca ou os filtros de idade.
          </p>
          <button 
            type="button"
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setAgeFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs mt-2"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayedChildren.map((child) => {
              const isSponsored = child.status === 'Apadrinhado';
              return (
                <div 
                  key={child.id}
                  className="p-3 sm:p-3.5 rounded-[24px] sm:rounded-[28px] bg-gradient-to-b from-[#24133A] via-[#1C0E30] to-[#140824] border-2 border-pink-500/40 hover:border-pink-400/80 shadow-2xl flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    {/* Vertical 9:16 Photo Container matching video reel format */}
                    <div 
                      className="w-full aspect-[9/16] rounded-[20px] overflow-hidden border border-pink-500/60 relative mb-2.5 cursor-pointer shadow-lg select-none group bg-black/40"
                      onClick={() => onZoomImage(child.image)}
                      title="Toque para ampliar foto"
                    >
                      <img 
                        src={child.image} 
                        alt={child.name} 
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 select-none pointer-events-none"
                      />

                      {/* Gradient shadow overlay for text/badge readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />
                      
                      {/* Floating Status Badge (Bottom Right, matching screenshots) */}
                      <span className={`absolute bottom-2.5 right-2 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-wide uppercase shadow-lg ${
                        isSponsored 
                          ? 'bg-emerald-500 text-white border border-emerald-300/40' 
                          : 'bg-amber-400 text-black border border-amber-300 font-black'
                      }`}>
                        {isSponsored ? 'Apadrinhada' : 'ESPERA'}
                      </span>
                    </div>

                    {/* Child Info */}
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-black text-white truncate">
                          {child.name}
                        </h4>
                        <span className="text-[10px] text-purple-300 font-bold shrink-0">
                          {getAgeDisplay(child.birthDate, child.age)}
                        </span>
                      </div>

                      {/* Desired Gift or Dream */}
                      <div className="text-[10px] sm:text-[11px] text-amber-300 font-semibold flex items-center space-x-1 truncate">
                        <Gift className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">
                          {child.desiredGift || child.dream || 'Presente de Natal'}
                        </span>
                      </div>

                      {/* Sizing badges if available */}
                      {(child.shoeSize || child.clothesSize) && (
                        <div className="flex items-center space-x-1 pt-0.5 text-[9px] text-purple-300">
                          {child.clothesSize && (
                            <span className="bg-[#140824] px-1.5 py-0.5 rounded-md border border-purple-500/20 truncate">
                              Roupa: <strong>{child.clothesSize}</strong>
                            </span>
                          )}
                          {child.shoeSize && (
                            <span className="bg-[#140824] px-1.5 py-0.5 rounded-md border border-purple-500/20 truncate">
                              Nº <strong>{child.shoeSize}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions: Purple "VER CARTA" button matching original screenshots */}
                  <div className="space-y-1.5 pt-2.5 border-t border-purple-900/40 mt-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectChild(child)}
                      className="w-full py-2 px-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-pink-200 hover:text-white font-extrabold text-[10px] sm:text-xs shadow-md active:scale-95 transition flex items-center justify-center space-x-1 border border-purple-500/30 text-center uppercase tracking-wider"
                      title="Ver Detalhes e Cartinha"
                    >
                      <span>VER CARTA</span>
                    </button>

                    {!isSponsored ? (
                      <button
                        type="button"
                        onClick={() => onSponsorChild(child.id)}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold text-[9px] sm:text-[10px] shadow active:scale-95 transition flex items-center justify-center space-x-1 text-center"
                        title="Apadrinhar esta criança"
                      >
                        <Heart className="w-3 h-3 fill-white shrink-0" />
                        <span>Apadrinhar</span>
                      </button>
                    ) : (
                      <div className="py-1 px-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-[9px] text-center flex items-center justify-center space-x-1">
                        <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>Apadrinhada</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prominent "Ver Todos" button for Home screen when limited */}
          {isHome && onViewAll && filteredChildren.length > (limit || 4) && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewAll}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2A1840] via-[#32184E] to-[#201036] hover:from-[#361E54] hover:to-[#2A1448] text-purple-200 hover:text-white font-extrabold text-xs sm:text-sm border-2 border-pink-500/40 hover:border-pink-400 shadow-xl active:scale-95 transition flex items-center justify-center space-x-2"
              >
                <span>+ {filteredChildren.length - (limit || 4)} outras crianças (Ver Todas)</span>
                <ChevronRight className="w-4 h-4 text-pink-400" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


