import { TbDeviceGamepad, TbHome, TbList, TbMessage, TbRobotFace, TbSettings, TbNews, TbCurrencyDollar, TbChecklist } from 'react-icons/tb';

export const navItems = [
  {
    id: '/',
    fa_label: 'خانه',
    emoji: '🏠',
    icon: TbHome,
    description: 'ورود به داشبورد و مشاهده خلاصه‌ای از امکانات',
  },
  {
    id: '/chat',
    fa_label: 'گفتگوها',
    emoji: '💬',
    icon: TbMessage,
    description: 'چت با دوستان، مخاطبان و گروه‌ها',
  },
  {
    id: '/zita-gpt',
    fa_label: 'دستیار Zita',
    emoji: '🧠',
    icon: TbRobotFace,
    description: 'گفتگو با هوش مصنوعی برای پاسخ به سوالاتت',
  },
  {
    id: '/game',
    fa_label: 'بازی و رقابت',
    emoji: '🎮',
    icon: TbDeviceGamepad,
    description: 'بازی کن، امتیاز بگیر و وارد جدول رتبه‌بندی شو',
  },
  {
    id: '/todo',
    fa_label: 'لیست کارها',
    emoji: '📝',
    icon: TbChecklist,
    description: 'وظایف روزانه‌ات رو مدیریت کن و برنامه‌ریزی داشته باش',
  },
  {
    id: '/crypto',
    fa_label: 'قیمت ارز دیجیتال',
    emoji: '💸',
    icon: TbCurrencyDollar,
    description: 'بررسی قیمت لحظه‌ای بیت‌کوین، تتر، ترون و دیگر ارزها',
  },
  {
    id: '/news',
    fa_label: 'اخبار روز',
    emoji: '🗞️',
    icon: TbNews,
    description: 'مطالب و خبرهای جدید و جذاب را از اینجا بخوان',
  },
];
export const avatars = [
  { src: '/assets/avatars/male-avatar-0.png', gender: 'male' },
  { src: '/assets/avatars/male-avatar-1.png', gender: 'male' },
  { src: '/assets/avatars/male-avatar-2.png', gender: 'male' },
  { src: '/assets/avatars/male-avatar-3.png', gender: 'male' },
  { src: '/assets/avatars/female-avatar-0.png', gender: 'female' },
  { src: '/assets/avatars/female-avatar-1.png', gender: 'female' },
  { src: '/assets/avatars/female-avatar-2.png', gender: 'female' },
  { src: '/assets/avatars/female-avatar-3.png', gender: 'female' },
];
