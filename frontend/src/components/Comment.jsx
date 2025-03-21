import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${comment.userId}`);
        console.log(res);
        
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 dark:text-gray-400 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave} className='text-gray-600 border'>
                Save
              </Button>
              <Button size='sm' gradientDuoTone='purpleToBlue' outline onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-700 dark:text-gray-300 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 ${
                  currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500 dark:!text-blue-400'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-500 dark:text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes + ' ' +
                  (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
