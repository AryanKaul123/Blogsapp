import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/signout`, {
        credentials:"include",
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as="div"
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser?.isAdmin ? 'Admin' : 'User'}
              labelColor="dark"
              as="div"
              className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as="div"
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as="div"
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as="div"
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 rounded-md transition-colors duration-200"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
