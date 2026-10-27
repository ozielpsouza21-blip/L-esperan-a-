import React, { useState } from 'react';
import { Heart, Search, Gift, X, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { Child } from '../types';

interface ChildrenSectionProps {
  childrenList: Child[];
  onSelectChild: (child: Child) => void;
  onSponsorChild: (childId: string) => void;
  onZoomImage: (url: string) => void;
  getAgeDisplay: (birthDate?: string, age?: number | string) => string;
}

export const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  childrenList,
  onSelectChild,
  onSponsorChild,
  onZoomImage,
  getAgeDisplay,
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
      // 0 to 11 months
      if (child.age !== 0 && !child.birthDate) return false;
      if (child.age > 0) return false;
    } else if (ageFilter === 'small') {
      // 1 to 6 years
      if (child.age < 1 || child.age > 6) return false;
    } else if (ageFilter === 'kids') {
      // 7 to 12 years
      if (child.age < 7 || child.age > 12) return false;
    } else if (ageFilter === 'teens') {
      // 13+ years
      if (child.age < 13) return false;
    }

    return true;
  });

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
            {childrenList.length} crianças cadastradas esperando amor e presentes de Natal
          </p>
        </div>
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

      {/* Children Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChildren.map((child) => {
            const isSponsored = child.status === 'Apadrinhado';
            return (
              <div 
                key={child.id}
                className="p-3.5 sm:p-4 rounded-[28px] bg-gradient-to-b from-[#221338] to-[#160B28] border border-purple-500/30 hover:border-pink-500/60 shadow-xl flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  {/* Image with zoom and status overlay */}
                  <div 
                    className="w-full aspect-square rounded-[22px] overflow-hidden border-2 border-pink-500/40 relative mb-3 cursor-pointer shadow-md select-none group"
                    onClick={() => onZoomImage(child.image)}
                    title="Toque para ampliar foto"
                  >
                    <img 
                      src={child.image} 
                      alt={child.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 select-none pointer-events-none"
                    />
                    
                    {/* Floating Status Badge */}
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase shadow-lg ${
                      isSponsored 
                        ? 'bg-emerald-500 text-white border border-emerald-300/40' 
                        : 'bg-amber-400 text-black border border-amber-300 font-black'
                    }`}>
                      {isSponsored ? 'Apadrinhada' : 'Aguardando'}
                    </span>

                    {/* Age Pill on Image */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-extrabold shadow">
                      {getAgeDisplay(child.birthDate, child.age)}
                    </span>
                  </div>

                  {/* Child Info */}
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-black text-white truncate">
                      {child.name}
                    </h4>

                    {/* Desired Gift or Dream */}
                    <div className="text-[11px] text-amber-300 font-semibold flex items-center space-x-1 truncate">
                      <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">
                        {child.desiredGift || child.dream || 'Presente de Natal'}
                      </span>
                    </div>

                    {/* Sizing badges if available */}
                    {(child.shoeSize || child.clothesSize) && (
                      <div className="flex items-center space-x-1.5 pt-1 text-[10px] text-purple-300">
                        {child.clothesSize && (
                          <span className="bg-[#140824] px-2 py-0.5 rounded-md border border-purple-500/20">
                            Roupa: <strong>{child.clothesSize}</strong>
                          </span>
                        )}
                        {child.shoeSize && (
                          <span className="bg-[#140824] px-2 py-0.5 rounded-md border border-purple-500/20">
                            Nº <strong>{child.shoeSize}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Short Letter Preview */}
                    <p className="text-[10px] sm:text-[11px] text-purple-200 line-clamp-2 italic pt-1 leading-snug">
                      "{child.letter}"
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-3 border-t border-purple-900/40 mt-3">
                  <button
                    type="button"
                    onClick={() => onSelectChild(child)}
                    className="w-full py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-pink-200 font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center space-x-1.5 border border-purple-500/30"
                  >
                    <span>Ler Cartinha de Natal</span>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
                  </button>

                  {!isSponsored ? (
                    <button
                      type="button"
                      onClick={() => onSponsorChild(child.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center space-x-1"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Quero Apadrinhar!</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] text-center flex items-center justify-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Apadrinhada</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
