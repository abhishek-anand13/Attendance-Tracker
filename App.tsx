import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar } from './components/Calendar';
import { StatsPanel } from './components/StatsPanel';
import { ProfileManager } from './components/ProfileManager';
import { AttendanceStatus, WorkerProfile, ColorTheme } from './types';
import { getProfiles, saveProfiles, saveActiveProfileId, getActiveProfileId } from './services/storage';
import { CalendarCheck, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showProfileManager, setShowProfileManager] = useState(false);

  // Load profiles on mount
  useEffect(() => {
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
    
    const lastActive = getActiveProfileId();
    if (lastActive && loadedProfiles.find(p => p.id === lastActive)) {
      setActiveProfileId(lastActive);
    } else if (loadedProfiles.length > 0) {
      setActiveProfileId(loadedProfiles[0].id);
    } else {
      setShowProfileManager(true); // Force create if no profiles
    }
  }, []);

  // Save profiles whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      saveProfiles(profiles);
    }
  }, [profiles]);

  // Persist active profile selection
  useEffect(() => {
    if (activeProfileId) {
      saveActiveProfileId(activeProfileId);
    }
  }, [activeProfileId]);

  const activeProfile = useMemo(() => 
    profiles.find(p => p.id === activeProfileId), 
    [profiles, activeProfileId]
  );

  const handleCreateProfile = (name: string, dailyRate: number) => {
    const newProfile: WorkerProfile = {
      id: crypto.randomUUID(),
      name,
      dailyRate,
      theme: 'indigo', // Default value, ignored in UI now
      attendance: {}
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfileId(newProfile.id);
    setShowProfileManager(false);
  };

  const handleToggleAttendance = (dateStr: string) => {
    if (!activeProfile) return;

    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfile.id) {
        const currentStatus = p.attendance[dateStr] || AttendanceStatus.UNMARKED;
        let nextStatus: AttendanceStatus;

        if (currentStatus === AttendanceStatus.UNMARKED) {
          nextStatus = AttendanceStatus.PRESENT;
        } else if (currentStatus === AttendanceStatus.PRESENT) {
          nextStatus = AttendanceStatus.ABSENT;
        } else {
          nextStatus = AttendanceStatus.UNMARKED;
        }

        const newAttendance = { ...p.attendance, [dateStr]: nextStatus };
        if (nextStatus === AttendanceStatus.UNMARKED) {
          delete newAttendance[dateStr];
        }
        return { ...p, attendance: newAttendance };
      }
      return p;
    }));
  };

  const handleRateChange = (rate: number) => {
    if (!activeProfile) return;
    setProfiles(prev => prev.map(p => 
      p.id === activeProfile.id ? { ...p, dailyRate: rate } : p
    ));
  };

  // Stats calculation
  const { presentCount, absentCount } = useMemo(() => {
    if (!activeProfile) return { presentCount: 0, absentCount: 0 };
    
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    let present = 0;
    let absent = 0;

    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const status = activeProfile.attendance[dateStr];
      if (status === AttendanceStatus.PRESENT) present++;
      if (status === AttendanceStatus.ABSENT) absent++;
    });

    return { presentCount: present, absentCount: absent };
  }, [currentDate, activeProfile]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600 via-fuchsia-600 to-blue-600 font-sans text-slate-800 pb-12">
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-fuchsia-600 shadow-xl shadow-fuchsia-900/20">
              <CalendarCheck size={28} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none tracking-tight drop-shadow-sm">Attendance Tracker</h1>
              <p className="text-[11px] uppercase font-bold text-white/80 mt-1 tracking-widest">Offline Mode</p>
            </div>
          </div>

          <button 
            onClick={() => setShowProfileManager(!showProfileManager)}
            className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm border border-white/10"
          >
            {showProfileManager ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Profile Manager Drawer/Section */}
        {showProfileManager && (
          <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
             <div className="flex justify-between items-end mb-4 px-2">
               <h2 className="text-xl font-bold text-white drop-shadow-md">Manage Workers</h2>
             </div>
             <ProfileManager 
               profiles={profiles}
               activeProfileId={activeProfileId}
               onSelectProfile={(id) => {
                 setActiveProfileId(id);
                 setShowProfileManager(false);
               }}
               onCreateProfile={handleCreateProfile}
             />
          </div>
        )}

        {!activeProfile && !showProfileManager && (
          <div className="text-center py-24 px-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mt-8 mx-auto max-w-lg shadow-2xl">
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <CalendarCheck size={40} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
             <p className="text-white/80 font-medium text-lg">Please select or create a worker profile to start tracking attendance.</p>
             <button 
               onClick={() => setShowProfileManager(true)}
               className="mt-8 px-8 py-4 bg-white text-fuchsia-700 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform"
             >
               Get Started
             </button>
          </div>
        )}

        {activeProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div>
                   <h2 className="text-2xl font-black text-white drop-shadow-md">Attendance</h2>
                   <p className="text-sm font-bold text-white/70">Tap dates to mark status</p>
                 </div>
              </div>
              <Calendar 
                currentDate={currentDate} 
                onDateChange={setCurrentDate}
                attendanceData={activeProfile.attendance}
                onToggleAttendance={handleToggleAttendance}
              />
            </div>

            {/* Sidebar Stats Section */}
            <div className="space-y-4">
              <div className="px-2">
                <h2 className="text-2xl font-black text-white drop-shadow-md">{activeProfile.name}</h2>
                <p className="text-sm font-bold text-white/70">Monthly Overview</p>
              </div>
              <StatsPanel 
                presentCount={presentCount}
                absentCount={absentCount}
                monthName={format(currentDate, 'MMMM')}
                year={currentDate.getFullYear()}
                dailyRate={activeProfile.dailyRate}
                onRateChange={handleRateChange}
                workerName={activeProfile.name}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;