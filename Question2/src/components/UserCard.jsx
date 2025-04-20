import { Card, CardContent, Typography, Avatar, Stack } from '@mui/material';

const UserCard = ({ user }) => (
  <Card>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={user.image} alt={user.name} />
        <div>
          <Typography variant="subtitle1">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.postCount} posts
          </Typography>
        </div>
      </Stack>
    </CardContent>
  </Card>
);

export default UserCard;
