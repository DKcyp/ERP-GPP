import React from "react";
import BarangDibuangDashboard from "./BarangDibuangDashboard";

const ApprovalBarangRusakPage: React.FC = () => {
  return (
    <BarangDibuangDashboard
      showAddButton={false}
      showEditButton={false}
      showDeleteButton={false}
      showApproveRejectButtons={true}
    />
  );
};

export default ApprovalBarangRusakPage;
