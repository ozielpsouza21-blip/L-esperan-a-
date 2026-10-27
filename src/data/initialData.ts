import { 
  Child, 
  BannerSlide, 
  Media916, 
  FooterButton, 
  EvangelicalTheme, 
  EvangelicalMessage, 
  SocialLink,
  UserProfile
} from '../types';
import { DEFAULT_ADMIN_PROFILE_ID, DEFAULT_FAMILY_PROFILE_ID, DEFAULT_SPONSOR_PROFILE_ID } from '../lib/supabase';

export const INITIAL_EVANGELICAL_THEMES: EvangelicalTheme[] = [
  {
    id: 'luz_divina',
    name: 'Luz Divina & Esperança',
    tagline: 'Ouro Celestial & Brilho Divino',
    bgGradient: 'from-amber-950/80 via-[#2A1840] to-amber-900/60',
    borderColor: 'border-amber-400/50',
    accentColor: '#F59E0B',
    iconBg: 'bg-amber-500/20 text-amber-300',
    textColor: 'text-amber-100',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'graca_paz',
    name: 'Graça & Paz Celestial',
    tagline: 'Azul Celestial da Glória',
    bgGradient: 'from-blue-950/80 via-[#1E1738] to-cyan-900/60',
    borderColor: 'border-sky-400/50',
    accentColor: '#38BDF8',
    iconBg: 'bg-sky-500/20 text-sky-300',
    textColor: 'text-sky-100',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'amor_agape',
    name: 'Amor Ágape de Cristo',
    tagline: 'Rubi Sagrado & Rosa de Saron',
    bgGradient: 'from-rose-950/80 via-[#2A1230] to-pink-900/60',
    borderColor: 'border-rose-400/50',
    accentColor: '#F43F5E',
    iconBg: 'bg-rose-500/20 text-rose-300',
    textColor: 'text-rose-100',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'bom_pastor',
    name: 'O Bom Pastor',
    tagline: 'Verde das Pastagens & Oliva da Paz',
    bgGradient: 'from-emerald-950/80 via-[#132A25] to-teal-900/60',
    borderColor: 'border-emerald-400/50',
    accentColor: '#10B981',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
    textColor: 'text-emerald-100',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'reino_gloria',
    name: 'Reino & Glória Eterna',
    tagline: 'Púrpura Real da Salvação',
    bgGradient: 'from-purple-950/80 via-[#260E3B] to-violet-900/60',
    borderColor: 'border-purple-400/50',
    accentColor: '#A855F7',
    iconBg: 'bg-purple-500/20 text-purple-300',
    textColor: 'text-purple-100',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'aguas_vivas',
    name: 'Fontes de Águas Vivas',
    tagline: 'Turquesa da Vida & Pureza',
    bgGradient: 'from-teal-950/80 via-[#102936] to-cyan-900/60',
    borderColor: 'border-cyan-400/50',
    accentColor: '#06B6D4',
    iconBg: 'bg-cyan-500/20 text-cyan-300',
    textColor: 'text-cyan-100',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  }
];

export const INITIAL_EVANGELICAL_MESSAGES: EvangelicalMessage[] = [
  {
    id: 'm1',
    verse: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.',
    reference: 'Jeremias 29:11',
    category: 'Esperança'
  },
  {
    id: 'm2',
    verse: 'Deixem vir a mim as crianças e não as impeçam; pois o Reino dos céus pertence aos que são semelhantes a elas.',
    reference: 'Mateus 19:14',
    category: 'Acolhimento'
  },
  {
    id: 'm3',
    verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta.',
    reference: '1 Coríntios 13:4,7',
    category: 'Amor'
  },
  {
    id: 'm4',
    verse: 'O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.',
    reference: 'Salmos 23:1-2',
    category: 'Paz & Proteção'
  },
  {
    id: 'm5',
    verse: 'Tudo posso naquele que me fortalece.',
    reference: 'Filipenses 4:13',
    category: 'Fé'
  },
  {
    id: 'm6',
    verse: 'Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.',
    reference: 'Provérbios 22:6',
    category: 'Cuidado'
  }
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop',
    title: 'Transforme um Sonho em Realidade',
    subtitle: 'Adote uma cartinha de Natal e faça uma criança do Lar Esperança sorrir.',
    badge: 'Campanha 2026'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&h=600&fit=crop',
    title: 'Amor que Acolhe e Protege',
    subtitle: 'Cada apadrinhamento cria um futuro cheio de luz e infinitas possibilidades.',
    badge: 'Lar Esperança'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=600&fit=crop',
    title: 'Solidariedade que Multiplica Bênçãos',
    subtitle: 'Apoie com presentes, calçados e doações diretas via PIX instantâneo.',
    badge: 'Faça a Diferença'
  }
];

export const INITIAL_STORIES_916: Media916[] = [
  {
    id: 's1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=450&h=800&fit=crop',
    title: 'Sorriso de Ana Clara',
    subtitle: 'Momentos especiais no ateliê de artes'
  },
  {
    id: 's2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=450&h=800&fit=crop',
    title: 'Lucas e o Futebol',
    subtitle: 'Treino da tarde com os amigos'
  },
  {
    id: 's3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=450&h=800&fit=crop',
    title: 'Gabriel Construindo Sonhos',
    subtitle: 'Brincadeiras e aprendizado no Lar'
  }
];

export const INITIAL_CHILDREN: Child[] = [
  {
    id: 'e05e4ec5-39f3-4a8b-8af7-82135637b698',
    family_id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Ayla',
    age: 7,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'brinquedos, presentes de Natal',
    dream: 'ganhar lindos presentes de Natal',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/18df26ac-e2f3-4160-b872-30dfb55ba6c0/o5jcmayt2m03hs.jpg',
    letter: 'Querido papai Noel meu nome é ayla e vou ficar muito feliz em ganhar lindos presentes!',
    wishlist: [{ name: 'Lindos presentes de Natal', price: 80 }]
  },
  {
    id: '9643e4be-a872-4aba-8684-51d1603d377f',
    family_id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Maria Elisa',
    age: 13,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'estudos, livros',
    dream: 'estudar e abençoar a todos',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/18df26ac-e2f3-4160-b872-30dfb55ba6c0/59pid078ymhsl5.jpg',
    letter: 'Querido papai noel, meu nome é Maria Elisa e agradeço por tudo, obrigada que Deus abençoe vocês!',
    wishlist: [{ name: 'Material escolar e presente de Natal', price: 80 }]
  },
  {
    id: 'dd241b54-f62f-4d37-b273-917dad9df867',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Mirella',
    age: 6,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'roupinhas, brinquedos, sandálias',
    dream: 'ganhar roupinha (tam 10), sandália (32/33) e brinquedo',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/6tchvz8gsrelj1.jpg',
    letter: 'Olá querido Papai Noel me chamo Mirella tenho 6 Anos vou fazer 7 dia 16/12 gostaria muito de ganhar uma Roupinha e uma Sandália de Natal e um brinquedo te amo padrinho papai Noel. Roupa 10 anos, calçado 32/33.',
    shoeSize: '32/33',
    clothesSize: '10 anos',
    wishlist: [{ name: 'Roupa 10 anos, Sandália 32/33 e Brinquedo', price: 80 }]
  },
  {
    id: 'a1a97dec-5b5f-4b18-98fa-df0e29444626',
    family_id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Arthur Guilherme',
    age: 9,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    likes: 'skate, esportes, roupas',
    dream: 'ganhar um skate e roupas de presente',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/qvks2wmlgd5oj3.jpg',
    letter: 'Querido papai noel meu nome é arthur Guilherme vou ficar muito feliz em ser apadrinhado, ganhar roupas e um skate!',
    wishlist: [{ name: 'Skate e roupas novas', price: 80 }]
  },
  {
    id: 'b0f403d2-322f-4141-b992-c4ace1a4ca50',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Rebeca',
    age: 7,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'roupas, sandálias, bonecas',
    dream: 'linda roupa (10 anos), sandália (33) e brinquedo',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/3kawg4bxaoyhri.jpg',
    letter: 'Olá querido Papai Noel me chamo Rebeca e nesse Natal gostaria de ganhar uma linda roupa e uma sandália e um brinquedo. Roupa 10 anos, calçado 33.',
    shoeSize: '33',
    clothesSize: '10 anos',
    wishlist: [{ name: 'Roupa tam 10, Sandália 33 e Brinquedo', price: 80 }]
  },
  {
    id: '842a066b-56e7-4a21-b254-cdffd830e8eb',
    family_id: '0b583f9e-94b1-46c6-a469-65f6765ac929',
    name: 'Jhonatan',
    age: 5,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    birthDate: '2020-12-24',
    likes: 'bicicleta, carrinhos, esportes',
    dream: 'ganhar uma bicicleta de aniversário e Natal',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/0b583f9e-94b1-46c6-a469-65f6765ac929/a7u2m3qda01cps.jpg',
    letter: 'Querido papai Noel me Chamo Jhonatan vou fazer 6 Anos dia 24 de Dezembro e gostaria muito de ganhar nesse natal uma roupas e calçados meu sonho é ganhar uma bicicleta te amo papai noel',
    wishlist: [{ name: 'Bicicleta infantil, Roupas e Calçados', price: 80 }]
  },
  {
    id: '6ffda42d-5eba-465d-a524-4a976559b8ba',
    family_id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Rebeca Victoria',
    age: 3,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'bonecas, roupinhas',
    dream: 'roupas de 5 anos e calçado tamanho 25/26',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/18df26ac-e2f3-4160-b872-30dfb55ba6c0/65yq0n30lumfyy.jpg',
    letter: 'Querido padrinhos meu nome é Rebeca Victoria tenho 3 anos Uso roupas de 5 anos meu pezinho é 25,26 Deus abençoe vcs!',
    shoeSize: '25/26',
    clothesSize: '5 anos',
    wishlist: [{ name: 'Roupas tam 5 e Calçado 25/26', price: 80 }]
  },
  {
    id: '785d8dac-874b-415e-a0c8-76d1a6a8118c',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Rhavi Lucas',
    age: 0,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    likes: 'brinquedos de bebê, roupinhas',
    dream: 'roupinha tamanho 1 ano e calçado 18/19 para o 1º Natal',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/85ump8qiilapui.jpg',
    letter: 'Olá Querido Papai Noel me chamo Rhavi Lucas vim aqui por meio dessa cartinha fazer um pequeno pedido pois será meu primeiro Natal e gostaria muito de uma roupinha e um calçado. Roupa tamanho 1 ano, calçado 18/19.',
    shoeSize: '18/19',
    clothesSize: '1 ano',
    wishlist: [{ name: 'Roupa tam 1 ano e Calçado 18/19', price: 80 }]
  },
  {
    id: 'afad80ec-0cd9-498e-b5f8-0d853bf2a8b1',
    family_id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Maya Rafaella',
    age: 0,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    birthDate: '2025-12-05',
    likes: 'brinquedos educativos, roupinhas',
    dream: 'ganhar roupas e brinquedos carinhosos',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/18df26ac-e2f3-4160-b872-30dfb55ba6c0/vffydxckp9d1o2.jpg',
    letter: 'Querido papai Noel me chamo Maya Rafaella tenho 10 meses e gostaria de ganhar roupas e brinquedos!',
    wishlist: [{ name: 'Roupas de bebê e Brinquedos', price: 80 }]
  },
  {
    id: 'dfd47ba2-915e-43f5-9360-086d91dfae45',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'João Miguel',
    age: 3,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    likes: 'Homem Aranha, Mickey, brinquedos',
    dream: 'roupa 4 anos e calçado 28/29 do Homem Aranha/Mickey',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/iv8819tgf7jhf4.jpg',
    letter: 'Querido papai Noel me chamo João Miguel tenho 3 Anos e gostaria muito de ganhar nesse Natal uma linda Roupa e um Calçado do Homem Aranha ou Mickey. Roupa tamanho 4 Anos, calçado tamanho 28/29.',
    shoeSize: '28/29',
    clothesSize: '4 anos',
    wishlist: [{ name: 'Roupa 4 anos e Calçado 28/29 Homem Aranha/Mickey', price: 80 }]
  },
  {
    id: 'adda238d-6c8c-4674-a0ff-638aa60ca399',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Lauriane (Acolhida Especial)',
    age: 18,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'sandálias, roupas bonitas',
    dream: 'roupa tamanho P e sandália 31/32',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/z4f8vwf149tnon.jpg',
    letter: 'Olá querido Papai Noel meu nome é Lauriany Tenho 18 aninhos gostaria de pedir uma Roupa e uma linda sandália. Roupa tamanho P, calçado 31/32.',
    shoeSize: '31/32',
    clothesSize: 'P',
    wishlist: [{ name: 'Roupa Tam P e Sandália 31/32', price: 80 }]
  },
  {
    id: '1f1fa052-9a50-4d6e-839c-b189fdc1e0bd',
    family_id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Thanischa',
    age: 7,
    gender: 'Menina',
    status: 'Aguardando Apadrinhamento',
    likes: 'roupas lindas, brinquedos, sandálias',
    dream: 'roupa tamanho 8 anos, sandália 31/32 e brinquedo',
    address: 'Lar Esperança',
    image: 'https://utrpckrchcbqgzbhvlzy.supabase.co/storage/v1/object/public/media/ab0ffd20-0846-44c0-9660-b79b6a3015f3/vyu5aui2ow9cp0.jpg',
    letter: 'Olá Querido Papai Noel me chamo Thanischa tenho 7 anos gostaria muito muito de ganhar nesse natal uma Roupa linda para eu Vestir e uma sandália linda e um brinquedo. Meu calçado 31/32, roupa tamanho 8 anos.',
    shoeSize: '31/32',
    clothesSize: '8 anos',
    wishlist: [{ name: 'Roupa Tam 8 anos, Sandália 31/32 e Brinquedo', price: 80 }]
  }
];

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: DEFAULT_ADMIN_PROFILE_ID,
    name: 'Lar Esperança - Gestão Central',
    email: 'contato@laresperanca.org',
    phone: '(11) 99803-0000',
    role: 'admin',
    bio: 'Coordenação e gestão central das crianças, apadrinhamentos e acolhimento.',
    photo_path: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    isLoggedIn: true
  },
  {
    id: DEFAULT_SPONSOR_PROFILE_ID,
    name: 'Oziel Pereira',
    email: 'ozielpsouza9803@gmail.com',
    phone: '(21) 99371-9730',
    role: 'sponsor',
    bio: 'Padrinho do coração. Dedicado a apoiar as crianças do Lar com amor e cuidado.',
    photo_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    familyMessage: 'Querida família e querido afilhado: como responsável e apoiador deste projeto, estou imensamente feliz em apoiar vocês e fazer parte deste lindo caminho! Que as bênçãos e a paz estejam sempre presentes no seu lar.',
    isLoggedIn: true
  },
  {
    id: DEFAULT_FAMILY_PROFILE_ID,
    name: 'Família Silva & Souza',
    email: 'familia.silva@laresperanca.org',
    phone: '(11) 99123-4567',
    role: 'family',
    bio: 'Família acolhedora dedicada a dar um lar com segurança, carinho e afeto.',
    photo_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isLoggedIn: true
  }
];

export const INITIAL_FOOTER_BUTTONS: FooterButton[] = [
  { id: '1', label: 'Início', iconName: 'home', targetScreenIndex: 0 },
  { id: '2', label: 'Cartinhas', iconName: 'heart', targetScreenIndex: 8 },
  { id: '3', label: 'Padrinho', iconName: 'user', targetScreenIndex: 5 },
  { id: '4', label: 'Família', iconName: 'users', targetScreenIndex: 4 },
  { id: '5', label: 'Doação', iconName: 'gift', isDonation: true }
];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: 'wa', platform: 'WhatsApp', url: 'https://wa.me/5511998030000', icon: 'WA', color: 'bg-emerald-600', borderColor: 'border-emerald-500/40' },
  { id: 'ig', platform: 'Instagram', url: 'https://instagram.com/laresperanca', icon: 'IG', color: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600', borderColor: 'border-pink-500/40' },
  { id: 'fb', platform: 'Facebook', url: 'https://facebook.com/laresperanca', icon: 'FB', color: 'bg-blue-600', borderColor: 'border-blue-500/40' },
  { id: 'yt', platform: 'YouTube', url: 'https://youtube.com/@laresperanca', icon: 'YT', color: 'bg-red-600', borderColor: 'border-red-500/40' }
];
