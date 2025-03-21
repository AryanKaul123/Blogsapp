import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comment/getcomments`,{
          credentials:"include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log('Error fetching comments:', error.message);
      }
    };

    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/comment/getcomments?startIndex=${comments.length}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log('Error fetching more comments:', error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log('Error deleting comment:', error.message);
    }
  };

  return (
    <div className='p-4 w-full overflow-x-auto text-gray-800 dark:text-gray-200'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <table className='w-full min-w-max table-auto border-collapse shadow-lg'>
            <thead className='bg-gray-200 dark:bg-gray-700'>
              <tr>
                <th className='p-3 border'>Date Updated</th>
                <th className='p-3 border'>Comment Content</th>
                <th className='p-3 border'>Number of Likes</th>
                <th className='p-3 border'>Post ID</th>
                <th className='p-3 border'>User ID</th>
                <th className='p-3 border'>Delete</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800'>
              {comments.map((comment) => (
                <tr key={comment._id} className='text-center border-t'>
                  <td className='p-3 border'>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                  <td className='p-3 border'>{comment.content}</td>
                  <td className='p-3 border'>{comment.numberOfLikes}</td>
                  <td className='p-3 border'>{comment.postId}</td>
                  <td className='p-3 border'>{comment.userId}</td>
                  <td className='p-3 border'>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
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
        <p className='text-center text-gray-600 dark:text-gray-300'>You have no comments yet!</p>
      )}

      {/* Custom Modal */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-xs w-full'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-center text-gray-600 dark:text-gray-300'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDeleteComment}
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
