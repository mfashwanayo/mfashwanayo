
import React, { useState, useRef } from 'react';
import { X, Upload, Film, Tag, Image as ImageIcon, Loader2, FileVideo, AlertCircle, AlignLeft, Lock, CreditCard, KeyRound } from 'lucide-react';
import { Button } from './Button';
import { Movie } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (movieData: Partial<Movie>) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = [
    "Action",
    "Animation",
    "Romance",
    "Comedy",
    "Horror",
    "TV Series",
    "18+ Movies",
    "Documentary"
  ];

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated password as per request
    if (accessCode === '1234') {
        setIsLoading(true);
        // Simulate checking code
        setTimeout(() => {
            setHasAccess(true);
            setIsLoading(false);
            setAccessError('');
        }, 800);
    } else {
        setAccessError('Invalid access code. Please verify payment.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would check file.size here. 
      // 2GB = 2 * 1024 * 1024 * 1024 bytes.
      // For this demo, we accept the file but show the requirement text.
      setVideoFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !previewUrl || !videoFile) return;

    setIsLoading(true);

    // Create a local URL for the video file so it can be played immediately
    const videoUrl = URL.createObjectURL(videoFile);

    // Simulate upload delay
    setTimeout(() => {
      onUpload({
        title,
        category,
        description,
        image: previewUrl,
        timestamp: Date.now(),
        videoUrl: videoUrl // Pass the playable URL
      });
      
      // Reset form
      setTitle('');
      setCategory('');
      setDescription('');
      setImageFile(null);
      setVideoFile(null);
      setPreviewUrl(null);
      setHasAccess(false); // Reset access for security
      setAccessCode('');
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-slate-900 border border-slate-700 w-full ${hasAccess ? 'max-w-2xl' : 'max-w-md'} rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col transition-all`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {hasAccess ? (
                <>
                    <Upload className="text-amber-400" /> Upload New Film
                </>
            ) : (
                <>
                    <Lock className="text-red-500" /> Creator Access
                </>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {!hasAccess ? (
            /* Gatekeeper View */
            <div className="space-y-6 text-center">
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-inner">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                        <CreditCard className="text-amber-400 w-8 h-8" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Upload Fee Required</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        To maintain high-quality content on THREEFILMS, all creators must pay a one-time verification fee of <span className="text-amber-400 font-bold">200 FRW</span> to enable upload capabilities.
                    </p>
                    <div className="flex flex-col gap-3">
                       <form onSubmit={handleAccessSubmit} className="space-y-3">
                           <div className="relative">
                               <KeyRound className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                               <input 
                                    type="password" 
                                    placeholder="Enter Access Password"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors text-center font-mono tracking-widest"
                                    required
                               />
                           </div>
                           {accessError && <p className="text-red-500 text-xs font-bold animate-pulse">{accessError}</p>}
                           <Button type="submit" className="w-full" disabled={isLoading}>
                               {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Unlock Uploads"}
                           </Button>
                       </form>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500">
                    By entering the code, you agree to our Content Policy.
                </p>
            </div>
          ) : (
            /* Upload Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Details */}
                <div className="space-y-4">
                    {/* Title Input */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Film Title</label>
                    <div className="relative">
                        <Film className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                        <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter movie name..."
                        className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                    </div>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                        <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors appearance-none"
                        >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        </select>
                    </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <div className="relative">
                        <AlignLeft className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                        <textarea 
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter film synopsis..."
                        className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
                        />
                    </div>
                    </div>
                </div>

                {/* Right Column: Files */}
                <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Cover Image</label>
                    <div 
                        className="border-2 border-dashed border-slate-700 rounded-lg h-32 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 hover:border-amber-400 transition-colors cursor-pointer relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                        />
                        
                        {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        ) : (
                        <div className="flex flex-col items-center p-2 text-center">
                            <ImageIcon className="text-gray-500 w-8 h-8 mb-1" />
                            <span className="text-xs text-gray-400">Upload Poster</span>
                        </div>
                        )}
                    </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex justify-between">
                        <span>Video File</span>
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle size={10} /> MIN 2GB
                        </span>
                    </label>
                    <div 
                        className="border-2 border-dashed border-slate-700 rounded-lg h-32 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 hover:border-amber-400 transition-colors cursor-pointer"
                        onClick={() => videoInputRef.current?.click()}
                    >
                        <input 
                        type="file" 
                        ref={videoInputRef} 
                        className="hidden" 
                        accept="video/*"
                        onChange={handleVideoChange}
                        />
                        
                        <FileVideo className={`w-8 h-8 mb-2 ${videoFile ? 'text-green-500' : 'text-gray-500'}`} />
                        <p className="text-xs text-gray-400 text-center px-4">
                        {videoFile ? videoFile.name : "Click to select video file"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Supports MP4, MKV (Min 2GB)</p>
                    </div>
                    </div>
                </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading || !previewUrl || !videoFile}>
                {isLoading ? (
                    <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Uploading...
                    </span>
                ) : (
                    'Upload Movie'
                )}
                </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
