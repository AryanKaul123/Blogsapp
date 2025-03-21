import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getusers?limit=5`,{
          credentials:"include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?limit=5`,{
          credentials:"include",
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comment/getcomments?limit=5`,{
          credentials:"include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='p-4 md:mx-auto'>
    <div className='flex flex-wrap gap-6 justify-center'>
      {/* Stats Cards */}
      {[
        { title: 'Total Users', count: totalUsers, lastMonth: lastMonthUsers, Icon: HiOutlineUserGroup, color: 'bg-teal-600' },
        { title: 'Total Comments', count: totalComments, lastMonth: lastMonthComments, Icon: HiAnnotation, color: 'bg-indigo-600' },
        { title: 'Total Posts', count: totalPosts, lastMonth: lastMonthPosts, Icon: HiDocumentText, color: 'bg-lime-600' }
      ].map((item, idx) => (
        <div key={idx} className='flex flex-col p-4 dark:bg-slate-800 gap-4 w-full md:w-80 lg:w-96 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-gray-500 text-md uppercase'>{item.title}</h3>
              <p className='text-3xl font-semibold'>{item.count}</p>
            </div>
            <item.Icon className={`${item.color} text-white rounded-full text-5xl p-3 shadow-lg`} />
          </div>
          <div className='flex gap-2 text-sm items-center'>
            <span className='text-green-500 flex items-center gap-1'>
              <HiArrowNarrowUp />
              {item.lastMonth}
            </span>
            <span className='text-gray-500'>Last month</span>
          </div>
        </div>
      ))}
    </div>
  
    {/* Recent Data Tables */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-4 mx-auto'>
      {[
        { title: 'Recent Users', data: users, columns: ['User Image', 'Username'], path: 'users', renderRow: user => [
          <img src={user.profilePicture} alt='user' className='w-10 h-10 rounded-full' />, user.username
        ] },
        { title: 'Recent Comments', data: comments, columns: ['Comment Content', 'Likes'], path: 'comments', renderRow: comment => [
          comment.content, comment.numberOfLikes
        ] },
        { title: 'Recent Posts', data: posts, columns: ['Post Image', 'Post Title', 'Category'], path: 'posts', renderRow: post => [
          <img src={post.image} alt='post' className='w-14 h-10 rounded-md' />, post.title, post.category
        ] }
      ].map((section, idx) => (
        <div key={idx} className='flex flex-col shadow-lg p-4 rounded-lg dark:bg-gray-800 w-full'>
          <div className='flex justify-between items-center mb-3 text-sm font-semibold'>
            <h1 className='text-lg'>{section.title}</h1>
            <Link to={`/dashboard?tab=${section.path}`} className='text-purple-600 hover:text-purple-800'>See all</Link>
          </div>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='bg-gray-200 dark:bg-gray-700'>
                {section.columns.map((col, idx) => (
                  <th key={idx} className='p-2 font-semibold text-left'>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.data?.map((item, idx) => (
                <tr key={idx} className='border-t dark:border-gray-700'>
                  {section.renderRow(item).map((cell, idx) => (
                    <td key={idx} className='p-2'>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>


  
  );
}
 