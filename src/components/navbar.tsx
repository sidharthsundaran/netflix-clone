import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import '../App.css'
import { FaSearch, FaBell, FaCaretDown ,FaUsers, FaExchangeAlt, FaCog, FaQuestionCircle } from 'react-icons/fa';


export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all ${isScrolled ? "bg-black/90 shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-6 py-4 sm:px-12">
        <div className="flex items-center gap-6">
          <img
            src="/Logo.png"
            alt="Netflix Logo"
            className="w-24 object-contain"
          />
          <ul className="hidden md:flex gap-5 text-white font-medium text-sm">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>
            <li className="hover:text-gray-300 cursor-pointer">TV Shows</li>
            <li className="hover:text-gray-300 cursor-pointer">Movies</li>
            <li className="hover:text-gray-300 cursor-pointer">Games</li>
            <li className="hover:text-gray-300 cursor-pointer">New & Popular</li>
            <li className="hover:text-gray-300 cursor-pointer">My List</li>
            <li className="hover:text-gray-300 cursor-pointer">Browse by Languages</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 text-white">
          {/* {user && <p className="text-sm hidden sm:block">Hi, {user}</p>} */}

          <FaSearch className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <p className="hover:text-gray-300 cursor-pointer hidden md:flex gap-5 text-white font-medium text-sm">Children</p>
          <FaBell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <img src="/batman.png" alt="Profile" className="w-8 h-8 rounded-md cursor-pointer" />
          <div className="relative">
            <button
              className="flex items-center gap-2 text-white hover:text-gray-300 focus:outline-none bg-transparent"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <FaCaretDown />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 shadow-lg rounded-md text-white text-sm">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3">
                    <img src="/batman.png" alt="Profile" className="w-8 h-8 rounded-md cursor-pointer" />
                    <span>{user}</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3">
        <FaUsers /> <span>Manage Profiles</span>
      </li>
      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3">
        <FaExchangeAlt /> <span>Transfer Profile</span>
      </li>
      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3">
        <FaCog /> <span>Account</span>
      </li>
      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3">
        <FaQuestionCircle /> <span>Help Center</span>
      </li>

                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer border-t border-gray-600" onClick={logout}>
                    Sign out of Netflix
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

}
