
import React, { useEffect, useState, useRef } from 'react';
import { Movie, User } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Menu, Search, Disc, Radio, List, Download, Film } from 'lucide-react';

interface SongPlayerProps {
  movie: Movie;
  allMovies: Movie[];
  onNavigate: (view: string) => void;
  onVideoClick: (movie: Movie) => void;
  onUploadClick: () => void;
  user: User | null;
  onLoginRequest: () => void;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({ movie, allMovies, onNavigate, onVideoClick, onUploadClick, user, onLoginRequest }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const songs = allMovies.filter(m => m.category === 'Music' || m.tag === 'Premium Audio').slice(0, 6);

  // Auto-play simulation if no video
  useEffect(() => {
    if (!showVideo) {
      const timer = setTimeout(() => setIsPlaying(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [showVideo]);

  // Video Element Control
  useEffect(() => {
    if (showVideo && videoRef.current) {
        if (isPlaying) {
            videoRef.current.play().catch(e => console.log("Play interrupted", e));
        } else {
            videoRef.current.pause();
        }
    }
  }, [isPlaying, showVideo]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
    }
  };

  const handleDownloadCheck = (e: React.MouseEvent, movieToDownload: Movie) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
        onLoginRequest();
        return;
    }

    // Logic to download
    const link = document.createElement('a');
    link.href = movieToDownload.videoUrl || '';
    link.download = movieToDownload.title.replace(/\s+/g, '_');
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-hidden relative selection:bg-cyan-500 selection:text-black">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#050816] to-[#000000] z-0" />
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
      }}></div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <h1 className="text-3xl md:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            GAZA MUSIC
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-gray-400">
          <button className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all border-b-2 border-cyan-400 text-cyan-400 pb-1">HOME</button>
          <button className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">EXPLORE</button>
          <button 
            onClick={onUploadClick}
            className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all flex items-center gap-2"
          >
            <Download size={16} /> UPLOAD
          </button>
          <button className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">ARTISTS</button>
        </div>

        <div className="md:hidden text-cyan-400">
           <Menu />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] w-full perspective-1000">
        
        {/* Retro Player Interface */}
        <div className="mb-12 md:mb-20 transform hover:scale-105 transition-transform duration-500 z-30">
           <div className="w-[300px] md:w-[600px] h-[120px] md:h-[180px] bg-gradient-to-b from-slate-700 to-slate-900 rounded-3xl p-2 shadow-[0_0_50px_rgba(34,211,238,0.15)] border-t border-slate-600 border-b-4 border-slate-950 relative flex items-center justify-center gap-4">
              
              {/* Metallic Texture overlay */}
              <div className="absolute inset-0 rounded-[20px] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

              {/* Left Knob */}
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-slate-800 to-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_8px_black] border border-slate-700 flex items-center justify-center relative">
                 <div className="w-1 h-6 bg-cyan-500/50 absolute top-2 rounded-full transform -rotate-45"></div>
                 <div className="text-[8px] md:text-[10px] text-gray-500 absolute bottom-4 font-mono">VOLUME</div>
                 {/* Tick marks */}
                 <div className="absolute inset-0 rounded-full border border-dashed border-gray-700 opacity-50 w-full h-full scale-125"></div>
              </div>

              {/* Center Console */}
              <div className="flex-1 h-full py-4 flex flex-col justify-between">
                 {/* Screen */}
                 <div className="bg-black/90 h-[60%] rounded border border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center px-4">
                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 background-size-[100%_2px,3px_100%] pointer-events-none"></div>
                    
                    {/* Display Info */}
                    <div className="w-full flex items-center justify-between text-cyan-400 font-mono text-xs md:text-sm z-20">
                       <div className="flex flex-col">
                          <span className="text-[10px] text-cyan-700">TRACK</span>
                          <span>04</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <span className="text-[10px] text-cyan-700 animate-pulse">{isPlaying ? 'NOW PLAYING' : 'PAUSED'}</span>
                          <span className="tracking-widest truncate max-w-[120px] md:max-w-[200px]">{movie.title}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] text-cyan-700">TIME</span>
                          <span>{showVideo ? formatTime(currentTime) : "3:45"}</span>
                       </div>
                    </div>

                    {/* Visualizer bars */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 flex items-end justify-center gap-0.5 opacity-50">
                       {[...Array(20)].map((_, i) => (
                          <div key={i} className={`w-1 bg-cyan-500 ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ height: isPlaying ? `${Math.random() * 100}%` : '2px', animationDelay: `${i * 0.05}s` }}></div>
                       ))}
                    </div>
                 </div>

                 {/* Controls */}
                 <div className="flex items-center justify-center gap-4 md:gap-8 mt-2">
                    <button className="text-gray-400 hover:text-cyan-400 transition-colors"><SkipBack size={20} /></button>
                    
                    <button 
                       onClick={togglePlay}
                       className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:scale-110 transition-transform"
                    >
                       {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                    </button>
                    
                    <button className="text-gray-400 hover:text-cyan-400 transition-colors"><SkipForward size={20} /></button>
                 </div>
              </div>

              {/* Right Knob */}
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-slate-800 to-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_8px_black] border border-slate-700 flex items-center justify-center relative">
                 <div className="w-1 h-6 bg-cyan-500/50 absolute top-2 rounded-full transform rotate-45"></div>
                 <div className="text-[8px] md:text-[10px] text-gray-500 absolute bottom-4 font-mono">BASS</div>
              </div>

           </div>
        </div>

        {/* Video / Cube Display Area */}
        <div className="relative w-full max-w-2xl aspect-video md:aspect-[21/9] mb-8 flex items-center justify-center">
            
            {showVideo ? (
                /* Video Player Mode */
                <div className="w-full h-full relative rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-black animate-in fade-in zoom-in duration-500">
                    <video 
                        ref={videoRef}
                        src={movie.videoUrl || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                    />
                    <div className="absolute top-2 right-2 z-10">
                        <button 
                            onClick={() => { setShowVideo(false); setIsPlaying(false); }}
                            className="bg-black/70 text-cyan-400 p-2 rounded-full hover:bg-cyan-400 hover:text-black transition-colors"
                        >
                            <MinimizeIcon size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                /* 3D Cube Mode */
                <div className="relative w-64 h-64 md:w-80 md:h-80 perspective-[1000px] group cursor-pointer" onClick={() => { setShowVideo(true); setIsPlaying(true); }}>
                    {/* The Cube */}
                    <div className={`w-full h-full relative preserve-3d group-hover:animation-play-state-paused transform-style-3d ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
                        <style>{`
                            .preserve-3d { transform-style: preserve-3d; }
                            .transform-style-3d { transform-style: preserve-3d; }
                            
                            @keyframes spin {
                            from { transform: rotateX(-20deg) rotateY(0deg); }
                            to { transform: rotateX(-20deg) rotateY(360deg); }
                            }
                            
                            /* Cube Faces */
                            .cube-face {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            border: 2px solid rgba(6, 182, 212, 0.5);
                            background: rgba(5, 8, 22, 0.8);
                            box-shadow: 0 0 20px rgba(6, 182, 212, 0.2) inset;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            backface-visibility: visible;
                            }

                            .front  { transform: rotateY(0deg) translateZ(160px); }
                            .back   { transform: rotateY(180deg) translateZ(160px); }
                            .right  { transform: rotateY(90deg) translateZ(160px); }
                            .left   { transform: rotateY(-90deg) translateZ(160px); }
                            .top    { transform: rotateX(90deg) translateZ(160px); }
                            .bottom { transform: rotateX(-90deg) translateZ(160px); }
                            
                            @media (max-width: 768px) {
                                .front  { transform: rotateY(0deg) translateZ(128px); }
                                .back   { transform: rotateY(180deg) translateZ(128px); }
                                .right  { transform: rotateY(90deg) translateZ(128px); }
                                .left   { transform: rotateY(-90deg) translateZ(128px); }
                                .top    { transform: rotateX(90deg) translateZ(128px); }
                                .bottom { transform: rotateX(-90deg) translateZ(128px); }
                            }
                        `}</style>

                        {/* Faces */}
                        <div className="cube-face front p-2"><img src={allMovies[0]?.image} alt="Art" className="w-full h-full object-cover opacity-80" /></div>
                        <div className="cube-face back p-2"><img src={allMovies[1]?.image} alt="Art" className="w-full h-full object-cover opacity-80" /></div>
                        <div className="cube-face right p-2"><img src={allMovies[2]?.image} alt="Art" className="w-full h-full object-cover opacity-80" /></div>
                        <div className="cube-face left p-2"><img src={allMovies[3]?.image} alt="Art" className="w-full h-full object-cover opacity-80" /></div>
                        <div className="cube-face top p-2"><div className="w-full h-full border-4 border-cyan-500/20 grid grid-cols-3 gap-1">{[...Array(9)].map((_,i)=><div key={i} className="bg-cyan-500/20"></div>)}</div></div>
                        <div className="cube-face bottom p-2"><div className="w-full h-full border-4 border-cyan-500/20 flex items-center justify-center text-cyan-500 font-mono">GAZA MUSIC</div></div>
                    </div>

                    {/* Glowing Core Effect */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    {/* Play Overlay Hint */}
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                         <div className="bg-black/50 p-4 rounded-full border border-cyan-400 backdrop-blur-sm group-hover:scale-110 transition-transform">
                             <Film className="text-cyan-400 w-8 h-8 animate-pulse" />
                         </div>
                    </div>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-20 z-20">
             <button 
                onClick={() => { setShowVideo(true); setIsPlaying(true); }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2 transition-all hover:scale-105"
             >
                <Film size={20} /> WATCH VIDEO
             </button>
             <button 
                onClick={(e) => handleDownloadCheck(e, movie)}
                className="bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all hover:scale-105"
             >
                <Download size={20} /> DOWNLOAD VIDEO
             </button>
        </div>

        {/* Audio Wave Visualization (Bottom) */}
        <div className="absolute top-1/2 w-full flex items-center justify-between px-4 opacity-10 pointer-events-none">
           <div className="w-full h-32 flex items-center justify-center gap-1">
             {[...Array(60)].map((_, i) => (
                <div key={i} className="w-1 bg-cyan-400 rounded-full animate-[pulse_1s_infinite]" style={{ height: `${Math.random() * 100}px`, animationDelay: `${i * 0.02}s` }}></div>
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Section: Playlist */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md border-t border-cyan-900/30 w-full py-8">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-1 h-6 bg-cyan-400"></div>
               <h2 className="text-xl font-bold tracking-widest text-white uppercase">L. WANORIS</h2>
               <div className="ml-auto flex gap-2">
                 <button className="p-1 hover:bg-white/10 rounded"><Disc size={16} className="text-gray-400" /></button>
                 <button className="p-1 hover:bg-white/10 rounded"><List size={16} className="text-gray-400" /></button>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {songs.map((song) => (
                  <div key={song.id} className="group relative flex flex-col">
                     <div className="cursor-pointer relative aspect-square overflow-hidden rounded-md border border-gray-800 group-hover:border-cyan-400 transition-colors mb-2" onClick={() => onVideoClick(song)}>
                        <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Play className="text-cyan-400 fill-cyan-400" size={32} />
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-start mt-1 gap-2">
                         <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onVideoClick(song)}>
                             <h3 className="text-sm font-bold truncate text-gray-200 group-hover:text-cyan-400">{song.title.split(':')[0]}</h3>
                             <p className="text-[10px] text-gray-500 uppercase tracking-wider">{song.tag || 'Single'}</p>
                         </div>
                         <button 
                            onClick={(e) => handleDownloadCheck(e, song)}
                            className="text-gray-400 hover:text-cyan-400 transition-colors p-1 hover:bg-white/10 rounded"
                            title="Download"
                         >
                            <Download size={16} />
                         </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};

// Helper component for minimize icon
const MinimizeIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);
