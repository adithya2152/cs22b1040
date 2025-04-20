import { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const TopUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
       
        const usersArray = Object.values(res.data.users);
        setUsers(usersArray.slice(0, 5)); 
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card sx={{ maxWidth: 400, margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          Top 5 Users
        </Typography>
        <List>
          {users.map((user, index) => (
            <div key={index}>
              <ListItem>
                <ListItemText primary={user} />
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopUsers;
