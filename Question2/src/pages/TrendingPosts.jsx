import { useEffect, useState } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';
import { Typography, Box, CircularProgress } from '@mui/material';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts?type=popular')
      .then(res => setPosts(res.data.posts))
      .catch(err => console.error("Error fetching trending posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Trending Posts</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post, idx) => <PostCard key={idx} post={post} />)
      )}
    </Box>
  );
};

export default TrendingPosts;
