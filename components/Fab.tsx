import React from 'react';
import { MessageCircle } from 'lucide-react';

export const Fab: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center w-14 h-14">
        <MessageCircle size={32} fill="white" className="text-white" />
      </button>
    </div>
  );
};