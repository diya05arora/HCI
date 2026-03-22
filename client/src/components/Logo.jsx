function Logo() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="app-logo"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Senior Care Companion Logo"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="var(--primary-light)" stroke="var(--primary)" strokeWidth="2" />
      
      {/* Heart shape - represents care */}
      <path
        d="M50 85 C25 70, 15 55, 15 42 C15 32, 22 25, 30 25 C37 25, 43 31, 50 38 C57 31, 63 25, 70 25 C78 25, 85 32, 85 42 C85 55, 75 70, 50 85 Z"
        fill="var(--primary)"
      />
      
      {/* Plus symbol - represents health/wellness */}
      <g
        style={{
          transform: 'translate(50px, 50px)',
          transformOrigin: '0 0'
        }}
      >
        <rect
          x="-2"
          y="-10"
          width="4"
          height="20"
          fill="#ffffff"
          opacity="0.9"
        />
        <rect
          x="-10"
          y="-2"
          width="20"
          height="4"
          fill="#ffffff"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}

export default Logo;
