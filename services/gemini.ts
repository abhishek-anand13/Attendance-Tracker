// Renamed to act as local report generator
// No external imports needed for offline mode

export const generateMonthlyReport = async (
  monthName: string,
  year: number,
  presentCount: number,
  absentCount: number,
  dailyRate: number,
  workerName: string
): Promise<string> => {
  // Simulate an async operation for UI consistency
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalSalary = presentCount * dailyRate;
      
      const report = `Monthly Attendance Report for ${workerName}
--------------------------------------------------
Period: ${monthName} ${year}

Summary:
- Days Present: ${presentCount}
- Days Absent: ${absentCount}

Financials:
- Daily Rate: ₹${dailyRate}
- Total Payable: ₹${totalSalary}

--------------------------------------------------
Calculated automatically by Attendance Tracker.
      `;
      
      resolve(report);
    }, 500);
  });
};