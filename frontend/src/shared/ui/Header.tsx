import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { MdPersonOutline } from "react-icons/md";
import { IoWalletOutline, IoLogOutOutline, IoChevronDown } from "react-icons/io5";

export default function Header() {
  const { logOut, user } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logOut();
  };

  return (
    <header className="bg-black border-b border-gray-600">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex justify-center items-center">
            <Link to="/">
              <span className="font-black text-2xl text-white tracking-tight">
                CODE<span className="text-indigo-500">HIVE</span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#product"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Product
            </a>
            <a
              href="#features"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            <Link
              to={"/qna"}
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Q&A
            </Link>
            <Link
              to={"/session"}
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Session
            </Link>
            <a
              href="#pricing"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
          </nav>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <MdPersonOutline className="text-white w-5 h-5" />
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {user ? user.firstName : "Guest"}
              </span>
              <IoChevronDown
                className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right">
                <div className="rounded-xl border border-gray-700/50 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800/50 hover:text-white transition-colors duration-150"
                  >
                    <MdPersonOutline className="w-5 h-5 text-gray-400" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/wallet"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800/50 hover:text-white transition-colors duration-150"
                  >
                    <IoWalletOutline className="w-5 h-5 text-gray-400" />
                    <span>Wallet</span>
                  </Link>

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
                    >
                      <IoLogOutOutline className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
