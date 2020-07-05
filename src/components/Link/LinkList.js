import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';
import { LINKS_PER_PAGE } from '../../utils';
import axios from 'axios';

function LinkList(props) {
  const history = useHistory();
  const params = useParams();
  const { firebase } = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const isNewPage = history.location.pathname.includes('new');
  const isTopPage = history.location.pathname.includes('top');
  const page = Number(params.page);

  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, page]);

  const getLinks = () => {
    const hasCursor = Boolean(cursor);
    if (isTopPage) {
      return firebase.db
        .collection('links')
        .orderBy('voteCount', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (page === 1) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE
      axios.get(`https://us-central1-hooks-news-7e582.cloudfunctions.net/linksPagination?offset=${offset}`)
      .then(res => {
        const links = res.data;
        const lastLink = links[links.length - 1]
        setLinks(links)
        setCursor(lastLink)
      })
      return () => {}
    }
  };

  const handleSnapshot = snapshot => {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    setLinks(links);
    const lastLink = links[links.length - 1];
    setCursor(lastLink);
  };

  const visitPrevPage = () => {
    if (page > 1) {
      history.push(`/new/${page - 1}`);
    }
  };

  const visitNextPage = () => {
    if (page <= links.length / LINKS_PER_PAGE) {
      history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;

  return (
    <div>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className='pagination'>
          <div className='pointer mr2' onClick={visitPrevPage}>
            Previous
          </div>
          <div className='pointer ' onClick={visitNextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkList;
