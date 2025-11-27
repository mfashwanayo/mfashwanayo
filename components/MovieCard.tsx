import React from 'react';
import { Movie } from '../types';
import { Clock, PlayCircle, Download } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onDownload: (movie: Movie) => void;
}

const getTimeAgo = (timestamp?: number) => {
  if (!timestamp) return null;
  
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  
  return "Just now";
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onDownload }) => {
  const timeAgo = getTimeAgo(movie.timestamp);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(movie);
  };

  return (
    <div 
      className="flex flex-col group cursor-pointer relative overflow-hidden"
      onClick={() => onClick(movie)}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden w-full bg-slate-800">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Download Button (Top Left) */}
        <button 
          onClick={handleDownloadClick}
          className="absolute top-2 left-2 z-20 bg-black/60 hover:bg-amber-400 hover:text-black text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
          title="Download"
        >
          <Download size={16} />
        </button>
        
        {/* Hover Watch Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
          <PlayCircle className="w-16 h-16 text-amber-400 drop-shadow-lg mb-2" fill="rgba(0,0,0,0.5)" />
          <span className="text-white font-bold uppercase tracking-widest text-sm bg-black/60 px-4 py-1 rounded backdrop-blur-sm border border-amber-400/50">
            Watch Now
          </span>
        </div>

        {/* Category Badge */}
        {movie.category && (
          <span className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide backdrop-blur-sm shadow-sm z-10">
            {movie.category}
          </span>
        )}

        {/* Time Ago Indicator */}
        {timeAgo && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-gray-300 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-md z-10">
            <Clock size={10} className="text-amber-400" />
            <span>{timeAgo}</span>
          </div>
        )}
      </div>

      {/* Yellow Footer Bar */}
      <div className="bg-amber-400 p-3 text-center min-h-[48px] flex items-center justify-center relative z-20">
        <h3 className="text-black text-xs sm:text-sm font-bold uppercase tracking-tight line-clamp-1">
          {movie.title} {movie.tag ? `- ${movie.tag}` : ''}
        </h3>
      </div>
    </div>
  );
};
