import Image from 'next/image';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ name, image, size = 'md' }: UserAvatarProps) {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  
  if (image) {
    return (
      <div className={`${sizeClass[size]} rounded-full overflow-hidden`}>
        <Image
          src={image}
          alt={name || 'User'}
          width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
          height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
          className="object-cover"
        />
      </div>
    );
  }
  
  return (
    <div className={`${sizeClass[size]} rounded-full bg-gray-200 flex items-center justify-center text-black font-medium`}>
      {initial}
    </div>
  );
} 