import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ArrowLeft, Loader2, Download } from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  onDownload: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose, onDownload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [isBuffering, setIsBuffering] = useState(false);

  const hasRealVideo = movie.videoUrl && movie.videoUrl !== '#' && movie.videoUrl !== '';

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Video Event Handlers
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Mock progress if no real video, else attach events
  useEffect(() => {
    if (!hasRealVideo) {
      let interval: ReturnType<typeof setInterval>;
      if (isPlaying && !isBuffering) {
        interval = setInterval(() => {
          setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
        }, 100);
      }
      return () => clearInterval(interval);
    }
  }, [isPlaying, isBuffering, hasRealVideo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleQualityChange = (q: string) => {
    setQuality(q);
    setShowQualityMenu(false);
    setIsBuffering(true);
    // Simulate buffering delay for quality switch
    setTimeout(() => setIsBuffering(false), 1500);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (percentageOrSeconds: number, isSeconds = false) => {
    let totalSeconds = 0;
    if (isSeconds) {
      totalSeconds = percentageOrSeconds;
    } else {
      // Fallback for mock duration (2 hours)
      const mockTotal = 7200; 
      totalSeconds = (percentageOrSeconds / 100) * mockTotal;
    }

    if (isNaN(totalSeconds)) return "0:00";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayCurrentTime = hasRealVideo && videoRef.current 
    ? formatTime(videoRef.current.currentTime, true) 
    : formatTime(progress);
    
  const displayTotalTime = hasRealVideo && duration
    ? formatTime(duration, true)
    : "2:00:00";

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-sans">
      {/* Video Container */}
      <div className="relative w-full h-full bg-slate-900 overflow-hidden group">
        
        {/* Real Video Element */}
        {hasRealVideo && (
          <video
            ref={videoRef}
            src={movie.videoUrl}
            className="absolute inset-0 w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
        )}

        {/* Mock Background for demos without real video */}
        {!hasRealVideo && (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{ backgroundImage: `url(${movie.image})`, opacity: isBuffering ? 0.3 : 0.6 }}
          />
        )}
        
        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
            <span className="sr-only">Buffering...</span>
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 left-6 z-40 bg-black/50 p-2 rounded-full text-white hover:bg-amber-400 hover:text-black transition-all ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowLeft size={24} />
        </button>

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-8 pb-12 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 cursor-none'
          }`}
        >
          {/* Progress Bar */}
          <div className="w-full mb-6 relative group/progress">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer z-20"
            />
            <div className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer relative overflow-hidden">
               <div 
                className="h-full bg-amber-400 rounded-full relative transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors">
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              
              <div className="flex items-center gap-2 group/volume">
                <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-white hover:text-amber-400">
                   {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>

              <div className="text-sm font-medium text-gray-200">
                {displayCurrentTime} / {displayTotalTime}
              </div>
              
              <div className="flex flex-col ml-4">
                 <h2 className="text-white font-bold text-lg">{movie.title}</h2>
                 <p className="text-gray-400 text-xs truncate max-w-md hidden sm:block">{movie.description || 'No description available.'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Quality Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="flex items-center gap-1 text-white hover:text-amber-400 font-bold text-sm bg-black/40 px-3 py-1 rounded border border-gray-600"
                >
                  <Settings size={16} />
                  {quality}
                </button>
                
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 border border-slate-700 rounded shadow-xl overflow-hidden">
                    {['Auto', '1080p', '720p', '480p'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 ${quality === q ? 'text-amber-400 font-bold' : 'text-gray-300'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={onDownload}
                className="text-white hover:text-amber-400 transition-colors"
                title="Download Video"
              >
                <Download size={24} />
              </button>

              <button className="text-white hover:text-amber-400">
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
