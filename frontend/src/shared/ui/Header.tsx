import { Link } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { MdPersonOutline } from "react-icons/md";

export default function Header() {
  const { logOut, user } = useLogout();
  return (
    <header className="bg-black border-b border-gray-600">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex justify-center items-center">
            <Link to="/">
              <span className="font-black text-2xl text-white tracking-tight">
                CODE<span className="text-indigo-500">HIVE</span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#product"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Product
            </a>
            <a
              href="#features"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            <Link
              to={"/qna"}
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Q&A
            </Link>
            <a
              href="#customers"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Customers
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm flex items-center gap-2">
              <Link to={"/profile"}>
                <MdPersonOutline className="text-white w-6 h-6" />
              </Link>

              {user ? user.firstName : "Hello Guest"}
            </span>

            <button
              onClick={logOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
