import { Avatar, Button, Dropdown, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Check if the response is OK
      if (!res.ok) {
        const errorData = await res.text(); // Handle non-JSON error responses
        console.log("Error during signout:", errorData);
        return;
      }
  
      const data = await res.json();
      dispatch(signoutSuccess());
      console.log("Signout successful:", data.message);
  
    } catch (error) {
      console.log("Network error during signout:", error.message);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b-2 px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg sm:text-2xl font-semibold dark:text-white flex items-center gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white font-bold">
            Kaul's
          </span>
          <span className="font-medium text-gray-900 dark:text-white">Blog</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSubmit} className="hidden md:flex flex-grow justify-center mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 sm:w-64 md:w-80 rounded-lg shadow-sm p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Mobile Search Icon */}
        <button onClick={() => setShowSearch(!showSearch)} className="md:hidden text-gray-700 dark:text-white text-xl mr-4">
          <AiOutlineSearch />
        </button>

        {/* Mobile Search Bar */}
        {showSearch && (
          <form onSubmit={handleSubmit} className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 p-3 shadow-md z-50 md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg shadow-sm p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        )}

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4">
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-300 font-medium">
            <Link to="/" className={`${path === '/' ? 'text-blue-500' : 'hover:text-gray-500'}`}>Home</Link>
            <Link to="/about" className={`${path === '/about' ? 'text-blue-500' : 'hover:text-gray-500'}`}>About</Link>
            <Link to="/projects" className={`${path === '/projects' ? 'text-blue-500' : 'hover:text-gray-500'}`}>Projects</Link>
          </div>

          {/* Theme Toggle */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-300 dark:border-gray-700"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-500" />}
          </button>

          {/* User Dropdown / Sign-in */}
          {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        </div>
      </header>

      {/* Main Content with Top Margin */}
      <main className="mt-[72px] p-4"> {/* Adjust the margin-top if necessary */}
        {/* Your page content goes here */}
      </main>
    </>
  );
}
