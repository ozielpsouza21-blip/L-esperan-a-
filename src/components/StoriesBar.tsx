import React, { useState } from 'react';
import { Video, Image as ImageIcon, Play, Plus, X, Heart, Eye } from 'lucide-react';
import { Media916 } from '../types';

interface StoriesBarProps {
  stories: Media916[];
  onSelectStory: (story: Media916) => void;
  onViewAll: () => void;
  onOpenLiveCamera?: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onSelectStory,
  onViewAll,
  onOpenLiveCamera,
}) => {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="w-full pt-1 pb-2">
      <div className="flex justify-between items-center mb-2 px-0.5">
        <h3 className="text-xs font-black text-amber-300 flex items-center space-x-1.5 uppercase tracking-wide">
          <Video className="w-4 h-4 text-pink-400" />
          <span>Momentos & Histórias (9:16)</span>
        </h3>
        <button 
          onClick={onViewAll}
          className="text-[10px] text-purple-300 hover:text-pink-300 underline font-semibold transition"
        >
          Ver todas
        </button>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x scrollbar-none">
        {/* Live Camera Story Card */}
        {onOpenLiveCamera && (
          <button
            type="button"
            onClick={onOpenLiveCamera}
            className="w-24 h-38 rounded-2xl bg-gradient-to-br from-pink-950/80 via-[#2A1840] to-amber-950/80 border-2 border-dashed border-pink-500/60 shrink-0 snap-start flex flex-col items-center justify-center space-y-1.5 active:scale-95 transition shadow-lg group hover:border-pink-400"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center group-hover:scale-110 transition">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black text-white">Criar Story</span>
            <span className="text-[8px] text-pink-300">Câmera 9:16</span>
          </button>
        )}

        {/* Stories Items */}
        {stories.map((st) => (
          <div 
            key={st.id}
            onClick={() => onSelectStory(st)}
            className="w-24 h-38 rounded-2xl overflow-hidden shrink-0 snap-start border-2 border-transparent p-[1.5px] bg-gradient-to-b from-amber-400 via-pink-500 to-purple-600 relative cursor-pointer active:scale-95 transition shadow-xl group select-none pointer-events-auto"
          >
            <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-[#1A1033]">
              {st.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video src={st.url} className="w-full h-full object-cover select-none pointer-events-none" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={st.url} 
                  alt={st.title} 
                  className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition duration-500" 
                />
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent p-2 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-white truncate drop-shadow leading-tight">
                  {st.title}
                </span>
                <span className="text-[8px] text-amber-300 flex items-center space-x-1 mt-0.5">
                  {st.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                  <span>{st.type === 'video' ? 'Vídeo' : 'Foto'}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
