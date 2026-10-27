/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Users, Gift, Image as ImageIcon, User, Settings, LogOut, 
  ChevronRight, ChevronLeft, ArrowLeft, ShieldCheck, Clock, CheckCircle2, Plus, 
  ChevronUp, ChevronDown, GripVertical, RotateCcw,
  Camera, Video, Edit3, Smartphone, Sparkles, Menu, Eye, EyeOff,
  Filter, RotateCw, Crop, Sliders, Check, AlertCircle, Share2, Download,
  Layers, Play, ArrowRight, Home, Trash2, Save, Upload, Search, ZoomIn, X, Lock, QrCode, Copy, Key, LayoutDashboard,
  Volume2, VolumeX, MoveLeft, MoveRight, Cloud, Flame, Bell, Star, UserMinus, UserCheck,
  Compass, PartyPopper, BookOpen, HeartHandshake, TrendingUp, DollarSign, WifiOff, Wifi, Crown,
  Fingerprint, Mail, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

import { 
  Child, 
  Screen, 
  LocalAppNotification, 
  BannerSlide, 
  Media916, 
  FooterButton, 
  UserProfile, 
  EvangelicalTheme, 
  EvangelicalMessage, 
  SocialLink 
} from './types';

import { 
  INITIAL_EVANGELICAL_THEMES,
  INITIAL_EVANGELICAL_MESSAGES,
  INITIAL_BANNERS,
  INITIAL_STORIES_916,
  INITIAL_CHILDREN,
  INITIAL_PROFILES,
  INITIAL_FOOTER_BUTTONS,
  INITIAL_SOCIAL_LINKS
} from './data/initialData';

import { 
  supabase, 
  fetchAllSupabaseData, 
  createKidInSupabase, 
  updateKidInSupabase, 
  deleteKidInSupabase, 
  updateProfileInSupabase, 
  deleteProfileInSupabase,
  uploadGalleryPhotoToSupabase,
  deleteGalleryPhotoFromSupabase,
  updateSiteSettingsInSupabase,
  createProfileInSupabase,
  GalleryPhotoRecord,
  DEFAULT_ADMIN_PROFILE_ID, 
  DEFAULT_FAMILY_PROFILE_ID, 
  DEFAULT_SPONSOR_PROFILE_ID, 
  testSupabaseConnection 
} from './lib/supabase';

import { TopNav } from './components/TopNav';
import { HeroCarousel } from './components/HeroCarousel';
import { StoriesBar } from './components/StoriesBar';
import { ChildrenSection } from './components/ChildrenSection';
import { EvangelicalCard } from './components/EvangelicalCard';
import { LetterModal } from './components/LetterModal';
import { DonationPixModal } from './components/DonationPixModal';
import { NotificationModal } from './components/NotificationModal';
import { InAppCameraModal } from './components/InAppCameraModal';
import { FestiveEffects } from './components/FestiveEffects';
import { SponsorCertificateModal } from './components/SponsorCertificateModal';

// Helper to convert media files into compressed web strings
function processMediaFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      if (file.type.startsWith('video')) {
        if (file.size > 10 * 1024 * 1024) {
          resolve(URL.createObjectURL(file));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || URL.createObjectURL(file));
        reader.onerror = () => resolve(URL.createObjectURL(file));
        reader.readAsDataURL(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 1200;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
              } else {
                resolve((e.target?.result as string) || URL.createObjectURL(file));
              }
            } catch {
              resolve((e.target?.result as string) || URL.createObjectURL(file));
            }
          };
          img.onerror = () => resolve((e.target?.result as string) || URL.createObjectURL(file));
          img.src = e.target?.result as string;
        } catch {
          resolve(URL.createObjectURL(file));
        }
      };
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    } catch {
      resolve(URL.createObjectURL(file));
    }
  });
}

// Audio Synthesizers (Festive Chime & Firework Booms)
function playFestiveChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const melody = [
      { note: 659.25, duration: 0.18, time: 0 },
      { note: 659.25, duration: 0.18, time: 0.2 },
      { note: 659.25, duration: 0.35, time: 0.4 },
      { note: 659.25, duration: 0.18, time: 0.8 },
      { note: 659.25, duration: 0.18, time: 1.0 },
      { note: 659.25, duration: 0.35, time: 1.2 },
      { note: 783.99, duration: 0.22, time: 1.6 },
      { note: 659.25, duration: 0.45, time: 1.9 }
    ];
    melody.forEach(({ note, duration, time }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, audioCtx.currentTime + time);
      gain.gain.setValueAtTime(0, audioCtx.currentTime + time);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + time);
      osc.stop(audioCtx.currentTime + time + duration);
    });
  } catch (e) {
    console.warn("Audio chime unavailable", e);
  }
}

function playFireworkBoom() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Audio boom error", e);
  }
}

export default function App() {
  // Navigation Screens list
  const orderedScreens: { id: Screen; title: string; number: number }[] = [
    { id: 'home', number: 1, title: 'Início' },
    { id: 'login', number: 2, title: 'Acesso / Login' },
    { id: 'register', number: 3, title: 'Cadastro' },
    { id: 'admin_dashboard', number: 4, title: 'Painel de Gestão' },
    { id: 'family_profile', number: 5, title: 'Área da Família' },
    { id: 'sponsor_profile', number: 6, title: 'Área do Padrinho' },
    { id: 'child_profile', number: 7, title: 'Perfil da Criança' },
    { id: 'approval_workflow', number: 8, title: 'Processo de Aprovação' },
    { id: 'waiting_area', number: 9, title: 'Todas as Crianças' },
    { id: 'gallery', number: 10, title: 'Galeria de Fotos' },
    { id: 'photo_editor', number: 11, title: 'Editor de Fotos' },
    { id: 'media_management', number: 12, title: 'Gestor de Mídias' },
    { id: 'settings', number: 13, title: 'Configurações' },
    { id: 'menu_drawer', number: 14, title: 'Menu' },
    { id: 'pwa_install', number: 15, title: 'Instalar Aplicativo PWA' },
    { id: 'stories_view', number: 16, title: 'Histórias & Momentos 9:16' },
  ];

  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('currentScreenIndex');
      if (saved !== null) {
        const num = Number(saved);
        if (!isNaN(num) && num >= 0 && num < orderedScreens.length) return num;
      }
    } catch {}
    return 0;
  });

  const currentScreenObj = orderedScreens[currentScreenIndex] || orderedScreens[0];

  // Global Project & Institution Branding
  const [projectName, setProjectName] = useState(() => {
    try { return localStorage.getItem('projectName') || 'Corações que Acolhe'; } catch { return 'Corações que Acolhe'; }
  });
  const [institutionName, setInstitutionName] = useState(() => {
    try { return localStorage.getItem('institutionName') || 'Lar Esperança'; } catch { return 'Lar Esperança'; }
  });

  // Notifications State & Alerts
  const [notification, setNotification] = useState<string | null>('Bem-vindo ao Cora\u00e7\u00f5es que Acolhe!');
  const [topEventAlert, setTopEventAlert] = useState<{ title: string; body: string } | null>(null);
  const [notificationsList, setNotificationsList] = useState<LocalAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('localNotifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'welcome-notif',
          title: 'Campanha de Natal 2026 Ativa!',
          body: 'Adote uma cartinha ou fa\u00e7a uma doa\u00e7\u00e3o PIX para aben\u00e7oar o Natal das crian\u00e7as acolhidas.',
          type: 'system',
          timestamp: 'Hoje',
          read: false,
        }
      ];
    } catch {
      return [];
    }
  });
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  const showTopEventAlert = (title: string, body: string) => {
    setTopEventAlert({ title, body });
    if (isFestiveSoundEnabled) playFestiveChime();
    confetti({ 
      particleCount: 90, 
      spread: 75, 
      origin: { y: 0.1 },
      colors: ['#F59E0B', '#F43F5E', '#10B981', '#38BDF8']
    });
  };

  const sendLocalNotification = (data: {
    title: string;
    body: string;
    type: 'new_child' | 'status_change' | 'system';
    childId?: string;
    childName?: string;
  }) => {
    const newNotif: LocalAppNotification = {
      id: Date.now().toString(),
      title: data.title,
      body: data.body,
      type: data.type,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      childId: data.childId,
      childName: data.childName,
    };
    setNotificationsList(prev => [newNotif, ...prev]);
    setNotification(`${data.title}: ${data.body}`);

    if (data.type === 'new_child') {
      showTopEventAlert('Nova Crian\u00e7a no Lar! ⭐', `${data.childName || 'Uma nova crian\u00e7a'} acabou de ser cadastrada e aguarda apadrinhamento.`);
    } else if (data.type === 'status_change') {
      showTopEventAlert('Apadrinhamento Confirmado! ❤️', data.body);
    }
  };

  // Main Datasets (Children, Profiles, Banners, Stories, Gallery)
  const [childrenList, setChildrenList] = useState<Child[]>(() => {
    try {
      const saved = localStorage.getItem('childrenList');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 18) return parsed;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, Child>();
          INITIAL_CHILDREN.forEach(c => map.set(c.id, { ...c }));
          parsed.forEach((c: Child) => {
            if (c && c.id) map.set(c.id, { ...(map.get(c.id) || {}), ...c });
          });
          return Array.from(map.values());
        }
      }
    } catch {}
    return INITIAL_CHILDREN;
  });

  // Crianças aprovadas e não arquivadas para exibição pública (Home e Todas as Crianças)
  const publicChildren = childrenList.filter(c => c.approved !== false && !c.archived);
  const [adminChildFilter, setAdminChildFilter] = useState<'all' | 'approved' | 'pending' | 'sponsored' | 'waiting'>('all');
  const [adminChildSearch, setAdminChildSearch] = useState('');

  const [profilesList, setProfilesList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('profilesList');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('banners');
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [stories916, setStories916] = useState<Media916[]>(() => {
    try {
      const saved = localStorage.getItem('stories916');
      return saved ? JSON.parse(saved) : INITIAL_STORIES_916;
    } catch {
      return INITIAL_STORIES_916;
    }
  });

  const [galleryItems, setGalleryItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('galleryItems');
      return saved ? JSON.parse(saved) : [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&h=600&fit=crop',
      ];
    } catch {
      return [];
    }
  });

  const [galleryRecords, setGalleryRecords] = useState<GalleryPhotoRecord[]>([]);

  // Spiritual / Evangelical Themes & Messages
  const [evangelicalThemes] = useState<EvangelicalTheme[]>(INITIAL_EVANGELICAL_THEMES);
  const [activeEvangelicalThemeId, setActiveEvangelicalThemeId] = useState(() => {
    try { return localStorage.getItem('activeEvangelicalThemeId') || 'luz_divina'; } catch { return 'luz_divina'; }
  });
  const [evangelicalMessages, setEvangelicalMessages] = useState<EvangelicalMessage[]>(() => {
    try {
      const saved = localStorage.getItem('evangelicalMessages');
      return saved ? JSON.parse(saved) : INITIAL_EVANGELICAL_MESSAGES;
    } catch {
      return INITIAL_EVANGELICAL_MESSAGES;
    }
  });
  const [activeEvangelicalMessageId, setActiveEvangelicalMessageId] = useState(() => {
    try { return localStorage.getItem('activeEvangelicalMessageId') || 'm1'; } catch { return 'm1'; }
  });
  const [isEvangelicalBannerEnabled, setIsEvangelicalBannerEnabled] = useState(true);

  // Users Profiles (Sponsor & Family)
  const [sponsorUser, setSponsorUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('sponsorUser');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: DEFAULT_SPONSOR_PROFILE_ID,
      name: 'Oziel Pereira',
      email: 'ozielpsouza9803@gmail.com',
      phone: '(21) 99371-9730',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      bio: 'Padrinho dedicado a apoiar as crian\u00e7as com amor e aten\u00e7\u00e3o.',
      familyMessage: 'Querida fam\u00edlia: que o amor e a esperan\u00e7a estejam sempre presentes no seu lar! Um abra\u00e7o de todo cora\u00e7\u00e3o.',
      isLoggedIn: true
    };
  });

  const [familyUser, setFamilyUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('familyUser');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: DEFAULT_FAMILY_PROFILE_ID,
      name: 'Fam\u00edlia Silva & Souza',
      email: 'familia.silva@laresperanca.org',
      phone: '(11) 99123-4567',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      bio: 'Fam\u00edlia acolhedora dedicada a oferecer carinho, amor e prote\u00e7\u00e3o.',
      isLoggedIn: true
    };
  });

  // Admin & Security Management with authentic Supabase Auth (no hardcoded passwords)
  const [adminName, setAdminName] = useState(() => localStorage.getItem('adminName') || 'Lar Esperança');
  const [adminTitle, setAdminTitle] = useState(() => localStorage.getItem('adminTitle') || 'Gestão');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('adminEmail') || 'contato@laresperanca.org');
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('adminPhone') || '(11) 99803-0000');
  const [adminAvatar, setAdminAvatar] = useState(() => localStorage.getItem('adminAvatar') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop');
  const [adminBio, setAdminBio] = useState(() => localStorage.getItem('adminBio') || 'Coordenação oficial do Lar Esperança.');
  const [isSafePanelUnlocked, setIsSafePanelUnlocked] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityPasswordInput, setSecurityPasswordInput] = useState('');
  const [securityEmailInput, setSecurityEmailInput] = useState('');
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'children' | 'padrinhos' | 'familias' | 'gallery' | 'camera' | 'carousel' | 'media916' | 'pix' | 'evangelical' | 'festive' | 'security' | 'profile'>('dashboard');

  // Listen to Supabase Auth state & check active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsSafePanelUnlocked(true);
      }
    }).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsSafePanelUnlocked(true);
      } else {
        setCurrentUser(null);
        setIsSafePanelUnlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // PIX Settings
  const [pixKey, setPixKey] = useState(() => localStorage.getItem('pixKey') || 'doacoes@laresperanca.org');
  const [pixBankName, setPixBankName] = useState(() => localStorage.getItem('pixBankName') || 'Banco do Brasil - Lar Esperan\u00e7a');
  const [pixQrCode, setPixQrCode] = useState(() => localStorage.getItem('pixQrCode') || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PixKey:doacoes@laresperanca.org');
  const [donationCustomMessage, setDonationCustomMessage] = useState(() => localStorage.getItem('donationCustomMessage') || 'Sua contribui\u00e7\u00e3o transforma o Natal das nossas crian\u00e7as acolhidas em um momento de pura alegria e esperan\u00e7a.');

  // Festive Atmosphere (Snow & Fireworks)
  const [festiveMode, setFestiveMode] = useState<'christmas' | 'new_year' | 'off'>('christmas');
  const [snowIntensity, setSnowIntensity] = useState<'off' | 'light' | 'medium' | 'heavy'>('light');
  const [snowScope, setSnowScope] = useState<'home_only' | 'all_screens'>('home_only');
  const [fireworksScope, setFireworksScope] = useState<'home_only' | 'home_sky' | 'all_screens'>('home_only');
  const [fireworksPosition, setFireworksPosition] = useState<'sky_top' | 'full_screen'>('sky_top');
  const [fireworksIntensity, setFireworksIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [isFestiveSoundEnabled, setIsFestiveSoundEnabled] = useState(true);

  // Modals & Popups State
  const [selectedChildForLetter, setSelectedChildForLetter] = useState<Child | null>(null);
  const [editingChildForModal, setEditingChildForModal] = useState<Child | null>(null);
  const [selectedChildForCertificate, setSelectedChildForCertificate] = useState<Child | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedStory916, setSelectedStory916] = useState<Media916 | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<any>('gallery');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const saved = localStorage.getItem('socialLinks');
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_LINKS;
    } catch {
      return INITIAL_SOCIAL_LINKS;
    }
  });

  // 3D Splash Screen Intro
  const [isShowingSplash, setIsShowingSplash] = useState(true);

  // Age display calculation helper
  const getAgeDisplay = (birthDate?: string, ageNum?: number | string): string => {
    if (birthDate) {
      const birth = new Date(birthDate);
      if (!isNaN(birth.getTime())) {
        const now = new Date();
        const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        if (diffMonths <= 0) return 'Rec\u00e9m-nascido';
        if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'm\u00eas' : 'meses'}`;
        const years = Math.floor(diffMonths / 12);
        const months = diffMonths % 12;
        if (months === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
        return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months}m`;
      }
    }
    if (ageNum === 0 || ageNum === '0') return 'Menos de 1 ano (beb\u00ea)';
    if (ageNum) return `${ageNum} ${Number(ageNum) === 1 ? 'ano' : 'anos'}`;
    return 'Idade n\u00e3o informada';
  };

  // Sync with Supabase on mount
  useEffect(() => {
    const syncData = async () => {
      try {
        const data = await fetchAllSupabaseData();
        if (data && data.kids && data.kids.length > 0) {
          const mapped: Child[] = data.kids.map((k: any) => {
            const parsedAge = parseInt(k.age);
            const photoUrl = k.photo_path
              ? (k.photo_path.startsWith('http') || k.photo_path.startsWith('data:') 
                  ? k.photo_path 
                  : `https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/${k.photo_path}`)
              : (k.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop');
            
            const wishlistObj = (k.wishlist && typeof k.wishlist === 'object') ? k.wishlist : {};
            const desiredGift = wishlistObj.desiredGift || k.wishlist?.desiredGift || '';
            const shoeSize = wishlistObj.shoeSize || k.wishlist?.shoeSize || '';
            const clothesSize = wishlistObj.clothesSize || k.wishlist?.clothesSize || '';

            return {
              id: k.id,
              family_id: k.family_id,
              name: k.name || 'Crian\u00e7a',
              age: !isNaN(parsedAge) ? parsedAge : (k.age ? 1 : 7),
              gender: k.gender || 'Infantil',
              status: k.status || 'Aguardando Apadrinhamento',
              likes: k.likes || 'brincar, desenhar',
              dream: k.dream || 'um Natal feliz',
              address: k.address || 'Lar Esperan\u00e7a',
              image: photoUrl,
              letter: k.letter || 'Querido Papai Noel, gostaria de ter um Natal muito iluminado!',
              birthDate: k.birth_date || undefined,
              wishlist: [{ name: desiredGift || 'Presente de Natal', price: 80 }],
              desiredGift,
              shoeSize,
              clothesSize,
              sponsorName: k.sponsor_name,
              approved: k.approved !== undefined ? k.approved : true,
              archived: k.archived !== undefined ? k.archived : false
            };
          });

          // Mesclar dados preservando integralmente os 18 registros (14 aprovados + 4 em análise/pendentes)
          setChildrenList(prev => {
            const map = new Map<string, Child>();
            // 1. Base inicial: todos os 18 registros
            INITIAL_CHILDREN.forEach(c => map.set(c.id, { ...c }));
            // 2. Sobrepor alterações locais prévias
            (prev || []).forEach(c => map.set(c.id, { ...(map.get(c.id) || {}), ...c }));
            // 3. Atualizar com os registros recebidos do Supabase
            mapped.forEach(mk => {
              let existingKey = mk.id;
              if (!map.has(existingKey)) {
                for (const [k, v] of map.entries()) {
                  if (v.name?.trim().toLowerCase() === mk.name?.trim().toLowerCase()) {
                    existingKey = k;
                    break;
                  }
                }
              }
              const existing: Partial<Child> = map.get(existingKey) || {};
              map.set(existingKey, {
                ...existing,
                ...mk,
                approved: mk.approved !== undefined ? mk.approved : (existing.approved !== undefined ? existing.approved : true),
                archived: mk.archived !== undefined ? mk.archived : (existing.archived !== undefined ? existing.archived : false),
              } as Child);
            });
            const fullList = Array.from(map.values());
            try { localStorage.setItem('childrenList', JSON.stringify(fullList)); } catch {}
            return fullList;
          });
        }
      } catch (e) {
        console.warn('Sync notice:', e);
      }
    };

    syncData();
  }, []);

  // Handle Child Sponsorship Flow
  const handleSponsorChild = (childId: string) => {
    const targetChild = childrenList.find(c => c.id === childId);
    if (!targetChild) return;

    const updated = childrenList.map(c => {
      if (c.id === childId) {
        return {
          ...c,
          status: 'Apadrinhado' as const,
          sponsorName: sponsorUser.name || 'Padrinho do Cora\u00e7\u00e3o',
          sponsorId: sponsorUser.id
        };
      }
      return c;
    });

    setChildrenList(updated);
    try { localStorage.setItem('childrenList', JSON.stringify(updated)); } catch {}

    // Celebratory Chime & Confetti
    if (isFestiveSoundEnabled) playFestiveChime();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#F43F5E', '#10B981', '#38BDF8', '#E879F9']
    });

    showTopEventAlert('Novo Apadrinhamento Realizado! ❤️', `Voc\u00ea apadrinhou ${targetChild.name}! O Natal ser\u00e1 inesquec\u00edvel.`);
    setSelectedChildForCertificate(targetChild);
    setIsCertificateOpen(true);

    // Sync status to Supabase in background
    updateKidInSupabase(childId, { status: 'Apadrinhado' }).catch(() => {});
  };

  // Safe Panel Auth Handler via authentic Supabase Auth (no hardcoded passwords)
  const handleVerifySecurityCredentials = async () => {
    const email = securityEmailInput.trim();
    const password = securityPasswordInput.trim();

    if (!email || !password) {
      setAuthError('Informe o e-mail e a senha cadastrados no Supabase.');
      setNotification('Por favor, informe e-mail e senha.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(`Erro no Supabase Auth: ${error.message}`);
        setNotification(`Erro ao autenticar: ${error.message}`);
      } else if (data?.user) {
        setCurrentUser(data.user);
        setIsSafePanelUnlocked(true);
        setIsSecurityModalOpen(false);
        setSecurityEmailInput('');
        setSecurityPasswordInput('');
        setAuthError(null);
        setCurrentScreenIndex(3); // Admin screen
        setNotification('Painel de Gestão Seguro Desbloqueado com sucesso!');
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Falha ao conectar com o Supabase Auth.');
      setNotification('Falha ao autenticar.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setIsSafePanelUnlocked(false);
    setCurrentUser(null);
    setCurrentScreenIndex(0);
    setNotification('Sessão administrativa encerrada.');
  };

  const currentTheme = evangelicalThemes.find(t => t.id === activeEvangelicalThemeId) || evangelicalThemes[0];
  const currentMessage = evangelicalMessages.find(m => m.id === activeEvangelicalMessageId) || evangelicalMessages[0];

  return (
    <div className="w-full min-h-screen bg-[#080415] text-slate-100 font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden flex flex-col">
      
      {/* 1. Festive Canvas Effects (Snow & Fireworks, strictly isolated from admin panel) */}
      <FestiveEffects 
        festiveMode={festiveMode}
        snowIntensity={snowIntensity}
        snowScope={snowScope}
        fireworksScope={fireworksScope}
        fireworksPosition={fireworksPosition}
        fireworksIntensity={fireworksIntensity}
        currentScreenId={currentScreenObj.id}
        isSoundEnabled={isFestiveSoundEnabled}
        onPlayFireworkBoom={playFireworkBoom}
      />

      {/* 2. Top Event Alert Banner */}
      {topEventAlert && (
        <div className="fixed inset-x-0 top-3 z-[150] px-4 flex justify-center pointer-events-none animate-in slide-in-from-top duration-500">
          <div className="pointer-events-auto bg-[#180E2B] border-2 border-amber-400/70 p-3.5 sm:p-4 rounded-3xl shadow-2xl flex items-center space-x-3.5 max-w-md w-full">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white">{topEventAlert.title}</h4>
              <p className="text-[11px] text-purple-200 mt-0.5 line-clamp-2">{topEventAlert.body}</p>
            </div>
            <button 
              onClick={() => setTopEventAlert(null)}
              className="p-1.5 rounded-xl bg-purple-900/60 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[140] bg-gradient-to-r from-pink-600 to-amber-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4. Top Navigation Bar (Contract Compliant) */}
      <TopNav 
        projectName={projectName}
        institutionName={institutionName}
        currentScreenId={currentScreenObj.id}
        onNavigate={setCurrentScreenIndex}
        onOpenMenu={() => setIsMobileDrawerOpen(true)}
        onDonateClick={() => setIsDonationModalOpen(true)}
        onOpenSafePanel={() => {
          if (isSafePanelUnlocked) {
            setCurrentScreenIndex(3);
          } else {
            setIsSecurityModalOpen(true);
          }
        }}
        onToggleSound={() => setIsFestiveSoundEnabled(!isFestiveSoundEnabled)}
        isSoundEnabled={isFestiveSoundEnabled}
        unreadNotifsCount={notificationsList.filter(n => !n.read).length}
        onOpenNotifs={() => setIsNotificationCenterOpen(true)}
      />

      {/* 5. Main View Router */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 py-4 flex flex-col justify-between pb-24 sm:pb-28">
        
        {/* ==================== HOME SCREEN ==================== */}
        {currentScreenObj.id === 'home' && (
          <div className="space-y-6 w-full animate-in fade-in duration-300">
            
            {/* Hero Banner Carousel */}
            <HeroCarousel 
              banners={banners}
              onAdoptClick={() => setCurrentScreenIndex(8)}
              onDonateClick={() => setIsDonationModalOpen(true)}
              onZoomImage={setZoomedImage}
            />

            {/* 9:16 Stories Bar */}
            <StoriesBar 
              stories={stories916}
              onSelectStory={setSelectedStory916}
              onViewAll={() => setCurrentScreenIndex(15)}
              onOpenLiveCamera={() => {
                setCameraTarget('media916');
                setIsLiveCameraOpen(true);
              }}
            />

            {/* Spiritual Inspiration Card (Luz Divina & Fé) */}
            {isEvangelicalBannerEnabled && (
              <EvangelicalCard 
                theme={currentTheme}
                message={currentMessage}
                onCycleMessage={() => {
                  const idx = evangelicalMessages.findIndex(m => m.id === activeEvangelicalMessageId);
                  const next = (idx + 1) % evangelicalMessages.length;
                  setActiveEvangelicalMessageId(evangelicalMessages[next].id);
                }}
                onCopySuccess={(msg) => setNotification(msg)}
              />
            )}

            {/* Adote uma Cartinha - Children Section (Área Pública: Apenas Aprovados, 4 na Home + Botão Ver Todos) */}
            <ChildrenSection 
              childrenList={publicChildren}
              onSelectChild={(c) => setSelectedChildForLetter(c)}
              onSponsorChild={handleSponsorChild}
              onZoomImage={setZoomedImage}
              getAgeDisplay={getAgeDisplay}
              isHome={true}
              limit={4}
              onViewAll={() => setCurrentScreenIndex(8)}
            />

            {/* Galeria de Fotos em Destaque */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span>Galeria de Momentos do Lar</span>
                  </h3>
                  <p className="text-xs text-purple-300">Registros de amor, carinho e atividades das crianças</p>
                </div>
                <button 
                  onClick={() => setCurrentScreenIndex(9)}
                  className="text-xs text-pink-400 hover:text-pink-300 font-bold underline transition"
                >
                  Ver Galeria Completa ({galleryItems.length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryItems.slice(0, 4).map((imgUrl, i) => (
                  <div 
                    key={i}
                    onClick={() => setZoomedImage(imgUrl)}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-purple-500/30 group cursor-pointer shadow-lg bg-[#140824]"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Momento ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Portals (Padrinho & Família) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreenIndex(5)}
                className="p-5 rounded-[28px] bg-gradient-to-br from-[#24133A] to-[#170C2A] border border-purple-500/30 hover:border-pink-500/60 shadow-xl flex items-center space-x-4 text-left group transition active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition shrink-0">
                  <User className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 block">Portal do Padrinho</span>
                  <h4 className="text-base font-black text-white">Minhas Crianças Apadrinhadas</h4>
                  <p className="text-xs text-purple-300 mt-0.5 truncate">Acompanhe cartinhas, entregas e certificados</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreenIndex(4)}
                className="p-5 rounded-[28px] bg-gradient-to-br from-[#24133A] to-[#170C2A] border border-purple-500/30 hover:border-amber-500/60 shadow-xl flex items-center space-x-4 text-left group transition active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition shrink-0">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Portal da Família</span>
                  <h4 className="text-base font-black text-white">Famílias Acolhedoras</h4>
                  <p className="text-xs text-purple-300 mt-0.5 truncate">Cadastre crianças e veja mensagens dos padrinhos</p>
                </div>
              </button>
            </div>

          </div>
        )}

        {/* ==================== ALL CHILDREN (WAITING AREA) ==================== */}
        {currentScreenObj.id === 'waiting_area' && (
          <div className="space-y-4 w-full animate-in fade-in duration-300">
            <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/40">
              <button 
                onClick={() => setCurrentScreenIndex(0)}
                className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">Todas as Cartinhas de Natal</h2>
                <p className="text-xs text-purple-300">
                  {publicChildren.length} crianças aprovadas para apadrinhamento (de um total de 18 acolhidos pelo projeto)
                </p>
              </div>
            </div>

            <ChildrenSection 
              childrenList={publicChildren}
              onSelectChild={(c) => setSelectedChildForLetter(c)}
              onSponsorChild={handleSponsorChild}
              onZoomImage={setZoomedImage}
              getAgeDisplay={getAgeDisplay}
            />
          </div>
        )}

        {/* ==================== GALLERY SCREEN ==================== */}
        {currentScreenObj.id === 'gallery' && (
          <div className="space-y-4 w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentScreenIndex(0)}
                  className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Galeria de Fotos do Lar</h2>
                  <p className="text-xs text-purple-300">{galleryItems.length} registros e momentos especiais</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCameraTarget('gallery');
                  setIsLiveCameraOpen(true);
                }}
                className="py-2 px-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Tirar Foto</span>
              </button>
            </div>

            {/* Masonry-style Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pb-6">
              {galleryItems.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setZoomedImage(imgUrl)}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-purple-500/30 shadow-lg group cursor-pointer bg-[#140824]"
                >
                  <img 
                    src={imgUrl} 
                    alt={`Momento ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SPONSOR PROFILE ==================== */}
        {currentScreenObj.id === 'sponsor_profile' && (
          <div className="space-y-5 w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentScreenIndex(0)}
                  className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Área do Padrinho de Coração</h2>
                  <p className="text-xs text-purple-300">{sponsorUser.name} · Padrinho Solidário</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreenIndex(0)}
                className="py-1.5 px-3 rounded-xl bg-purple-900/60 text-purple-200 text-xs font-bold"
              >
                Início
              </button>
            </div>

            {/* Sponsor Header Card */}
            <div className="p-5 rounded-[32px] bg-gradient-to-r from-[#24133A] via-[#2A1644] to-[#1C0E30] border border-pink-500/40 shadow-xl flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500 shadow-xl cursor-pointer shrink-0"
                onClick={() => setZoomedImage(sponsorUser.avatar)}
              >
                <img src={sponsorUser.avatar} alt={sponsorUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-lg font-black text-white truncate">{sponsorUser.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/40">
                    Padrinho Ativo
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-1 italic">"{sponsorUser.bio}"</p>
                <p className="text-[11px] text-amber-300 font-semibold mt-1">
                  Mensagem para as famílias: "{sponsorUser.familyMessage}"
                </p>
              </div>
            </div>

            {/* Sponsored Kids Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>Crianças que você apadrinhou:</span>
              </h3>

              {(() => {
                const sponsored = childrenList.filter(c => c.status === 'Apadrinhado');
                if (sponsored.length === 0) {
                  return (
                    <div className="p-8 rounded-3xl bg-[#1A1033] border border-purple-500/20 text-center space-y-3">
                      <Heart className="w-10 h-10 text-purple-400 mx-auto opacity-50" />
                      <p className="text-xs text-purple-300">Você ainda não apadrinhou nenhuma criança.</p>
                      <button 
                        onClick={() => setCurrentScreenIndex(8)}
                        className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-black text-xs shadow-lg"
                      >
                        Ver Cartinhas e Apadrinhar
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {sponsored.map(child => (
                      <div key={child.id} className="p-4 rounded-2xl bg-[#1C0E33] border border-purple-500/30 space-y-3 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={child.image} 
                            alt={child.name} 
                            className="w-14 h-14 rounded-xl object-cover object-top border-2 border-amber-400 shadow-md cursor-pointer shrink-0" 
                            onClick={() => setZoomedImage(child.image)}
                            title="Toque para ampliar foto"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{child.name}</h4>
                            <p className="text-[11px] text-purple-300">{getAgeDisplay(child.birthDate, child.age)}</p>
                            <span className="text-[10px] text-emerald-400 font-bold">Apadrinhamento Confirmado</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-1">
                          <button
                            onClick={() => setSelectedChildForLetter(child)}
                            className="flex-1 py-2 rounded-xl bg-purple-900/60 text-pink-300 text-xs font-bold"
                          >
                            Ver Cartinha
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChildForCertificate(child);
                              setIsCertificateOpen(true);
                            }}
                            className="flex-1 py-2 rounded-xl bg-amber-500 text-black text-xs font-black shadow"
                          >
                            Certificado
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ==================== FAMILY PROFILE ==================== */}
        {currentScreenObj.id === 'family_profile' && (
          <div className="space-y-5 w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentScreenIndex(0)}
                  className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Portal da Família Acolhedora</h2>
                  <p className="text-xs text-purple-300">{familyUser.name}</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreenIndex(0)}
                className="py-1.5 px-3 rounded-xl bg-purple-900/60 text-purple-200 text-xs font-bold"
              >
                Início
              </button>
            </div>

            {/* Family Profile Card */}
            <div className="p-5 rounded-[32px] bg-gradient-to-r from-[#24133A] via-[#2A1644] to-[#1C0E30] border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-xl cursor-pointer shrink-0"
                onClick={() => setZoomedImage(familyUser.avatar)}
              >
                <img src={familyUser.avatar} alt={familyUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-lg font-black text-white truncate">{familyUser.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                    Família Acolhedora
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-1 italic">"{familyUser.bio}"</p>
                <p className="text-[11px] text-purple-300 mt-1">Contato: {familyUser.phone} · {familyUser.email}</p>
              </div>
            </div>

            {/* Children List in Family Care */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Crianças sob Acolhimento:</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {childrenList.map((child) => (
                  <div key={child.id} className="p-4 rounded-2xl bg-[#1C0E33] border border-purple-500/30 space-y-2.5 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <img src={child.image} alt={child.name} className="w-12 h-12 rounded-xl object-cover border border-pink-500" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">{child.name}</h4>
                        <p className="text-[10px] text-purple-300">{getAgeDisplay(child.birthDate, child.age)}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          child.status === 'Apadrinhado' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {child.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedChildForLetter(child)}
                      className="w-full py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-pink-300 text-xs font-bold transition"
                    >
                      Ver / Editar Cartinha
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ADMIN DASHBOARD ==================== */}
        {currentScreenObj.id === 'admin_dashboard' && (
          <div className="space-y-5 w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentScreenIndex(0)}
                  className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Painel de Gestão Seguro</h2>
                  <p className="text-xs text-amber-300 font-bold">{adminTitle} · {adminName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setCameraTarget('gallery');
                    setIsLiveCameraOpen(true);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <Camera className="w-4 h-4" />
                  <span>Câmera</span>
                </button>
                <button
                  onClick={() => setCurrentScreenIndex(0)}
                  className="py-2 px-3.5 rounded-xl bg-[#221038] hover:bg-[#311650] text-purple-200 text-xs font-bold border border-purple-500/30"
                >
                  Sair do Painel
                </button>
              </div>
            </div>

            {/* Status de Conexão Supabase */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#18261F] to-[#122019] border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-black text-white text-xs block">Conexão Supabase 100% Ativa (Conta 2)</span>
                  <span className="text-[10px] text-emerald-300">
                    URL: utrpckrchcbqgzbhvlzy.supabase.co · Chave Pública (Anon) Conectada
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 shrink-0">
                Online
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 shadow">
                <span className="text-[9px] text-purple-300 uppercase font-bold block">Total Cadastros (kids)</span>
                <span className="text-2xl font-black text-white mt-1 block">{childrenList.length}</span>
                <span className="text-[9px] text-purple-400">18 registros preservados</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C0E33] border border-emerald-500/40 shadow">
                <span className="text-[9px] text-emerald-300 uppercase font-bold block">Aprovadas (App Público)</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{publicChildren.length}</span>
                <span className="text-[9px] text-emerald-300/70">visíveis na área pública</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C0E33] border border-amber-500/40 shadow">
                <span className="text-[9px] text-amber-300 uppercase font-bold block">Em Análise / Pendentes</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {childrenList.filter(c => c.approved === false || c.status === 'Em Análise').length}
                </span>
                <span className="text-[9px] text-amber-300/70">aguardando liberação</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C0E33] border border-pink-500/40 shadow">
                <span className="text-[9px] text-pink-300 uppercase font-bold block">Apadrinhadas</span>
                <span className="text-2xl font-black text-pink-400 mt-1 block">
                  {childrenList.filter(c => c.status === 'Apadrinhado').length}
                </span>
                <span className="text-[9px] text-pink-300/70">com padrinho ativo</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 shadow">
                <span className="text-[9px] text-purple-300 uppercase font-bold block">Galeria</span>
                <span className="text-2xl font-black text-white mt-1 block">{galleryItems.length}</span>
                <span className="text-[9px] text-purple-400">fotos & mídias</span>
              </div>
            </div>

            {/* Analytics Chart with Recharts */}
            <div className="p-5 rounded-3xl bg-[#1A0E2E] border border-purple-500/30 shadow-xl space-y-3">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Volume de Doações Mensais (R$)
              </h4>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: 'Mai', total: 3450 },
                    { month: 'Jun', total: 4200 },
                    { month: 'Jul', total: 3900 },
                    { month: 'Ago', total: 5120 },
                    { month: 'Set', total: 6300 },
                    { month: 'Out', total: 7850 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D1A4A" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#180E2B', borderColor: '#F59E0B', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="total" fill="#EC4899" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seção Completa: Todos os 18 Cadastros de Crianças no Painel Administrativo */}
            <div className="p-5 rounded-3xl bg-[#1A0E2E] border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-900/40">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>Todos os Cadastros de Crianças ({childrenList.length} Registros)</span>
                  </h3>
                  <p className="text-xs text-purple-300">
                    Controle administrativo integral: 14 aprovadas na área pública e 4 em análise / pendentes.
                  </p>
                </div>
                {/* Filtros rápidos do painel admin com contagens precisas */}
                <div className="flex items-center space-x-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setAdminChildFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      adminChildFilter === 'all' ? 'bg-purple-600 text-white shadow' : 'bg-[#1C0E33] text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    Todas ({childrenList.length})
                  </button>
                  <button
                    onClick={() => setAdminChildFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      adminChildFilter === 'approved' ? 'bg-emerald-600 text-white shadow' : 'bg-[#1C0E33] text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    Aprovadas ({publicChildren.length})
                  </button>
                  <button
                    onClick={() => setAdminChildFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      adminChildFilter === 'pending' ? 'bg-amber-500 text-black shadow' : 'bg-[#1C0E33] text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    Em Análise ({childrenList.filter(c => c.approved === false || c.status === 'Em Análise').length})
                  </button>
                  <button
                    onClick={() => setAdminChildFilter('sponsored')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      adminChildFilter === 'sponsored' ? 'bg-pink-600 text-white shadow' : 'bg-[#1C0E33] text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    Apadrinhadas ({childrenList.filter(c => c.status === 'Apadrinhado').length})
                  </button>
                  <button
                    onClick={() => setAdminChildFilter('waiting')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      adminChildFilter === 'waiting' ? 'bg-blue-600 text-white shadow' : 'bg-[#1C0E33] text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    Aguardando ({childrenList.filter(c => c.status === 'Aguardando Apadrinhamento').length})
                  </button>
                </div>
              </div>

              {/* Barra de Pesquisa de Crianças no Painel */}
              <div className="relative flex items-center bg-[#140824] border border-purple-500/30 focus-within:border-amber-400 rounded-2xl px-3.5 py-2.5 shadow transition">
                <Search className="w-4 h-4 text-amber-400 mr-2.5 shrink-0" />
                <input 
                  type="text"
                  value={adminChildSearch}
                  onChange={(e) => setAdminChildSearch(e.target.value)}
                  placeholder="Buscar entre os 18 cadastros por nome, sonho ou pedido..."
                  className="w-full bg-transparent text-xs text-white placeholder-purple-400 focus:outline-none"
                />
                {adminChildSearch && (
                  <button 
                    type="button"
                    onClick={() => setAdminChildSearch('')}
                    className="p-1 rounded-lg text-purple-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Grid de todos os 18 cadastros organizados */}
              {(() => {
                const q = adminChildSearch.toLowerCase().trim();
                const filteredAdminChildren = childrenList.filter(c => {
                  if (q) {
                    const match = 
                      c.name.toLowerCase().includes(q) ||
                      (c.desiredGift && c.desiredGift.toLowerCase().includes(q)) ||
                      c.dream.toLowerCase().includes(q) ||
                      c.letter.toLowerCase().includes(q);
                    if (!match) return false;
                  }
                  if (adminChildFilter === 'approved') return c.approved !== false && !c.archived;
                  if (adminChildFilter === 'pending') return c.approved === false || c.status === 'Em Análise';
                  if (adminChildFilter === 'sponsored') return c.status === 'Apadrinhado';
                  if (adminChildFilter === 'waiting') return c.status === 'Aguardando Apadrinhamento';
                  return true;
                });

                if (filteredAdminChildren.length === 0) {
                  return (
                    <div className="p-8 text-center bg-[#1C0E33] rounded-3xl border border-purple-500/20 text-purple-300 space-y-2">
                      <p className="font-bold text-white text-sm">Nenhum cadastro encontrado para o filtro selecionado.</p>
                      <button 
                        type="button"
                        onClick={() => { setAdminChildFilter('all'); setAdminChildSearch(''); }}
                        className="px-4 py-2 rounded-xl bg-purple-900/60 text-pink-300 font-bold text-xs"
                      >
                        Limpar Filtros e Ver Todos ({childrenList.length})
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredAdminChildren.map((child, idx) => {
                      const isApproved = child.approved !== false && !child.archived;
                      return (
                        <div key={child.id || idx} className="p-4 rounded-3xl bg-[#1C0E33] border border-purple-500/30 hover:border-pink-500/50 space-y-3 shadow-xl flex flex-col justify-between transition group">
                          <div>
                            <div className="flex items-start space-x-3">
                              <div 
                                className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-md shrink-0 cursor-pointer relative group/img bg-black/40"
                                onClick={() => setZoomedImage(child.image)}
                                title="Toque para ampliar foto"
                              >
                                <img 
                                  src={child.image} 
                                  alt={child.name} 
                                  className="w-full h-full object-cover object-top group-hover/img:scale-105 transition duration-300 select-none pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                                  <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-black text-white truncate">{child.name}</h4>
                                  <span className="text-[10px] text-purple-400 font-bold">#{idx + 1}</span>
                                </div>
                                <p className="text-[10px] text-purple-300 font-semibold">{getAgeDisplay(child.birthDate, child.age)} · {child.gender}</p>
                                
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {/* Status Badge */}
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    child.status === 'Apadrinhado' 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                      : child.status === 'Em Análise'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  }`}>
                                    {child.status}
                                  </span>

                                  {/* Approval Badge */}
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    isApproved 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                      : 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                                  }`}>
                                    {isApproved ? 'Aprovada (Área Pública)' : 'Em Análise (Apenas Admin)'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Presente Desejado & Tamanhos */}
                            {child.desiredGift && (
                              <div className="mt-2 text-[11px] text-amber-300 font-bold flex items-center space-x-1 truncate bg-[#140824] p-1.5 rounded-xl border border-purple-500/20">
                                <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate">{child.desiredGift}</span>
                              </div>
                            )}

                            <p className="text-xs text-purple-200 mt-2 line-clamp-2 italic leading-relaxed">
                              "{child.letter || child.dream}"
                            </p>
                          </div>

                          {/* Seletor rápido de Status no próprio card */}
                          <div className="pt-2 border-t border-purple-900/40 space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-purple-400 font-bold">Alterar Status:</span>
                              <select
                                value={child.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as any;
                                  setChildrenList(prev => {
                                    const updated = prev.map(c => c.id === child.id ? { ...c, status: newStatus } : c);
                                    try { localStorage.setItem('childrenList', JSON.stringify(updated)); } catch {}
                                    return updated;
                                  });
                                  setNotification(`Status de ${child.name} alterado para "${newStatus}"!`);
                                }}
                                className="bg-[#140824] border border-purple-500/40 rounded-lg px-2 py-1 text-white font-bold outline-none"
                              >
                                <option value="Aguardando Apadrinhamento">Aguardando</option>
                                <option value="Apadrinhado">Apadrinhado</option>
                                <option value="Em Análise">Em Análise</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => setSelectedChildForLetter(child)}
                                className="py-2 px-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-pink-300 text-[10px] font-black transition text-center truncate border border-purple-500/30"
                                title="Ver Cartinha"
                              >
                                Ver Carta
                              </button>
                              
                              <button
                                onClick={() => setEditingChildForModal({ ...child })}
                                className="py-2 px-1.5 rounded-xl bg-[#25153A] hover:bg-purple-800 text-amber-300 text-[10px] font-black transition text-center truncate border border-purple-500/30"
                                title="Editar Cadastro Completo"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  // Toggle status / approval
                                  const nextApproved = !child.approved;
                                  const nextStatus: 'Aguardando Apadrinhamento' | 'Em Análise' = nextApproved ? 'Aguardando Apadrinhamento' : 'Em Análise';
                                  setChildrenList(prev => {
                                    const updated = prev.map(c => c.id === child.id ? { ...c, approved: nextApproved, status: nextStatus } : c);
                                    try { localStorage.setItem('childrenList', JSON.stringify(updated)); } catch {}
                                    return updated;
                                  });
                                  setNotification(`Status de aprovação de ${child.name} atualizado para ${nextApproved ? 'Aprovada (Pública)' : 'Em Análise'}!`);
                                }}
                                className={`py-2 px-1.5 rounded-xl text-[10px] font-black transition text-center truncate border ${
                                  isApproved 
                                    ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border-amber-500/40' 
                                    : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border-emerald-500/40'
                                }`}
                                title={isApproved ? "Colocar em Análise (Ocultar da Área Pública)" : "Aprovar para Área Pública"}
                              >
                                {isApproved ? 'Em Análise' : 'Aprovar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Admin Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  setCameraTarget('gallery');
                  setIsLiveCameraOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-black text-xs shadow-lg flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Tirar Foto (Câmera)</span>
              </button>
              <button
                onClick={() => setCurrentScreenIndex(8)}
                className="p-3.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-white font-bold text-xs hover:border-pink-500 transition"
              >
                Ver Área Pública ({publicChildren.length})
              </button>
              <button
                onClick={() => setCurrentScreenIndex(9)}
                className="p-3.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-white font-bold text-xs hover:border-pink-500 transition"
              >
                Gerenciar Galeria
              </button>
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="p-3.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-amber-300 font-bold text-xs hover:border-amber-400 transition"
              >
                Configurar PIX
              </button>
            </div>
          </div>
        )}

        {/* ==================== 9:16 STORIES FULLSCREEN VIEW ==================== */}
        {currentScreenObj.id === 'stories_view' && (
          <div className="space-y-4 w-full animate-in fade-in duration-300">
            <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/40">
              <button 
                onClick={() => setCurrentScreenIndex(0)}
                className="p-2.5 rounded-2xl bg-[#1C0E33] border border-purple-500/30 text-purple-200 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">Momentos & Histórias (9:16)</h2>
                <p className="text-xs text-purple-300">{stories916.length} vídeos e fotos gravados</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pb-6">
              {stories916.map((st) => (
                <div 
                  key={st.id}
                  onClick={() => setSelectedStory916(st)}
                  className="aspect-[9/16] rounded-2xl overflow-hidden border-2 border-pink-500/40 relative cursor-pointer active:scale-95 transition shadow-lg group"
                >
                  {st.type === 'video' ? (
                    <video src={st.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={st.url} alt={st.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-black text-white truncate drop-shadow">{st.title}</span>
                    <p className="text-[10px] text-purple-300 truncate">{st.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Bottom Fixed Navigation Bar (Mobile & Tablet) */}
      {currentScreenObj.id !== 'admin_dashboard' && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#140824]/95 backdrop-blur-xl border-t border-purple-500/25 px-2 py-2 sm:py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
          <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
            <button
              type="button"
              onClick={() => setCurrentScreenIndex(0)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition active:scale-95 ${
                currentScreenIndex === 0
                  ? 'text-pink-400 font-extrabold bg-pink-500/15 shadow-inner'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold truncate">Início</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreenIndex(8)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition active:scale-95 ${
                currentScreenIndex === 8
                  ? 'text-pink-400 font-extrabold bg-pink-500/15 shadow-inner'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold truncate">Cartinhas</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreenIndex(5)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition active:scale-95 ${
                currentScreenIndex === 5
                  ? 'text-pink-400 font-extrabold bg-pink-500/15 shadow-inner'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold truncate">Padrinho</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreenIndex(4)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition active:scale-95 ${
                currentScreenIndex === 4
                  ? 'text-pink-400 font-extrabold bg-pink-500/15 shadow-inner'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold truncate">Família</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDonationModalOpen(true)}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-black shadow-lg shadow-pink-900/40 active:scale-95 transition"
            >
              <Gift className="w-5 h-5 mb-1 text-white" />
              <span className="text-[10px] font-black truncate">Doação</span>
            </button>
          </div>
        </nav>
      )}

      {/* 6. Modals Container */}
      <LetterModal 
        child={selectedChildForLetter}
        onClose={() => setSelectedChildForLetter(null)}
        onSponsor={handleSponsorChild}
        onZoomImage={setZoomedImage}
        getAgeDisplay={getAgeDisplay}
      />

      <DonationPixModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        pixKey={pixKey}
        pixBankName={pixBankName}
        pixQrCode={pixQrCode}
        donationCustomMessage={donationCustomMessage}
        onCopySuccess={(msg) => setNotification(msg)}
      />

      <NotificationModal 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notificationsList}
        onMarkAllAsRead={() => {
          setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
          setNotification('Todas as notifica\u00e7\u00f5es marcadas como lidas.');
        }}
        onClearNotifications={() => {
          setNotificationsList([]);
          setNotification('Hist\u00f3rico de notifica\u00e7\u00f5es limpo.');
        }}
        onRequestNativePermission={async () => {
          if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            setBrowserNotificationPermission(perm);
            if (perm === 'granted') {
              setNotification('Notifica\u00e7\u00f5es nativas ativadas!');
            }
          }
        }}
        nativePermission={browserNotificationPermission}
      />

      <SponsorCertificateModal 
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        child={selectedChildForCertificate}
        sponsorUser={sponsorUser}
        institutionName={institutionName}
      />

      <InAppCameraModal 
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        target={cameraTarget}
        onSavePhoto={(dataUrl, target) => {
          if (target === 'gallery') {
            setGalleryItems(prev => [dataUrl, ...prev]);
            setNotification('Foto salva na galeria!');
          } else if (target === 'media916') {
            const newSt: Media916 = {
              id: Date.now().toString(),
              type: 'image',
              url: dataUrl,
              title: 'Novo Momento',
              subtitle: 'Capturado pelo app'
            };
            setStories916(prev => [newSt, ...prev]);
            setNotification('Story 9:16 salvo!');
          }
          confetti({ particleCount: 40, spread: 50 });
        }}
        onNotify={(msg) => setNotification(msg)}
      />

      {/* Fullscreen Story Viewer Modal */}
      {selectedStory916 && (
        <div 
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setSelectedStory916(null)}
        >
          <div 
            className="relative w-full max-w-xs aspect-[9/16] bg-[#180E2B] rounded-[36px] overflow-hidden border-2 border-purple-500/40 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedStory916(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedStory916.type === 'video' ? (
              <video src={selectedStory916.url} autoPlay playsInline loop controls className="w-full h-full object-cover" />
            ) : (
              <img src={selectedStory916.url} alt={selectedStory916.title} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-5 flex flex-col justify-end pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-black w-fit mb-1.5 shadow">
                Momento Lar Esperan\u00e7a
              </span>
              <h3 className="text-base font-black text-white drop-shadow">{selectedStory916.title}</h3>
              <p className="text-xs text-purple-200 drop-shadow mt-0.5">{selectedStory916.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* High-Resolution Zoom Lightbox with Full Height and Uncropped View */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[160] bg-black/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[94vh] bg-[#160B28] rounded-[32px] p-3 sm:p-4 border-2 border-pink-500/60 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-900/50 px-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-pink-600/30 text-pink-300 border border-pink-500/40">
                  <ZoomIn className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">Visualização em Alta Resolução</h4>
                  <p className="text-[10px] text-purple-300">Foto nítida sem cortes · Toque fora para fechar</p>
                </div>
              </div>
              <button 
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded-2xl bg-purple-900/80 hover:bg-pink-600 text-white transition active:scale-95 shadow"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container with Full Height Object Contain so no edge is cropped */}
            <div className="w-full flex-1 max-h-[75vh] rounded-2xl overflow-hidden flex items-center justify-center bg-black/50 p-1 border border-white/5 shadow-inner">
              <img 
                src={zoomedImage} 
                alt="Visualização ampliada" 
                className="max-w-full max-h-[74vh] w-auto h-auto object-contain rounded-xl shadow-2xl select-none" 
              />
            </div>

            {/* Footer with Info and Direct Download option */}
            <div className="flex items-center justify-between pt-2.5 px-2 text-[11px] text-purple-300 border-t border-purple-900/50 mt-2">
              <span className="flex items-center space-x-1.5 font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lar Esperança · Corações que Acolhe</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  try {
                    const a = document.createElement('a');
                    a.href = zoomedImage;
                    a.download = `lar-esperanca-${Date.now()}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setNotification('Download da foto iniciado!');
                  } catch {
                    setNotification('Foto aberta em alta resolução.');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-pink-300 font-bold flex items-center space-x-1.5 border border-purple-500/30 active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Check Modal for Admin Panel Access (Supabase Auth) */}
      {isSecurityModalOpen && (
        <div 
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSecurityModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#1A1033] rounded-[32px] p-6 border-2 border-amber-500/50 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-purple-900/60">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Área Segura · Painel</h3>
              </div>
              <button onClick={() => setIsSecurityModalOpen(false)} className="p-1.5 text-purple-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-purple-200">
                Acesso restrito à coordenação do Lar Esperança. Identifique-se com suas credenciais do Supabase:
              </p>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-[11px] text-red-200 leading-snug">
                  {authError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-300 block">E-mail de Administrador</label>
                <input 
                  type="email"
                  placeholder="admin@laresperanca.org"
                  value={securityEmailInput}
                  onChange={(e) => setSecurityEmailInput(e.target.value)}
                  className="w-full bg-[#140824] border border-purple-500/40 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-300 block">Senha</label>
                <div className="relative">
                  <input 
                    type={showSecurityPassword ? "text" : "password"}
                    placeholder="Sua senha do Supabase"
                    value={securityPasswordInput}
                    onChange={(e) => setSecurityPasswordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleVerifySecurityCredentials(); }}
                    className="w-full bg-[#140824] border border-amber-500/40 rounded-xl pl-3 pr-10 py-2.5 text-white text-xs outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                  >
                    {showSecurityPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifySecurityCredentials}
                disabled={authLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-amber-500 text-white font-black text-xs shadow-xl active:scale-95 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>Autenticando via Supabase Auth...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-200" />
                    <span>Entrar com Supabase Auth</span>
                  </>
                )}
              </button>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[10px] text-purple-300 text-center">
                Acesso oficial protegido por Supabase Authentication. Sem senhas fixas no cliente.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-[#180E2B] h-full p-5 flex flex-col justify-between z-10 border-r border-purple-500/30 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="space-y-4">
              {/* Header with Project Avatar & Branding */}
              <div className="flex items-center justify-between pb-3.5 border-b border-purple-900/60">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-lg shrink-0 cursor-pointer"
                    onClick={() => setZoomedImage(adminAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop')}
                    title="Ver Foto do Projeto"
                  >
                    <img 
                      src={adminAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop'} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-black text-sm text-white truncate block">{projectName}</span>
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">{institutionName}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)} 
                  className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-purple-300 hover:text-white transition active:scale-95"
                  title="Fechar Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Lateral Original: 6 Itens Essenciais sem Duplicações */}
              <div className="space-y-2">
                {/* 1. Início */}
                <button 
                  onClick={() => { setCurrentScreenIndex(0); setIsMobileDrawerOpen(false); }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between font-bold text-xs ${
                    currentScreenIndex === 0 
                      ? 'bg-gradient-to-r from-pink-600/30 via-[#2E1844] to-[#1C0E2F] text-pink-200 border border-pink-500/40 shadow-lg' 
                      : 'bg-[#22133B] text-purple-200 border border-purple-500/20 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block">Início</span>
                      <span className="text-[10px] text-purple-300 font-normal block truncate">Página principal & novidades</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/60 shrink-0" />
                </button>

                {/* 2. Área da Família */}
                <button 
                  onClick={() => { setCurrentScreenIndex(4); setIsMobileDrawerOpen(false); }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between font-bold text-xs ${
                    currentScreenIndex === 4 
                      ? 'bg-gradient-to-r from-pink-600/30 via-[#2E1844] to-[#1C0E2F] text-pink-200 border border-pink-500/40 shadow-lg' 
                      : 'bg-[#22133B] text-purple-200 border border-purple-500/20 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block">Área da Família</span>
                      <span className="text-[10px] text-purple-300 font-normal block truncate">Acolhimento & cadastros</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/60 shrink-0" />
                </button>

                {/* 3. Área do Padrinho */}
                <button 
                  onClick={() => { setCurrentScreenIndex(5); setIsMobileDrawerOpen(false); }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between font-bold text-xs ${
                    currentScreenIndex === 5 
                      ? 'bg-gradient-to-r from-pink-600/30 via-[#2E1844] to-[#1C0E2F] text-pink-200 border border-pink-500/40 shadow-lg' 
                      : 'bg-[#22133B] text-purple-200 border border-purple-500/20 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block">Área do Padrinho</span>
                      <span className="text-[10px] text-purple-300 font-normal block truncate">Minhas crianças apadrinhadas</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/60 shrink-0" />
                </button>

                {/* 4. Doação (PIX) */}
                <button 
                  onClick={() => { setIsDonationModalOpen(true); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left p-3 rounded-2xl bg-[#22133B] hover:bg-[#2C194B] text-purple-200 border border-amber-500/30 hover:border-amber-400 transition flex items-center justify-between font-bold text-xs shadow-md"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-amber-200 text-xs block">Doação (PIX)</span>
                      <span className="text-[10px] text-amber-300/70 font-normal block truncate">Contribuições e amor</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400/60 shrink-0" />
                </button>

                {/* 5. Galeria de Fotos */}
                <button 
                  onClick={() => { setCurrentScreenIndex(9); setIsMobileDrawerOpen(false); }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between font-bold text-xs ${
                    currentScreenIndex === 9 
                      ? 'bg-gradient-to-r from-pink-600/30 via-[#2E1844] to-[#1C0E2F] text-pink-200 border border-pink-500/40 shadow-lg' 
                      : 'bg-[#22133B] text-purple-200 border border-purple-500/20 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block">Galeria de Fotos</span>
                      <span className="text-[10px] text-purple-300 font-normal block truncate">Momentos das crianças</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/60 shrink-0" />
                </button>

                {/* 6. Instalar Aplicativo */}
                <button 
                  onClick={() => { setCurrentScreenIndex(14); setIsMobileDrawerOpen(false); }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between font-bold text-xs ${
                    currentScreenIndex === 14 
                      ? 'bg-gradient-to-r from-pink-600/30 via-[#2E1844] to-[#1C0E2F] text-pink-200 border border-pink-500/40 shadow-lg' 
                      : 'bg-[#22133B] text-purple-200 border border-purple-500/20 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block">Instalar Aplicativo</span>
                      <span className="text-[10px] text-purple-300 font-normal block truncate">Instalação direta no celular</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/60 shrink-0" />
                </button>
              </div>

              {/* Nossas Redes Sociais Oficiais */}
              <div className="pt-3 border-t border-purple-900/50 space-y-2">
                <span className="text-[9px] uppercase tracking-widest font-black text-purple-400 px-1 block">
                  NOSSAS REDES
                </span>
                <div className="space-y-1.5">
                  {socialLinks.map(link => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`p-2 rounded-xl border ${link.borderColor} bg-[#140824] flex items-center space-x-2.5 hover:border-white/50 transition shadow-sm`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${link.color} text-white flex items-center justify-center font-black text-[10px] shadow`}>
                        {link.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white">{link.platform}</div>
                        <div className="text-[8px] text-purple-300">Acesse</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé do Menu: Botão Oficial Painel de Gestão (Área Segura) */}
            <div className="pt-4 border-t border-purple-900/60 mt-4">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  if (isSafePanelUnlocked) {
                    setCurrentScreenIndex(3);
                  } else {
                    setIsSecurityModalOpen(true);
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-pink-600 to-amber-600 hover:from-amber-500 hover:to-pink-500 text-white font-black text-xs shadow-xl flex items-center justify-center space-x-2 border border-amber-400/40 active:scale-95 transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>Painel de Gestão (Área Segura)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
