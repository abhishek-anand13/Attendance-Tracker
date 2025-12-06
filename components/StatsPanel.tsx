import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileText, Loader2, IndianRupee, Wallet, Copy, CheckCircle } from 'lucide-react';
import { generateMonthlyReport } from '../services/gemini';

interface StatsPanelProps {
  presentCount: number;
  absentCount: number;
  monthName: string;
  year: number;
  dailyRate: number;
  workerName: string;
  onRateChange: (rate: number) => void;
}

const COLORS = ['#34d399', '#f43f5e']; // Emerald and Rose

export const StatsPanel: React.FC<StatsPanelProps> = ({
  presentCount,
  absentCount,
  monthName,
  year,
  dailyRate,
  workerName,
  onRateChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalMarked = presentCount + absentCount;
  const data = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: absentCount },
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    const result = await generateMonthlyReport(monthName, year, presentCount, absentCount, dailyRate, workerName);
    setReport(result);
    setLoading(false);
  };

  const handleCopyReport = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const estimatedSalary = presentCount * dailyRate;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-[2rem] shadow-xl shadow-purple-900/10 border border-white/50">
          <div className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mb-2">Days Present</div>
          <div className="text-4xl font-black text-slate-800">{presentCount}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">/ {new Date(year, new Date().getMonth() + 1, 0).getDate()} days</div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-600 to-purple-700 p-5 rounded-[2rem] shadow-xl shadow-fuchsia-900/20 text-white border border-white/20">
          <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Wallet size={12} /> Salary
          </div>
          <div className="text-3xl font-black">₹{estimatedSalary}</div>
          <div className="text-xs text-white/60 mt-1 font-medium">Pending payment</div>
        </div>
      </div>

      {/* Settings & Chart Container */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl shadow-purple-900/10 border border-white/50">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-fuchsia-500" />
          Settings
        </h3>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          Daily Wage
        </label>
        <div className="flex items-center gap-2 mb-6">
           <div className="relative w-full">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <span className="text-fuchsia-500 font-black text-lg">₹</span>
             </div>
             <input
              type="number"
              value={dailyRate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="w-full pl-9 pr-4 py-4 bg-fuchsia-50 border-2 border-fuchsia-100 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-300 focus:outline-none transition-all"
              placeholder="500"
            />
           </div>
        </div>

        {totalMarked > 0 ? (
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-400 text-sm font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            No data yet
          </div>
        )}
      </div>

      {/* Offline Report Section */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl shadow-purple-900/10 border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-fuchsia-500" />
            Summary
          </h3>
        </div>
        
        <p className="text-sm text-slate-500 mb-6 font-semibold leading-relaxed">
          Generate a text report instantly to copy and send via WhatsApp.
        </p>

        {!report ? (
          <button
            onClick={handleGenerateReport}
            disabled={loading || totalMarked === 0}
            className={`
              w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-black tracking-wide uppercase text-sm transition-all shadow-lg active:scale-95
              ${loading || totalMarked === 0 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-fuchsia-200'}
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Generate Report'}
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner mb-4">
                <pre className="whitespace-pre-wrap font-mono text-slate-600 text-xs leading-relaxed">
                  {report}
                </pre>
             </div>
             <div className="flex gap-3">
                <button 
                  onClick={handleCopyReport}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg
                    ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}
                  `}
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={() => setReport(null)}
                  className="px-6 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors border-2 border-slate-100"
                >
                  Close
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};