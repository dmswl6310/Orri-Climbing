interface IconProps {
  className?: string;
}

const GpsIcon = ({ className = "w-4 h-4" }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 바깥 원 */}
      <circle
        cx="12"
        cy="12"
        r="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 중앙 점 */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      {/* 사방 뻗은 선 */}
      <path strokeLinecap="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
    </svg>
  );
};

export default GpsIcon;
