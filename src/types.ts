export type Screen = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'admin_dashboard' 
  | 'family_profile' 
  | 'sponsor_profile' 
  | 'child_profile' 
  | 'approval_workflow' 
  | 'waiting_area' 
  | 'gallery' 
  | 'photo_editor' 
  | 'media_management' 
  | 'settings' 
  | 'menu_drawer' 
  | 'pwa_install'
  | 'stories_view';

export interface Child {
  id: string;
  family_id?: string;
  name: string;
  age: number;
  gender: string;
  status: 'Aguardando Apadrinhamento' | 'Em Análise' | 'Apadrinhado';
  likes: string;
  dream: string;
  address: string;
  image: string;
  letter: string;
  wishlist: { name: string; price: number }[];
  sponsorName?: string;
  sponsorId?: string;
  familyEmail?: string;
  birthDate?: string;
  desiredGift?: string;
  shoeSize?: string;
  clothesSize?: string;
}

export interface LocalAppNotification {
  id: string;
  title: string;
  body: string;
  type: 'new_child' | 'status_change' | 'system';
  timestamp: string;
  read: boolean;
  childId?: string;
  childName?: string;
}

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface Media916 {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  subtitle: string;
}

export interface FooterButton {
  id: string;
  label: string;
  iconName: 'home' | 'user' | 'users' | 'gift' | 'heart' | 'star' | 'sparkles' | 'video';
  targetScreenIndex?: number;
  isDonation?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  photo_path?: string;
  bio: string;
  familyMessage?: string;
  isLoggedIn: boolean;
  password?: string;
  role?: string;
}

export interface EvangelicalTheme {
  id: string;
  name: string;
  tagline: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  iconBg: string;
  textColor: string;
  badgeBg: string;
}

export interface EvangelicalMessage {
  id: string;
  verse: string;
  reference: string;
  category: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  borderColor: string;
}
