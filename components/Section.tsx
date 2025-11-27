import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface SectionProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDownload: (movie: Movie) => void;
}

export const Section: React.FC<SectionProps> = ({ title, movies, onMovieClick, onDownload }) => {
  return (
    <div className="py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white relative pl-4">
          {/* Decorative left border akin to some streaming sites */}
          <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-400 rounded-full"></span>
          {title}
        </h2>
        
        <div className="flex space-x-2">
          <button className="p-2 border border-slate-600 text-slate-300 hover:text-amber-400 hover:border-amber-400 rounded bg-slate-900 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 border border-slate-600 text-slate-300 hover:text-amber-400 hover:border-amber-400 rounded bg-slate-900 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} onDownload={onDownload} />
        ))}
      </div>
    </div>
  );
};
