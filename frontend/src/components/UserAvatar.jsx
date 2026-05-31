import { getInitials, getAvatarGradient } from '../utils/avatar';

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

export default function UserAvatar({
  name,
  email,
  size = 'md',
  className = '',
  showRing = false,
}) {
  const px = SIZES[size] || SIZES.md;
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name || email || 'user');

  return (
    <div
      className={`user-avatar user-avatar-${size} ${showRing ? 'user-avatar-ring' : ''} ${className}`}
      style={{
        width: px,
        height: px,
        background: gradient,
      }}
      title={name || email}
      role="img"
      aria-label={name ? `Avatar for ${name}` : 'User avatar'}
    >
      <span className="user-avatar-initials">{initials}</span>
    </div>
  );
}
