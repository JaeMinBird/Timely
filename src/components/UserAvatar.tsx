import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  userId?: string; // Optional user ID to fetch specific user data
}

export default function UserAvatar({ name, image, size = 'md', userId }: UserAvatarProps) {
  const { data: session } = useSession();
  
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  // Use provided props first, fall back to session data if available
  const userName = name || (userId ? undefined : session?.user?.name) || 'User';
  const userImage = image || (userId ? undefined : session?.user?.image);
  const initial = userName.charAt(0).toUpperCase();
  
  if (userImage) {
    return (
      <div className={`${sizeClass[size]} rounded-full overflow-hidden`}>
        <Image
          src={userImage}
          alt={userName}
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