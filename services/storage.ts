import { AttendanceStatus, WorkerProfile } from '../types';

const OLD_STORAGE_KEY = 'cook_attendance_data';
const OLD_SETTINGS_KEY = 'cook_app_settings';
const PROFILES_KEY = 'worker_profiles';
const ACTIVE_PROFILE_KEY = 'active_profile_id';

export const getProfiles = (): WorkerProfile[] => {
  try {
    const storedProfiles = localStorage.getItem(PROFILES_KEY);
    if (storedProfiles) {
      return JSON.parse(storedProfiles);
    }

    // Migration Logic: Check for old data
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    const oldSettings = localStorage.getItem(OLD_SETTINGS_KEY);
    
    if (oldData) {
      const attendance = JSON.parse(oldData);
      const rate = oldSettings ? JSON.parse(oldSettings).dailyRate : 500;
      
      const defaultProfile: WorkerProfile = {
        id: crypto.randomUUID(),
        name: 'Helper',
        dailyRate: rate || 500,
        attendance: attendance,
        theme: 'indigo'
      };

      // Save migrated data
      localStorage.setItem(PROFILES_KEY, JSON.stringify([defaultProfile]));
      localStorage.removeItem(OLD_STORAGE_KEY);
      localStorage.removeItem(OLD_SETTINGS_KEY);
      
      return [defaultProfile];
    }

    return [];
  } catch (e) {
    console.error("Failed to load profiles", e);
    return [];
  }
};

export const saveProfiles = (profiles: WorkerProfile[]) => {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error("Failed to save profiles", e);
  }
};

export const getActiveProfileId = (): string | null => {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
};

export const saveActiveProfileId = (id: string) => {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
};