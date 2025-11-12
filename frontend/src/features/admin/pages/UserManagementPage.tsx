import AdminLayout from "../../../layouts/AdminLayout";
import { UserTablePage } from "../components/UserTablePage";

export const UserManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <UserTablePage title="Users" role="user"/>
    </AdminLayout>
  )
}