import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { credentials: 'include', method: 'DELETE' }
      );
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <div className='p-4 w-full overflow-x-auto text-gray-800 dark:text-gray-200'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <table className='w-full min-w-max table-auto border-collapse shadow-lg'>
            <thead className='bg-gray-200 dark:bg-gray-700'>
              <tr>
                <th className='p-3 border'>Date Updated</th>
                <th className='p-3 border'>Post Image</th>
                <th className='p-3 border'>Post Title</th>
                <th className='p-3 border'>Category</th>
                <th className='p-3 border'>Delete</th>
                <th className='p-3 border'>Edit</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800'>
              {userPosts.map((post) => (
                <tr key={post._id} className='text-center border-t'>
                  <td className='p-3 border'>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td className='p-3 border'>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover'
                      />
                    </Link>
                  </td>
                  <td className='p-3 border'>
                    <Link to={`/post/${post.slug}`} className='text-blue-500 hover:underline'>
                      {post.title}
                    </Link>
                  </td>
                  <td className='p-3 border'>{post.category}</td>
                  <td className='p-3 border'>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className='text-red-500 hover:underline'
                    >
                      Delete
                    </button>
                  </td>
                  <td className='p-3 border'>
                    <Link to={`/update-post/${post._id}`} className='text-green-500 hover:underline'>
                      Edit
                    </Link>
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
        <p className='text-center'>You have no posts yet!</p>
      )}

      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full'>
            <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 h-14 w-14 mx-auto mb-4' />
            <h3 className='mb-5 text-center text-gray-600 dark:text-gray-300'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDeletePost}
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
