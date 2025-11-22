// Islamic profile icons that users can choose
export const profileIcons = [
  { id: 'kaaba', emoji: '🕋', name: 'Kaaba' },
  { id: 'mosque', emoji: '🕌', name: 'Mosque' },
  { id: 'prayer', emoji: '🤲', name: 'Dua Hands' },
  { id: 'quran', emoji: '📖', name: 'Quran' },
  { id: 'crescent', emoji: '☪️', name: 'Crescent' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'book', emoji: '📚', name: 'Books' },
  { id: 'heart', emoji: '💚', name: 'Green Heart' },
  { id: 'light', emoji: '💡', name: 'Light' },
  { id: 'peace', emoji: '☮️', name: 'Peace' },
  { id: 'wisdom', emoji: '🦉', name: 'Wisdom' },
  { id: 'flower', emoji: '🌸', name: 'Flower' },
  { id: 'crown', emoji: '👑', name: 'Crown' },
  { id: 'gem', emoji: '💎', name: 'Gem' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle' },
  { id: 'sun', emoji: '☀️', name: 'Sun' },
  { id: 'moon', emoji: '🌙', name: 'Moon' },
  { id: 'dove', emoji: '🕊️', name: 'Dove' }
];

export const getProfileIcon = (iconId) => {
  const icon = profileIcons.find(i => i.id === iconId);
  return icon ? icon.emoji : '🕋'; // Default to Kaaba
};
