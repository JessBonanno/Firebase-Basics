import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getDomain } from '../../utils';
import distanceInWordsToNow from 'date-fns/esm/formatDistanceToNow';
import FirebaseContext from '../../firebase/context';

function LinkItem({ link, index, showCount }) {
  const history = useHistory();
  const { firebase, user } = useContext(FirebaseContext);

  const handleVote = () => {
    if (!user) {
      history.push('/login');
    } else {
      const voteRef = firebase.db.collection('links').doc(link.id);
      voteRef.get().then(doc => {
        if (doc.exists) {
          const prevVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...prevVotes, vote];
          const voteCount = updatedVotes.length;
          voteRef.update({ votes: updatedVotes, voteCount });
        }
      });
    }
  };

  const postedByAuthUser = user && user.uid === link.postedBy.id;

  const handleDeleteLink = () => {
    const linkRef = firebase.db.collection('links').doc(link.id);
    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${link.id} deleted `);
      })
      .catch(err => {
        console.error('Error deleting document: ', err);
      });
  };

  return (
    <div className='flex items-start mt2'>
      <div className='flex items-center'>
        {showCount && <span className='gray'>{index}.</span>}
        <button className='vote-button' onClick={handleVote}>
          ⬆️
        </button>
      </div>
      <div className='ml1'>
        <div>
          <a href={link.url} className='black no-underline'>
            {link.description}
          </a>{' '}
          <span className='link'>({getDomain(link.url)})</span>
        </div>
        <div className='f6 lh-copy gray'>
          {link.voteCount} votes by {link.postedBy.name}{' '}
          {distanceInWordsToNow(link.created)} ago {'|'}
          <Link to={`/link/${link.id}`}>
            {link.comments.length > 0
              ? `${link.comments.length} comments`
              : 'discuss'}
          </Link>
          {postedByAuthUser && (
            <>
              {'|'}
              <span className='delete-button' onClick={handleDeleteLink}>
                Delete
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LinkItem;
