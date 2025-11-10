import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Projects({ token }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [bidForm, setBidForm] = useState({ projectId: null, amount: "" });
  const [bids, setBids] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5002/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const fetchBids = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/bids/${projectId}`
      );
      setBids((prev) => ({ ...prev, [projectId]: response.data }));
    } catch (err) {
      setError("Failed to load bids");
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/projects", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", budget: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add project");
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5002/bids",
        {
          project_id: bidForm.projectId,
          amount: bidForm.amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBidForm({ projectId: null, amount: "" });
      fetchBids(bidForm.projectId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place bid");
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project");
    }
  };

  return (
    <div className="projects">
      <h2>Freelance Projects</h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      <form onSubmit={handleProjectSubmit} className="project-form">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Project Title"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Project Description"
        />
        <input
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          placeholder="Budget ($)"
        />
        <button type="submit">Post Project</button>
      </form>
      {error && <p className="error">{error}</p>}
      <h3>All Projects</h3>
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h4>{project.title}</h4>
              <p>
                <strong>Description:</strong> {project.description}
              </p>
              <p>
                <strong>Budget:</strong> ${project.budget}
              </p>
              <p>
                <strong>Posted by:</strong> {project.username}
              </p>
              <button onClick={() => fetchBids(project.id)}>View Bids</button>
              <button
                className="delete-btn"
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>
              {bids[project.id] && (
                <div className="bids">
                  <h5>Bids:</h5>
                  {bids[project.id].length > 0 ? (
                    bids[project.id].map((bid) => (
                      <p key={bid.id}>
                        {bid.username}: ${bid.amount}
                      </p>
                    ))
                  ) : (
                    <p>No bids yet</p>
                  )}
                </div>
              )}
              <form onSubmit={handleBidSubmit} className="bid-form">
                <input
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) =>
                    setBidForm({
                      projectId: project.id,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Your Bid ($)"
                />
                <button type="submit">Place Bid</button>
              </form>
            </div>
          ))
        ) : (
          <p>No projects yet! Post one above.</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
