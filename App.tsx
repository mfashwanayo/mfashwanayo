
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Section } from './components/Section';
import { Footer } from './components/Footer';
import { Fab } from './components/Fab';
import { AuthModal } from './components/AuthModal';
import { UploadModal } from './components/UploadModal';
import { VideoPlayer } from './components/VideoPlayer';
import { SongPlayer } from './components/SongPlayer';
import { Movie, User } from './types';
import { Music, Lock, Gem, KeyRound, Upload, ArrowRight } from 'lucide-react';
import { Button } from './components/Button';

// Mock Data Generators with Timestamps
const generateMovies = (count: number, startId: number, categoryOverride?: string): Movie[] => {
  return Array.from({ length: count }).map((_, index) => {
    const id = startId + index;
    const image = `https://picsum.photos/seed/${id * 123}/300/450`;
    
    const titles = [
      "Kill Ratio", "Those Who Wish Me Dead", "Baywatch", "Our Last Men", 
      "Beauty in Black", "Fatal Seduction", "Nobody", "Thugs of Hindostan", 
      "Beast", "Bharat", "Sagatwa"
    ];

    const title = titles[index % titles.length];
    
    // Simulate timestamps: some hours ago, some days ago
    const timeAgo = (index + 1) * 3600000; // 1 hour * index
    
    const categoryList = ["Action", "Romance", "Animation", "18+ Movies", "TV Series"];
    const category = categoryOverride || categoryList[index % categoryList.length];

    // Ensure all movies have a video URL for download testing
    const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

    return {
      id,
      title: title,
      image,
      category: category,
      tag: categoryOverride === "TV Series" ? "S02E04" : "Full Movie",
      timestamp: Date.now() - timeAgo,
      description: "An adrenaline-pumping thrill ride that explores the depths of human courage against insurmountable odds. Featuring spectacular visuals and a gripping storyline.",
      videoUrl: videoUrl 
    };
  });
};

const initialNewMovies: Movie[] = generateMovies(8, 100);
const initialTrendingMovies: Movie[] = generateMovies(8, 200, "Action");
const initialSeries: Movie[] = generateMovies(8, 300, "TV Series");
const initialSongs: Movie[] = generateMovies(8, 400, "Music").map(m => ({
  ...m,
  title: `Track ${m.id % 20}: ${m.title}`,
  tag: "Premium Audio",
  description: "High fidelity bonus track available for premium subscribers. Experience the sound of THREEFILMS in lossless quality."
}));

const App: React.FC = () => {
  // App View State: 'home', 'player', 'series', 'romance', 'search', 'songs', 'song-player', etc.
  const [currentView, setCurrentView] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Songs Gate State
  const [isSongAccessGranted, setIsSongAccessGranted] = useState(false);
  const [songGateCode, setSongGateCode] = useState('');
  const [songGateError, setSongGateError] = useState('');

  // Movie Data State
  const [allMovies, setAllMovies] = useState<Movie[]>([
    ...initialNewMovies,
    ...initialTrendingMovies,
    ...initialSeries,
    ...initialSongs
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpload = (movieData: Partial<Movie>) => {
    const newMovie: Movie = {
      id: Date.now(),
      title: movieData.title || "Untitled",
      image: movieData.image || "",
      category: movieData.category,
      tag: "New",
      timestamp: Date.now(),
      description: movieData.description,
      videoUrl: movieData.videoUrl || ""
    };

    setAllMovies([newMovie, ...allMovies]);
  };

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setSearchQuery(''); // Clear search on navigation
    setSelectedMovie(null);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('search');
    } else {
      setCurrentView('home');
    }
    window.scrollTo(0, 0);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    if (movie.category === 'Music') {
        setCurrentView('song-player');
    } else {
        setCurrentView('player');
    }
  };

  const handleSongGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (songGateCode === '1234') {
      setIsSongAccessGranted(true);
      setSongGateError('');
    } else {
      setSongGateError('Incorrect password. Access denied.');
    }
  };

  const handleDownload = (movie: Movie) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!movie.videoUrl) {
      alert("No video source available for download.");
      return;
    }

    const link = document.createElement('a');
    link.href = movie.videoUrl;
    link.download = movie.title.replace(/\s+/g, '_');
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Content Filtering Logic
  const renderContent = () => {
    // Search View
    if (currentView === 'search' || searchQuery) {
      const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return (
        <div className="py-8 min-h-[50vh] animate-in fade-in duration-500">
          <Section 
            title={`Search Results: "${searchQuery}"`} 
            movies={filtered} 
            onMovieClick={handleMovieClick}
            onDownload={handleDownload}
          />
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-20">
              <p>No movies found matching your search.</p>
            </div>
          )}
        </div>
      );
    }

    if (currentView === 'home') {
      return (
        <div className="space-y-4 animate-in fade-in duration-500">
           <Section title="New Films (Filime nshya)" movies={allMovies.slice(0, 4)} onMovieClick={handleMovieClick} onDownload={handleDownload} />
           <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full" />
           <Section title="Trending (Izigezweho)" movies={initialTrendingMovies} onMovieClick={handleMovieClick} onDownload={handleDownload} />
           <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full" />
           <Section title="TV Series" movies={initialSeries} onMovieClick={handleMovieClick} onDownload={handleDownload} />
        </div>
      );
    }
    
    if (currentView === 'categories') {
       return (
        <div className="space-y-4 animate-in fade-in duration-500">
           <Section title="All Categories" movies={allMovies} onMovieClick={handleMovieClick} onDownload={handleDownload} />
        </div>
       );
    }

    // BONUS SONGS PAGE
    if (currentView === 'songs') {
       if (!isSongAccessGranted) {
         return (
           <div className="min-h-[60vh] flex items-center justify-center px-4">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-amber-400 w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                 <p className="text-gray-400 mb-6">To access the Premium Songs collection, please enter the access code.</p>
                 
                 <form onSubmit={handleSongGateSubmit} className="space-y-4">
                    <div className="relative">
                       <KeyRound className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                       <input 
                          type="password" 
                          placeholder="Enter Access Code"
                          value={songGateCode}
                          onChange={(e) => setSongGateCode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors text-center tracking-widest"
                       />
                    </div>
                    {songGateError && (
                      <p className="text-red-500 text-sm font-medium animate-pulse">{songGateError}</p>
                    )}
                    <Button type="submit" className="w-full py-3">Unlock Collection</Button>
                 </form>
              </div>
           </div>
         );
       }

       return (
        <div className="py-8 min-h-[50vh] animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="bg-gradient-to-br from-slate-900 via-[#0a0f1e] to-amber-900/20 border border-amber-500/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl group">
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-slate-950/80 p-4 rounded-full mb-6 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                            <Music size={40} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center gap-3">
                            PREMIUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">SOUNDTRACKS</span>
                        </h1>
                        <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg font-light leading-relaxed">
                            Welcome to the exclusive collection. Stream high-fidelity tracks or upload your own music to the community.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                           <Button 
                              onClick={() => setIsUploadModalOpen(true)}
                              className="px-8 py-3 text-base flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-amber-500 to-amber-400 border-none text-black font-bold"
                           >
                             <Upload size={18} /> Post Your Song
                           </Button>
                           <Button 
                              variant="secondary"
                              className="px-8 py-3 text-base flex items-center gap-2"
                           >
                             Browse Library <ArrowRight size={18} />
                           </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Section title="Featured Soundtracks" movies={initialSongs} onMovieClick={handleMovieClick} onDownload={handleDownload} />
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full" />
            <Section title="Artist Collections" movies={initialSongs.slice(0, 4)} onMovieClick={handleMovieClick} onDownload={handleDownload} />
        </div>
       );
    }

    // Song Player View (YouTube Style)
    if (currentView === 'song-player' && selectedMovie) {
        return (
            <div className="animate-in fade-in duration-300">
                <SongPlayer 
                    movie={selectedMovie} 
                    allMovies={allMovies} 
                    onNavigate={handleNavigate}
                    onVideoClick={handleMovieClick}
                    onUploadClick={() => setIsUploadModalOpen(true)}
                    user={user}
                    onLoginRequest={() => setIsAuthModalOpen(true)}
                />
            </div>
        );
    }

    // Filter by category (case insensitive partial match)
    const filteredMovies = allMovies.filter(m => 
      m.category?.toLowerCase().includes(currentView.replace('18+', '18').toLowerCase()) || 
      (currentView === 'series' && m.category === 'TV Series')
    );

    const titleMap: Record<string, string> = {
      'series': 'TV Series',
      'animation': 'Animation Movies',
      'romance': 'Romantic Movies',
      '18+': '18+ Movies'
    };

    return (
      <div className="py-8 min-h-[50vh] animate-in fade-in duration-500">
        <Section 
          title={titleMap[currentView] || currentView} 
          movies={filteredMovies.length > 0 ? filteredMovies : []} 
          onMovieClick={handleMovieClick}
          onDownload={handleDownload}
        />
        {filteredMovies.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p>No movies found in this category.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 flex flex-col font-sans">
      
      {/* Video Player Overlay - Standard Movies */}
      {currentView === 'player' && selectedMovie ? (
        <VideoPlayer 
          movie={selectedMovie} 
          onClose={() => setCurrentView('home')} 
          onDownload={() => handleDownload(selectedMovie)}
        />
      ) : (
        <>
          {/* Hide Navbar only for song-player as it has its own */}
          {currentView !== 'song-player' && (
             <Navbar 
                user={user} 
                currentView={currentView}
                onLoginClick={() => setIsAuthModalOpen(true)} 
                onLogout={handleLogout}
                onUploadClick={() => setIsUploadModalOpen(true)}
                onNavigate={handleNavigate}
                onSearch={handleSearch}
              />
          )}
          
          <main className="flex-grow">
            {/* Background gradient effect for depth, hide in song player */}
            {currentView !== 'song-player' && (
                <div className="fixed inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0" />
            )}
            
            <div className={`relative z-10 ${currentView !== 'song-player' ? 'pt-6' : ''}`}>
              {renderContent()}
            </div>
          </main>

          {currentView !== 'song-player' && <Footer onNavigate={handleNavigate} />}
          {currentView !== 'song-player' && <Fab />}

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
          />

          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleUpload}
          />
        </>
      )}
    </div>
  );
};

export default App;
