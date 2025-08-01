
import React from 'react';

const LinuxIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M14.28 9.55a1.5 1.5 0 0 0-2.56 0" />
    <path d="M15.13 13.88a1.5 1.5 0 0 0-1.5-2.63 1.5 1.5 0 0 0-1.5 2.63" />
    <path d="M12.03 18.5h.01" />
    <path d="M19.66 12.5c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 3.25 1.72 6.1 4.34 7.66" />
    <path d="M12 21.5c1.67 0 3.24-.43 4.66-1.19" />
    <path d="M2.34 12.5c0-1.56.4-3.03 1.12-4.33" />
    <path d="M12 2.5c-1.67 0-3.24.43-4.66 1.19" />
    <path d="M21.66 12.5c0 1.56-.4 3.03-1.12 4.33" />
    <path d="m9 12-2-3" />
  </svg>
);

export default LinuxIcon;
