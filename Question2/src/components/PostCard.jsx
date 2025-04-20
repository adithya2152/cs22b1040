import { Card, CardContent, Typography } from '@mui/material';

const PostCard = ({ post }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle2" color="primary">{post.user}</Typography>
      <Typography variant="body1" sx={{ my: 1 }}>{post.content}</Typography>
      <Typography variant="body2" color="text.secondary">💬 {post.comments} comments</Typography>
    </CardContent>
  </Card>
);

export default PostCard;
