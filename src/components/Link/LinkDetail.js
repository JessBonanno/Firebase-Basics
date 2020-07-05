import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';
import distanceInWordsToNow from 'date-fns/esm/formatDistanceToNow';

function LinkDetail(props) {
  const history = useHistory();
  const { firebase, user } = useContext(FirebaseContext);
  const params = useParams();
  const [link, setLink] = useState(null);
  const [commentText, setCommentText] = useState('');
  const linkId = params.linkId;
  const linkRef = firebase.db.collection('links').doc(linkId);
  useEffect(() => {
    getLink();
  }, []);

  const getLink = () => {
    linkRef.get().then(doc => {
      setLink({ ...doc.data(), id: doc.id });
    });
  };

  const handleAddComment = () => {
    if (!user) {
      history.pushState('/login');
    } else {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const prevComments = doc.data().comments;
          const comment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText,
          };
          const updatedComments = [...prevComments, comment];
          linkRef.update({ comments: updatedComments });
          setLink(prevState => ({
            ...prevState,
            comments: updatedComments,
          }));
          setCommentText('');
        }
      });
    }
  };

  return !link ? (
    <div>Loading...</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <textarea
        onChange={e => setCommentText(e.target.value)}
        value={commentText}
        rows='6'
        cols='60'
      />
      <div>
        <button className='button' onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
      {link.comments.map((comment, index) => (
        <div key={index}>
          <p className='comment-author'>
            {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default LinkDetail;
