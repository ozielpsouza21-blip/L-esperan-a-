import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Gift } from 'lucide-react';
import { BannerSlide } from '../types';

interface HeroCarouselProps {
  banners: BannerSlide[];
  onAdoptClick: () => void;
  onDonateClick: () => void;
  onZoomImage: (url: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  banners,
  onAdoptClick,
  onDonateClick,
  onZoomImage,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length, isAutoPlay]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[activeIndex] || banners[0];

  return (
    <div 
      className="relative w-full rounded-[32px] overflow-hidden shadow-2xl border border-purple-500/30 group bg-[#160B28]"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      onTouchStart={() => setIsAutoPlay(false)}
      onTouchEnd={() => setIsAutoPlay(true)}
    >
      {/* Banner Image Container */}
      <div 
        className="relative w-full h-56 sm:h-64 md:h-72 cursor-pointer select-none pointer-events-auto"
        onClick={() => onZoomImage(currentBanner.image)}
      >
        <img 
          src={currentBanner.image} 
          alt={currentBanner.title} 
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
        />

        {/* Cinematic Scrim Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-5 sm:p-7 flex flex-col justify-end">
          
          {/* Badge & Movement Indicator */}
          <div className="flex items-center space-x-2 mb-2">
            {currentBanner.badge && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-amber-500 text-white text-[10px] sm:text-xs font-black shadow-md tracking-wider uppercase">
                {currentBanner.badge}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-amber-300 text-[10px] font-semibold flex items-center space-x-1.5 backdrop-blur-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Destaque Oficial</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg leading-tight max-w-xl">
            {currentBanner.title}
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 line-clamp-2 max-w-lg leading-relaxed drop-shadow">
            {currentBanner.subtitle}
          </p>

          {/* Quick Action Buttons inside the hero banner */}
          <div className="flex items-center space-x-2.5 mt-3 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdoptClick();
              }}
              className="py-2 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold text-[11px] sm:text-xs shadow-xl active:scale-95 transition flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Adotar Cartinha</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDonateClick();
              }}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-[11px] sm:text-xs border border-white/30 active:scale-95 transition flex items-center space-x-1.5"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>Apoiar com PIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Slide Controls */}
      {banners.length > 1 && (
        <>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-black/60 hover:bg-pink-600/90 text-white transition active:scale-95 shadow-lg z-10 opacity-70 group-hover:opacity-100"
            title="Slide Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev + 1) % banners.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-black/60 hover:bg-pink-600/90 text-white transition active:scale-95 shadow-lg z-10 opacity-70 group-hover:opacity-100"
            title="Próximo Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-5 flex items-center space-x-1.5 z-10">
            {banners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(dotIdx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  dotIdx === activeIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
