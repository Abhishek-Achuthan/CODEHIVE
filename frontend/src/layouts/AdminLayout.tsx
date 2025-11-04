import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, Users, FileText, Calendar, DollarSign, BarChart3, LogOut } from "lucide-react";
import { AuthService } from "../services/authService";
import { logout } from "../store/slices/authSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
       console.log(error);
    } finally {
      dispatch(logout());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-black text-gray-100 flex flex-col">
        <div className="p-6 text-2xl font-bold  border-gray-700 border">CODEHIVE</div>

        <nav className="flex-1 p-4 space-y-2 border border-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <Users className="w-5 h-5" />
            Users
          </NavLink>

          <NavLink
            to="/admin/mentors"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <FileText className="w-5 h-5" />
            Mentors
          </NavLink>

          <NavLink
            to="/admin/subscriptions"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <DollarSign className="w-5 h-5" />
            Subscriptions
          </NavLink>

          <NavLink
            to="/admin/plans"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <Calendar className="w-5 h-5" />
            Plans
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <BarChart3 className="w-5 h-5" />
            Reports
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>

        
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
