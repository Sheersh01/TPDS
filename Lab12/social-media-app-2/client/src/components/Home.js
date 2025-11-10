import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5005");

function Home({ token }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5005/posts");
        setPosts(response.data.posts);
      } catch (err) {
        setError("Failed to load posts");
      }
    };
    fetchPosts();

    socket.on("new_post", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    return () => socket.off("new_post");
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5005/posts",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        "http://localhost:5005/like",
        { post_id: postId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to like post");
    }
  };

  return (
    <div className="home">
      <h2>Social Media Dashboard</h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      <form onSubmit={handlePost} className="post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button type="submit">Post</button>
      </form>
      <div className="post-list">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <p>{post.content}</p>
            <p>
              <strong>Sentiment:</strong> {post.sentiment}
            </p>
            <button onClick={() => handleLike(post._id)}>Like</button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;
