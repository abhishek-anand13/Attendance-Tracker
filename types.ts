export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  UNMARKED = 'UNMARKED'
}

export type ColorTheme = 'indigo' | 'rose' | 'amber' | 'emerald' | 'violet';

export interface WorkerProfile {
  id: string;
  name: string;
  dailyRate: number;
  attendance: Record<string, AttendanceStatus>;
  theme: ColorTheme;
  avatar?: string;
}

export interface MonthlyStats {
  present: number;
  absent: number;
  totalDaysInMonth: number;
  attendancePercentage: number;
}
