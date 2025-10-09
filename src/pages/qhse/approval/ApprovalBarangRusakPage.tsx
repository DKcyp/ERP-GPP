import React from "react";
import BarangDibuangDashboard from "../../components/BarangDibuangDashboard";

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
