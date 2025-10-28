import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import { userLogout } from '../../../api/endpoints/authAPI';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout =async  () => {
    try {
      await userLogout();
    } catch (error) {
      console.log('log out error',error);
    }finally{
      
      dispatch(logout());

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();

      navigate('/');
    }
  };


  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <span className="text-2xl font-bold text-white">CODEHIVE</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#product" className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium">
                Product
              </a>
              <a href="#features" className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#customers" className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium">
                Customers
              </a>
              <a href="#pricing" className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium">
                Pricing
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, {user?.firstName || user?.email}!
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to CodeHive,<br />
            <span className="text-blue-600">{user?.firstName}!</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ready to start collaborating and building amazing projects together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-200 shadow-lg"
            >
              Start Coding
            </button>
            <button 
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition duration-200"
            >
              Create Project
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What you can do
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-lg border border-gray-200 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-Time Code Collaboration
              </h3>
              <p className="text-white">
                The code is available on the Internet. It is not accessible to all employees or other employees for their own time.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-200 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Integrated Whiteboard
              </h3>
              <p className="text-white">
                Our Whiteboard has a high number of key features that are designed to support the community.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-200 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Developer Q&A Built-In
              </h3>
              <p className="text-white">
                The code is available on the Internet. It is not accessible to all employees or other employees for their own time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              BUILT FOR STUDENTS, TEAMS & INTERVIEWERS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-black p-6 rounded-lg border border-white shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-3">STUDENTS</h3>
              <p className="text-white">Show day numbers each student id</p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-white shadow-sm">
              <h3 className="text-xl font-semibold text-white  mb-3">TEAMS</h3>
              <p className="text-white">Post program each other checklists</p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-white shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-3">INTERVIEWERS</h3>
              <p className="text-white">Host quality interview for your team</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;