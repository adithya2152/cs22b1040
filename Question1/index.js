import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();  

const app = express();
const PORT = 8000;

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
        console.log("Calling:", `${baseURL}/users`);
        console.log("Token:", process.env.access_token ? "Present " : "Missing ");
        console.log("Users:", users.length ? "Present" : "Empty");
        console.log("Headers:", {
            'Authorization': `Bearer ${process.env.access_token}`
        });

        const fetchedUsers = await fetchUsers();  
        res.json(fetchedUsers);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 
app.get("/posts", async (req, res) => {
  const type = req.query.type;

  try {
    const usersRes = await axios.get(`${baseURL}/users`, authHeader);
    const userIds = Object.keys(usersRes.data.users).slice(0, 10); 

    let allPosts = [];

    for (const userId of userIds) {
      try {
        const postsRes = await axios.get(`${baseURL}/users/${userId}/posts`, authHeader);
        const posts = postsRes.data.posts.map(post => ({
          ...post,
          username: usersRes.data.users[userId],
        }));
        allPosts.push(...posts);
      } catch (err) {
        console.warn(`⚠️ Failed to fetch posts for user ${userId}: ${err.message}`);
      }
    }

    if (type === "popular") {
      for (let post of allPosts) {
        try {
          await delay(150); // prevent rate limiting
          const commentsRes = await axios.get(`${baseURL}/posts/${post.id}/comments`, authHeader);
          post.commentCount = commentsRes.data.comments.length;
        } catch (err) {
          post.commentCount = 0;
          console.warn(`⚠️ Failed to get comments for post ${post.id}: ${err.message}`);
        }
      }

      allPosts.sort((a, b) => b.commentCount - a.commentCount);
    }

    if (type === "latest") {
      allPosts.sort((a, b) => b.id - a.id);  
    }

    res.json({ posts: allPosts.slice(0, 10) });  
  } catch (error) {
    console.error("Error in /posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
 
app.get("/feed", async (req, res) => {
  try {
    // Fetch users first
    const usersRes = await axios.get(`${baseURL}/users`, {
      headers: {
        'Authorization': `Bearer ${process.env.access_token}`
      }
    });

    const userIds = Object.keys(usersRes.data.users).slice(0, 10);  
    let allPosts = [];

    // Fetch posts from each user
    for (const userId of userIds) {
      try {
        const postsRes = await axios.get(`${baseURL}/users/${userId}/posts`, {
          headers: {
            'Authorization': `Bearer ${process.env.access_token}`
          }
        });
        const posts = postsRes.data.posts.map(post => ({
          ...post,
          username: usersRes.data.users[userId],  
        }));
        allPosts.push(...posts);
      } catch (err) {
        console.warn(`⚠️ Skipping user ${userId}: ${err.message}`);
      }
    }

    res.json({ posts: allPosts });
  } catch (error) {
    console.error("🔥 Error in /feed:", error.message);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
