import { NavLink } from 'react-router-dom';
import {
  MdOutlineQuestionAnswer,
  MdOutlineLightbulb,
  MdOutlineBookmarkBorder,
  MdOutlineArticle,
  MdOutlineCheckCircle,
} from "react-icons/md";

export default function Sidebar() {
  const navItems = [
    {
      title: 'Questions',
      path: '/qna',
      icon: <MdOutlineQuestionAnswer className="h-5 w-5" />,
      end: true
    },
    {
      title: 'AI Assist',
      path: '/qna/ai-assist',
      icon: <MdOutlineLightbulb className="h-5 w-5" />
    },
    {
      title: 'Saved',
      path: '/qna/saved',
      icon: <MdOutlineBookmarkBorder className="h-5 w-5" />
    }
  ];

  const personalNavItems = [
    {
      title: 'My questions',
      path: '/qna/my-questions',
      icon: <MdOutlineArticle className="h-5 w-5" />
    },
    {
      title: 'Answered by me',
      path: '/qna/answered-by-me',
      icon: <MdOutlineCheckCircle className="h-5 w-5" />
    }
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl h-[calc(100vh-64px)] sticky top-16 flex-col">
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                )}
                <span className={`transition-colors duration-300 flex items-center justify-center ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                {item.title}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-8 pt-6 border-t border-white/5 w-full space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-3">
            Personal
          </p>

          {personalNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  )}
                  <span className={`transition-colors duration-300 flex items-center justify-center ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.icon}
                  </span>
                  {item.title}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
