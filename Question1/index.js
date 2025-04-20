import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // ⬅️ load env vars at top

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const baseURL = 'http://20.244.56.144/evaluation-service';

let users = [];

async function fetchUsers() {
    // if (users.length) return users;

    try {
        const response = await axios.get(`${baseURL}/users`, {
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            },
            // timeout: 10000
        });

        users = response.data;
        console.log("Fetched users:", users.length);
        return users;

    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}


app.get("/users", async (req, res) => {
    try {
      const fetchedUsers = await fetchUsers();  
      const userCommentData = [];
  
      const userIds = Object.keys(fetchedUsers.users);
  
      for (const userId of userIds) {
       
        const postsRes = await axios.get(`${baseURL}/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${process.env.access_token}`,
          },
        });
  
        const posts = postsRes.data.posts;
        let totalComments = 0;
  
 
        for (const post of posts) {
          const commentsRes = await axios.get(`${baseURL}/posts/${post.id}/comments`, {
            headers: {
              Authorization: `Bearer ${process.env.access_token}`,
            },
          });
  
          const comments = commentsRes.data.comments;
          totalComments += comments.length;
        }
  
        userCommentData.push({
          id: userId,
          name: fetchedUsers.users[userId],
          totalComments,
        });
      }
  
      
      const top5 = userCommentData
        .sort((a, b) => b.totalComments - a.totalComments)
        .slice(0, 5);
  
      res.json({ topUsers: top5 });
    } catch (error) {
      console.error("Error fetching top commented users:", error.message);
      res.status(500).json({ error: "Failed to fetch top users" });
    }
  });
  

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
