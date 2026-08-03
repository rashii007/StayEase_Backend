// Component with Tailwind
import { useTheme } from '../context/ThemeContext';

export default function Bookings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <button 
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      <h1 className="text-3xl font-bold text-blue-600">
        Booking Management
      </h1>
    </div>
  );
}