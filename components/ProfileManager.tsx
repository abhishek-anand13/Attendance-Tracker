import React, { useState } from 'react';
import { WorkerProfile, ColorTheme } from '../types';
import { UserPlus, User, Check, Plus, ChevronRight } from 'lucide-react';

interface ProfileManagerProps {
  profiles: WorkerProfile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, rate: number) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
}) => {
  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreateProfile(newName, newRate);
      setNewName('');
      setNewRate(500);
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-[2rem] shadow-2xl shadow-purple-900/20 p-8 max-w-md mx-auto mt-6 border border-white/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-4 bg-fuchsia-100 text-fuchsia-600 rounded-2xl">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Add New Worker</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
            <input 
              autoFocus
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="w-full px-5 py-4 bg-fuchsia-50 border-2 border-fuchsia-100 rounded-2xl font-bold text-slate-800 focus:border-fuchsia-400 focus:bg-white focus:outline-none transition-all"
              placeholder="e.g. Helper Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Wage (₹)</label>
            <input 
              type="number" 
              value={newRate} 
              onChange={e => setNewRate(parseFloat(e.target.value))}
              className="w-full px-5 py-4 bg-fuchsia-50 border-2 border-fuchsia-100 rounded-2xl font-bold text-slate-800 focus:border-fuchsia-400 focus:bg-white focus:outline-none transition-all"
              placeholder="500"
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
             {profiles.length > 0 && (
               <button 
                 type="button" 
                 onClick={() => setIsCreating(false)}
                 className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
               >
                 Cancel
               </button>
             )}
             <button 
               type="submit"
               className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-colors shadow-lg shadow-slate-300"
             >
               Save Worker
             </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {profiles.map(profile => (
        <button
          key={profile.id}
          onClick={() => onSelectProfile(profile.id)}
          className={`
            relative p-5 rounded-[1.5rem] transition-all duration-200 text-left group border-2
            ${activeProfileId === profile.id 
              ? 'bg-white border-white shadow-xl shadow-purple-900/20 scale-105 z-10' 
              : 'bg-white/40 border-white/20 hover:bg-white/60 hover:border-white/40 text-white'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner
              ${activeProfileId === profile.id ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={`font-bold text-lg ${activeProfileId === profile.id ? 'text-slate-800' : 'text-white'}`}>
                {profile.name}
              </div>
              <div className={`text-xs font-bold ${activeProfileId === profile.id ? 'text-slate-400' : 'text-white/70'}`}>
                Daily: ₹{profile.dailyRate}
              </div>
            </div>
          </div>
          {activeProfileId === profile.id && (
            <div className="absolute top-5 right-5 text-emerald-500 bg-emerald-50 rounded-full p-1">
              <Check size={18} strokeWidth={3} />
            </div>
          )}
        </button>
      ))}
      
      <button
        onClick={() => setIsCreating(true)}
        className="p-4 rounded-[1.5rem] border-2 border-dashed border-white/30 hover:border-white/60 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-3 text-white/60 hover:text-white min-h-[96px]"
      >
        <div className="p-3 bg-white/10 rounded-full">
           <Plus size={24} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Add Worker</span>
      </button>
    </div>
  );
};