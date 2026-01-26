interface IconProps {
  className?: string;
}

const RefreshIcon = ({ className = "w-4 h-4" }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4v5h5M20 20v-5h-5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 9A9 9 0 005.64 5.64L4 9m0 6a9 9 0 0014.36 3.36L20 15"
      />
    </svg>
  );
};

export default RefreshIcon;
