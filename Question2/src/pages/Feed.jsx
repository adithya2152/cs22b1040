import { useEffect, useState } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';
import { Typography } from '@mui/material';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetch = () => {
      api.get('/feed').then(res => setPosts(res.data));
    };
    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>Live Feed</Typography>
      {posts.map((post, idx) => <PostCard key={idx} post={post} />)}
    </>
  );
};

export default Feed;
