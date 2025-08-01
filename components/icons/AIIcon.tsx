
import React from 'react';

const AIIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 12h2" />
    <path d="M18 12h2" />
    <path d="M11 12h2" />
    <path d="M12 4v2" />
    <path d="M12 18v2" />
    <path d="M8.5 8.5l-1 1" />
    <path d="M16.5 8.5l-1 1" />
    <path d="M8.5 15.5l-1-1" />
    <path d="M16.5 15.5l-1-1" />
    <path d="M10 7V5c0-1.1.9-2 2-2s2 .9 2 2v2" />
    <path d="M10 17v2c0 1.1.9 2 2 2s2-.9 2-2v-2" />
    <path d="M7 10H5c-1.1 0-2 .9-2 2s.9 2 2 2h2" />
    <path d="M17 10h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2" />
  </svg>
);

export default AIIcon;
