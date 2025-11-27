import React, { useState } from 'react';
import { Search, Menu, Play, X, LogOut, User as UserIcon, CloudUpload, Film } from 'lucide-react';
import { NavItem, User } from '../types';
import { Button } from './Button';

const navItems: NavItem[] = [
  { label: 'Home', id: 'home', active: true },
  { label: 'TV Series', id: 'series' },
  { label: 'Categories', id: 'categories' },
  { label: 'Animation', id: 'animation' },
  { label: 'Romance', id: 'romance' },
  { label: '18+ Movies', id: '18+' },
];

interface NavbarProps {
  user: User | null;
  currentView: string;
  onLoginClick: () => void;
  onLogout: () => void;
  onUploadClick: () => void;
  onNavigate: (viewId: string) => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  currentView,
  onLoginClick, 
  onLogout, 
  onUploadClick,
  onNavigate,
  onSearch
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-[#020617] text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                 <Film className="w-10 h-10 text-amber-400 group-hover:text-amber-300 transition-colors" />
                 <Play className="w-4 h-4 text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-black text-xl tracking-wider text-amber-400 leading-none">THREE</span>
                <span className="font-bold text-lg tracking-wide text-white leading-none">FILMS</span>
              </div>
            </button>
            
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-2 xl:space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === item.id 
                        ? 'text-amber-400 bg-slate-900' 
                        : 'text-gray-300 hover:text-amber-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Login & Search */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="secondary" 
                  className="px-3 py-1 flex items-center gap-2 text-xs"
                  onClick={onUploadClick}
                >
                  <CloudUpload size={16} /> Upload
                </Button>

                <div className="flex items-center gap-2 text-slate-300">
                   <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-400 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={16} className="text-amber-400" />
                      )}
                   </div>
                   <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Button onClick={onLoginClick}>Login</Button>
            )}
            
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-3 pr-10 py-2 w-40 lg:w-64 rounded-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button 
                onClick={() => onSearch(searchTerm)}
                className="absolute right-0 top-0 bottom-0 bg-amber-400 px-3 hover:bg-amber-500 transition-colors flex items-center justify-center rounded-r-sm"
              >
                <Search className="text-black w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button - Triple Line */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 pb-4 absolute w-full shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                   currentView === item.id 
                        ? 'text-amber-400 bg-slate-800 border-l-4 border-amber-400' 
                        : 'text-gray-300 hover:text-amber-400 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="px-4 space-y-4 pt-2 border-t border-slate-800">
             {user ? (
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-slate-300 p-2 bg-slate-800 rounded">
                   <div className="flex items-center gap-2">
                      <UserIcon size={18} className="text-amber-400" />
                      <span>{user.name}</span>
                   </div>
                   <button onClick={onLogout} className="text-red-500 text-sm font-bold">Logout</button>
                 </div>
                 <Button onClick={onUploadClick} className="w-full flex items-center gap-2 justify-center">
                    <CloudUpload size={18} /> Upload Film
                 </Button>
               </div>
             ) : (
                <Button className="w-full" onClick={() => {
                  onLoginClick();
                  setIsMenuOpen(false);
                }}>Login</Button>
             )}
             
             <div className="flex w-full">
              <input 
                type="text" 
                placeholder="Search movies..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-3 py-2 w-full rounded-l-sm text-black focus:outline-none"
              />
              <button className="bg-amber-400 px-4 hover:bg-amber-500 rounded-r-sm">
                <Search className="text-black w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};