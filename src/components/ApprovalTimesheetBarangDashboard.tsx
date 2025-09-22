import React from 'react';
import TimesheetBarangDashboard from './TimesheetBarangDashboard';

const ApprovalTimesheetBarangDashboard: React.FC = () => {
  return (
    <TimesheetBarangDashboard
      title="Approve Timesheet Barang"
      approvalMode={true}
    />
  );
};

export default ApprovalTimesheetBarangDashboard;
