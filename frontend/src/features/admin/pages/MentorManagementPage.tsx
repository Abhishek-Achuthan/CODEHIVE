import AdminLayout from "../../../layouts/AdminLayout";
import { UserTablePage } from "../components/UserTablePage";

export const MentorManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <UserTablePage title="Mentors" role="mentor"/>
    </AdminLayout>
  )
}