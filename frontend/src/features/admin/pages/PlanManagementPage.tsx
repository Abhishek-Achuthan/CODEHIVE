import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { PlanManagementPage as PlanManagementContent } from "../components/PlanManagementPage";

export const PlanManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <PlanManagementContent />
    </AdminLayout>
  );
};
