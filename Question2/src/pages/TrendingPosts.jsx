import { useEffect, useState } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';
import { Typography } from '@mui/material';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/trending-posts').then(res => setPosts(res.data));
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>Trending Posts</Typography>
      {posts.map((post, idx) => <PostCard key={idx} post={post} />)}
    </>
  );
};

export default TrendingPosts;
