interface TechLogoProps {
  name: string;
  className?: string;
}

export function TechLogo({ name, className = 'h-5 w-5' }: TechLogoProps) {
  const normalized = name.toLowerCase().trim();

  // React
  if (normalized.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="React">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00D8FF" strokeWidth="1.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#00D8FF" />
      </svg>
    );
  }

  // TypeScript
  if (normalized.includes('typescript')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="TypeScript">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M12.5 17.5V11H7.5V9H17.5V11H12.5V17.5Z" fill="white" />
        <path d="M21 15C21 16.5 19.8 17.5 17.5 17.5C15.8 17.5 14.5 16.8 14.2 15.2L16 14.5C16.2 15.3 16.7 15.8 17.5 15.8C18.3 15.8 18.8 15.4 18.8 14.8C18.8 14 18 13.7 17 13.2C15.5 12.5 14.5 11.8 14.5 10.2C14.5 8.9 15.6 7.8 17.3 7.8C18.8 7.8 19.8 8.4 20.2 9.7L18.5 10.3C18.3 9.7 17.8 9.3 17.2 9.3C16.6 9.3 16.2 9.6 16.2 10.1C16.2 10.7 16.8 11 17.8 11.5C19.5 12.3 21 13 21 15Z" fill="white" />
      </svg>
    );
  }

  // JavaScript
  if (normalized.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="JavaScript">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 16.5C7.8 17.3 9 17.6 10.2 17.6C12.4 17.6 13.5 16.4 13.5 14.2V9.5H11.5V14.2C11.5 15.1 11 15.6 10.1 15.6C9.3 15.6 8.7 15.2 8.3 14.7L7 16.5Z" fill="#232323" />
        <path d="M14.5 16.5C15.4 17.3 16.6 17.6 18 17.6C20.3 17.6 21.6 16.4 21.6 14.6C21.6 12.8 20.5 12.1 18.8 11.4L18.2 11.1C17.3 10.7 16.8 10.3 16.8 9.7C16.8 9.1 17.3 8.6 18.2 8.6C18.9 8.6 19.5 8.9 19.9 9.5L21.2 8.2C20.4 7.2 19.3 6.8 18.1 6.8C16.1 6.8 14.8 7.9 14.8 9.7C14.8 11.3 15.8 12.1 17.4 12.8L18 13.1C19.1 13.6 19.6 14.1 19.6 14.8C19.6 15.6 18.9 16.1 17.9 16.1C16.9 16.1 16.1 15.6 15.6 14.8L14.5 16.5Z" fill="#232323" />
      </svg>
    );
  }

  // HTML
  if (normalized.includes('html')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="HTML5">
        <path d="M3 2L5 20.5L12 22.5L19 20.5L21 2H3Z" fill="#E34F26" />
        <path d="M12 3.8V20.7L17.5 19.1L19.2 3.8H12Z" fill="#EF652A" />
        <path d="M7.4 7H16.6L16.3 10.3H10.7L10.9 12.8H16.1L15.6 17.2L12 18.2L8.4 17.2L8.2 14.5H6.2L6.6 18.8L12 20.3L17.4 18.8L18.2 8.8H7.2L7.4 7Z" fill="white" />
      </svg>
    );
  }

  // CSS
  if (normalized.includes('css') && !normalized.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="CSS3">
        <path d="M3 2L5 20.5L12 22.5L19 20.5L21 2H3Z" fill="#1572B6" />
        <path d="M12 3.8V20.7L17.5 19.1L19.2 3.8H12Z" fill="#33A9DC" />
        <path d="M7.4 7H16.6L16.4 9H9.7L9.9 11.2H16.2L15.7 16.5L12 17.5L8.3 16.5L8.1 14.5H6.1L6.5 18.3L12 19.8L17.5 18.3L18.2 7H7.4Z" fill="white" />
      </svg>
    );
  }

  // Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Tailwind CSS">
        <path d="M12 6C9.5 6 8 7.5 7.5 10.5C8.5 9 9.75 8.5 11.25 9C12.1 9.28 12.7 9.9 13.4 10.6C14.5 11.75 15.8 13 18.5 13C21 13 22.5 11.5 23 8.5C22 10 20.75 10.5 19.25 10C18.4 9.72 17.8 9.1 17.1 8.4C16 7.25 14.7 6 12 6ZM5.5 13C3 13 1.5 14.5 1 17.5C2 16 3.25 15.5 4.75 16C5.6 16.28 6.2 16.9 6.9 17.6C8 18.75 9.3 20 12 20C14.5 20 16 18.5 16.5 15.5C15.5 17 14.25 16.5 12.75 17C11.9 16.72 11.3 16.1 10.6 15.4C9.5 14.25 8.2 13 5.5 13Z" fill="#38BDF8" />
      </svg>
    );
  }

  // Vite
  if (normalized.includes('vite')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Vite">
        <path d="M21.5 3.5L12.5 21L3 4L11.5 6L21.5 3.5Z" fill="#BD34FE" />
        <path d="M17.5 3.5L12 15L8 5L17.5 3.5Z" fill="#41D1FF" />
        <path d="M13.5 4.5L10 11L13.5 11L11.5 16.5L16 9.5L13 9.5L13.5 4.5Z" fill="#FFD026" />
      </svg>
    );
  }

  // Python
  if (normalized.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Python">
        <path d="M11.8 2C7.3 2 7.6 3.9 7.6 3.9L7.6 5.9H12.2V6.6H5.4C3.2 6.6 2 7.9 2 10.1C2 12.4 3 13.5 5 13.5H6.2V11.8C6.2 9.8 7.8 8.2 9.8 8.2H14.5C15.7 8.2 16.7 7.2 16.7 6V3.8C16.7 2.6 15.5 2 11.8 2ZM9.6 3.4C10.2 3.4 10.7 3.9 10.7 4.5C10.7 5.1 10.2 5.6 9.6 5.6C9 5.6 8.5 5.1 8.5 4.5C8.5 3.9 9 3.4 9.6 3.4Z" fill="#3776AB" />
        <path d="M12.2 22C16.7 22 16.4 20.1 16.4 20.1V18.1H11.8V17.4H18.6C20.8 17.4 22 16.1 22 13.9C22 11.6 21 10.5 19 10.5H17.8V12.2C17.8 14.2 16.2 15.8 14.2 15.8H9.5C8.3 15.8 7.3 16.8 7.3 18V20.2C7.3 21.4 8.5 22 12.2 22ZM14.4 20.6C13.8 20.6 13.3 20.1 13.3 19.5C13.3 18.9 13.8 18.4 14.4 18.4C15 18.4 15.5 18.9 15.5 19.5C15.5 20.1 15 20.6 14.4 20.6Z" fill="#FFD43B" />
      </svg>
    );
  }

  // Java
  if (normalized.includes('java')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Java">
        <path d="M9.8 16.5C9.8 16.5 7.8 17.1 11.6 17.3C15.4 17.5 17.2 16.5 17.2 16.5C17.2 16.5 16 17.8 12.3 18C8.5 18.2 6.5 17.2 9.8 16.5Z" fill="#5382A1" />
        <path d="M8.2 14.2C8.2 14.2 6.2 15 11 15.3C15.8 15.6 17.8 14.2 17.8 14.2C17.8 14.2 16.5 15.8 11.8 16C7.1 16.2 5.5 14.9 8.2 14.2Z" fill="#E76F00" />
        <path d="M13.2 3C13.2 3 14.8 4.6 12.4 7.2C10.5 9.3 11 10.6 11 10.6C11 10.6 8.5 9.2 10.2 7.1C11.9 5 13.2 3 13.2 3Z" fill="#E76F00" />
        <path d="M15.4 6.2C15.4 6.2 17.2 8.1 14.4 11.2C12.2 13.6 13 14.9 13 14.9C13 14.9 10.4 13.3 12.1 10.8C13.9 8.3 15.4 6.2 15.4 6.2Z" fill="#5382A1" />
        <path d="M5 20.5C8 21.5 16 21.5 19 20.5C17.5 21.8 11.5 22.2 5 20.5Z" fill="#5382A1" />
      </svg>
    );
  }

  // C++
  if (normalized.includes('c++')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="C++">
        <rect width="24" height="24" rx="4" fill="#00599C" />
        <path d="M10 8.5C8.5 8.5 7.5 9.7 7.5 12C7.5 14.3 8.5 15.5 10 15.5C11 15.5 11.8 14.8 12.2 13.8H14.5C13.8 16.2 12.2 17.5 10 17.5C7 17.5 5 15.2 5 12C5 8.8 7 6.5 10 6.5C12.2 6.5 13.8 7.8 14.5 10.2H12.2C11.8 9.2 11 8.5 10 8.5Z" fill="white" />
        <path d="M15.5 11.2H17V9.8H18V11.2H19.5V12.2H18V13.8H17V12.2H15.5V11.2ZM19.8 11.2H21.3V9.8H22.3V11.2H23.8V12.2H22.3V13.8H21.3V12.2H19.8V11.2Z" fill="#004482" />
        <path d="M15.5 11.2H17V9.8H18V11.2H19.5V12.2H18V13.8H17V12.2H15.5V11.2Z" fill="white" />
        <path d="M19.8 11.2H21.3V9.8H22.3V11.2H23.8V12.2H22.3V13.8H21.3V12.2H19.8V11.2Z" fill="white" />
      </svg>
    );
  }

  // Firebase
  if (normalized.includes('firebase')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Firebase">
        <path d="M4.5 18L10 3.5L13.2 9.5L4.5 18Z" fill="#FFA000" />
        <path d="M4.5 18L19.5 18L17.5 4.5L4.5 18Z" fill="#FFCA28" />
        <path d="M12 21.5C17.2 21.5 21 18.5 21 18.5L17.5 4.5L12 21.5Z" fill="#F57C00" />
      </svg>
    );
  }

  // Supabase
  if (normalized.includes('supabase')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Supabase">
        <path d="M12.8 2L3.5 14H12L10.5 22L20.5 9.5H12L12.8 2Z" fill="#3ECF8E" />
      </svg>
    );
  }

  // PostgreSQL / SQL / Database
  if (normalized.includes('postgres') || normalized.includes('sql') || normalized.includes('database') || normalized.includes('dbms')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Database / SQL">
        <path d="M12 3C7.5 3 4 4.3 4 6V18C4 19.7 7.5 21 12 21C16.5 21 20 19.7 20 18V6C20 4.3 16.5 3 12 3Z" stroke="#336791" strokeWidth="1.5" />
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="#336791" fillOpacity="0.2" stroke="#336791" strokeWidth="1.5" />
        <path d="M4 11C4 12.7 7.5 14 12 14C16.5 14 20 12.7 20 11" stroke="#336791" strokeWidth="1.5" />
        <path d="M4 16C4 17.7 7.5 19 12 19C16.5 19 20 17.7 20 16" stroke="#336791" strokeWidth="1.5" />
      </svg>
    );
  }

  // Git
  if (normalized === 'git' || normalized.includes('git ') || normalized.startsWith('git')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Git">
        <path d="M22.1 10.6L13.4 1.9C12.6 1.1 11.3 1.1 10.5 1.9L8.7 3.7L11 6C11.6 5.8 12.4 5.9 12.9 6.5C13.5 7.1 13.6 7.9 13.3 8.6L15.5 10.8C16.2 10.5 17 10.6 17.6 11.2C18.4 12 18.4 13.3 17.6 14.1C16.8 14.9 15.5 14.9 14.7 14.1C14.1 13.5 14 12.7 14.3 12L12.2 9.9V15.2C12.4 15.4 12.6 15.7 12.6 16.1C12.6 17.2 11.7 18.1 10.6 18.1C9.5 18.1 8.6 17.2 8.6 16.1C8.6 15.3 9.1 14.6 9.8 14.3V8.8L3.7 14.9C2.9 15.7 2.9 17 3.7 17.8L12.4 26.5C13.2 27.3 14.5 27.3 15.3 26.5L22.1 19.7C22.9 18.9 22.9 17.6 22.1 16.8L22.1 10.6Z" fill="#F05032" />
      </svg>
    );
  }

  // GitHub
  if (normalized.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  // Docker
  if (normalized.includes('docker')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Docker">
        <path d="M22.5 12.5C22 12.5 21.2 12.8 20.8 13.2C20.4 12 19 11 17.5 11C17.2 11 16.9 11.1 16.6 11.2C15.8 9.5 14 8.5 12 8.5V11H14.5V13.5H12V16H2V17C2 19.5 5 21.5 11.5 21.5C18 21.5 21.8 17.5 22.5 12.5Z" fill="#2496ED" />
        <rect x="3" y="11" width="2.2" height="2.2" fill="#2496ED" />
        <rect x="6" y="11" width="2.2" height="2.2" fill="#2496ED" />
        <rect x="9" y="11" width="2.2" height="2.2" fill="#2496ED" />
        <rect x="6" y="8" width="2.2" height="2.2" fill="#2496ED" />
        <rect x="9" y="8" width="2.2" height="2.2" fill="#2496ED" />
        <rect x="9" y="5" width="2.2" height="2.2" fill="#2496ED" />
      </svg>
    );
  }

  // Linux
  if (normalized.includes('linux')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Linux">
        <path d="M12 2C9.5 2 8 4 8 7V11C6.5 12 5 14 5 17C5 20 8 21 12 21C16 21 19 20 19 17C19 14 17.5 12 16 11V7C16 4 14.5 2 12 2Z" fill="#FCC624" />
        <path d="M12 3C10 3 9 4.5 9 7V10C9 10 10.5 11 12 11C13.5 11 15 10 15 10V7C15 4.5 14 3 12 3Z" fill="#232323" />
        <circle cx="10.5" cy="6.5" r="1" fill="white" />
        <circle cx="13.5" cy="6.5" r="1" fill="white" />
        <circle cx="10.8" cy="6.5" r="0.4" fill="black" />
        <circle cx="13.2" cy="6.5" r="0.4" fill="black" />
        <path d="M11 8C11 8 11.5 9 12 9C12.5 9 13 8 13 8L12.5 8.5H11.5L11 8Z" fill="#E69F00" />
      </svg>
    );
  }

  // VS Code
  if (normalized.includes('vs code') || normalized.includes('vscode')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="VS Code">
        <path d="M17.5 2L5.5 10.5L2 8L1 9L4.5 12L1 15L2 16L5.5 13.5L17.5 22L23 19.5V4.5L17.5 2ZM17.5 7.5L9.5 12L17.5 16.5V7.5Z" fill="#007ACC" />
      </svg>
    );
  }

  // Postman
  if (normalized.includes('postman')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Postman">
        <circle cx="12" cy="12" r="10" fill="#FF6C37" />
        <path d="M6 13L16 7L13 17L11 13L6 13Z" fill="white" />
      </svg>
    );
  }

  // OpenCV
  if (normalized.includes('opencv')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="OpenCV">
        <circle cx="12" cy="7" r="4.5" stroke="#EA4335" strokeWidth="2" />
        <circle cx="7" cy="16" r="4.5" stroke="#4285F4" strokeWidth="2" />
        <circle cx="17" cy="16" r="4.5" stroke="#34A853" strokeWidth="2" />
      </svg>
    );
  }

  // Machine Learning / AI
  if (normalized.includes('machine learning') || normalized.includes('ai') || normalized.includes('llm')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="AI / ML">
        <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinejoin="round" fill="#8B5CF6" fillOpacity="0.15" />
        <circle cx="12" cy="11" r="2.5" fill="#8B5CF6" />
      </svg>
    );
  }

  // Security / Cybersecurity
  if (normalized.includes('security') || normalized.includes('cybersecurity') || normalized.includes('osint')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Security">
        <path d="M12 2L4 6V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V6L12 2Z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round" fill="#10B981" fillOpacity="0.15" />
        <path d="M12 8V14M12 17H12.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Computer Networks / Analysis
  if (normalized.includes('network') || normalized.includes('pcap')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Computer Networks">
        <rect x="3" y="4" width="6" height="5" rx="1.5" stroke="#0284C7" strokeWidth="1.5" fill="#0284C7" fillOpacity="0.2" />
        <rect x="15" y="4" width="6" height="5" rx="1.5" stroke="#0284C7" strokeWidth="1.5" fill="#0284C7" fillOpacity="0.2" />
        <rect x="9" y="15" width="6" height="5" rx="1.5" stroke="#0284C7" strokeWidth="1.5" fill="#0284C7" fillOpacity="0.2" />
        <path d="M6 9V12H18V9M12 12V15" stroke="#0284C7" strokeWidth="1.5" />
      </svg>
    );
  }

  // REST APIs
  if (normalized.includes('api') || normalized.includes('rest')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="API">
        <path d="M4 12H20M4 6H12M4 18H16" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="18" r="2.5" fill="#F97316" />
        <circle cx="14" cy="6" r="2.5" fill="#F97316" />
      </svg>
    );
  }

  // Data Structures & Algorithms / Problem Solving / CS Core
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label={name}>
      <circle cx="12" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 7L7.5 14.5M13.5 7L16.5 14.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
