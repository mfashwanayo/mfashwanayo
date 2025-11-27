import React, { useState, useRef, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Music } from 'lucide-react';

interface FooterProps {
  onNavigate: (viewId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showInstaMenu, setShowInstaMenu] = useState(false);
  const instaMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (instaMenuRef.current && !instaMenuRef.current.contains(event.target as Node)) {
        setShowInstaMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-slate-900 mt-12 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-400 inline-block pb-1">Movies</h3>
            <ul className="space-y-2 text-sm flex flex-col items-start">
              <li><button onClick={() => onNavigate('romance')} className="hover:text-amber-400 transition-colors text-left">Romantic</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors text-left">Action</button></li>
              <li><button onClick={() => onNavigate('animation')} className="hover:text-amber-400 transition-colors text-left">Cartoon</button></li>
              <li><button onClick={() => onNavigate('categories')} className="hover:text-amber-400 transition-colors text-left">Sci-Fi</button></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-400 inline-block pb-1">About</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Company</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Legacy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-400 inline-block pb-1">Services</h3>
            <ul className="space-y-2 text-sm flex flex-col items-start">
              <li><button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors text-left">Movies</button></li>
              <li><button onClick={() => onNavigate('series')} className="hover:text-amber-400 transition-colors text-left">Series</button></li>
              <li><button onClick={() => onNavigate('animation')} className="hover:text-amber-400 transition-colors text-left">Kids/Cartoon</button></li>
              <li>
                <button 
                  onClick={() => onNavigate('songs')} 
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2 group"
                >
                  Songs 
                  <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-sm uppercase font-bold transition-transform group-hover:scale-110 flex items-center gap-1">
                    <Music size={8} /> Bonus
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-400 inline-block pb-1">Connect</h3>
            <div className="flex space-x-4 mb-4 items-center">
              
              {/* Facebook - Aime Prince */}
              <a 
                href="https://www.facebook.com/search/people/?q=Aime%20Prince" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Aime Prince"
                className="bg-slate-800 p-2 rounded-full hover:bg-[#1877F2] hover:text-white transition-colors"
              >
                <Facebook size={18} />
              </a>
              
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-sky-500 hover:text-white transition-colors"><Twitter size={18} /></a>
              
              {/* Instagram with Menu */}
              <div className="relative" ref={instaMenuRef}>
                <button 
                  onClick={() => setShowInstaMenu(!showInstaMenu)}
                  className={`bg-slate-800 p-2 rounded-full hover:bg-gradient-to-tr hover:from-[#fdf497] hover:via-[#fd5949] hover:to-[#d6249f] hover:text-white transition-colors ${showInstaMenu ? 'text-amber-400' : ''}`}
                  title="Instagram Accounts"
                >
                  <Instagram size={18} />
                </button>

                {/* Dropdown Menu */}
                {showInstaMenu && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 bg-slate-950 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-slate-800">
                      Follow Us On Instagram
                    </div>
                    <div className="py-1">
                      <a 
                        href="https://www.instagram.com/_deejay_618_offical/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-amber-400 hover:text-black transition-colors group"
                      >
                        <div className="bg-slate-800 p-1 rounded-full group-hover:bg-black/20">
                           <Instagram size={14} />
                        </div>
                        <span>@_deejay_618_offical</span>
                      </a>
                      <div className="h-px bg-slate-800 mx-4" />
                      <a 
                        href="https://www.instagram.com/m.hybert/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-amber-400 hover:text-black transition-colors group"
                      >
                        <div className="bg-slate-800 p-1 rounded-full group-hover:bg-black/20">
                            <Instagram size={14} />
                        </div>
                        <span>@m.hybert</span>
                      </a>
                    </div>
                    {/* Tiny arrow pointing down */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                  </div>
                )}
              </div>

              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors"><Youtube size={18} /></a>
            </div>
            <p className="text-xs text-gray-500">Subscribe to our newsletter for updates.</p>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 THREEFILMS. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-2 md:mt-0 font-medium">Designed by <span className="text-amber-400">Aime Prince & M.Hybert</span></p>
        </div>
      </div>
    </footer>
  );
};