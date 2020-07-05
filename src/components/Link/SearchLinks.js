import React, { useState, useContext, useEffect } from 'react';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';

function SearchLinks() {
  const { firebase } = useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getInitialLinks();
  }, []);

  const getInitialLinks = () => {
    firebase.db
      .collection('links')
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  };

  const handleSearch = e => {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedLinks);
  };

  console.log(filteredLinks);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={e => setFilter(e.target.value)} />
          <button>OK</button>
        </div>
      </form>
      {filteredLinks.map((link, index) => (
        <LinkItem key={link.id} showCount={false} link={link} index={index} />
      ))}
    </div>
  );
}

export default SearchLinks;
