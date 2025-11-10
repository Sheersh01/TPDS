import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user, setUser, token }) {
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateBio = async (e) => {
    e.preventDefault();
    try {
      // Note: Requires a new endpoint to update bio
      setUser({ ...user, bio });
      alert("Bio updated");
    } catch (err) {
      setError("Failed to update bio");
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <form onSubmit={updateBio} className="profile-form">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Update Bio"
        />
        <button type="submit">Update Bio</button>
      </form>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Profile;
