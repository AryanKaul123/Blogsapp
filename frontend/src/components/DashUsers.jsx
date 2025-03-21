import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getusers`,{
          credentials:"include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log('Error fetching users:', error.message);
      }
    };

    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log('Error fetching more users:', error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      } else {
        console.log('Failed to delete user');
      }
    } catch (error) {
      console.log('Error deleting user:', error.message);
    }
  };

  return (
    <div className='p-4 w-full overflow-x-auto text-gray-800 dark:text-gray-200'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <table className='w-full min-w-max table-auto border-collapse shadow-lg'>
            <thead className='bg-gray-200 dark:bg-gray-700'>
              <tr>
                <th className='p-3 border'>Date Created</th>
                <th className='p-3 border'>User Image</th>
                <th className='p-3 border'>Username</th>
                <th className='p-3 border'>Email</th>
                <th className='p-3 border'>Admin</th>
                <th className='p-3 border'>Delete</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800'>
              {users.map((user) => (
                <tr key={user._id} className='text-center border-t'>
                  <td className='p-3 border'>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className='p-3 border'>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover rounded-full bg-gray-300 mx-auto'
                    />
                  </td>
                  <td className='p-3 border'>{user.username}</td>
                  <td className='p-3 border'>{user.email}</td>
                  <td className='p-3 border'>
                    {user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                  </td>
                  <td className='p-3 border'>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='text-red-500 hover:underline'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='block w-full mt-4 p-2 text-teal-500 hover:underline'
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no users yet!</p>
      )}

      {/* Custom Modal */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-xs w-full'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-center text-gray-600 dark:text-gray-300'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDeleteUser}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500'
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
