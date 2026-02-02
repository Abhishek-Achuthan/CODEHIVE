import AdminLayout from "../../../layouts/AdminLayout";
import { MentorApplicationsPage } from "../components/MentorApplicationsPage";

export const MentorApplicationsManagementPage: React.FC = () => {
    return (
        <AdminLayout>
            <MentorApplicationsPage />
        </AdminLayout>
    );
};
