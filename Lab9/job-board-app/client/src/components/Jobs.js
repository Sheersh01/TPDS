import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Jobs({ token, user }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills_required: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [applications, setApplications] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    fetchJobs();
    fetchRecommendedJobs();
  }, [page, search]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5003/jobs?page=${page}&limit=${limit}&search=${search}`
      );
      setJobs(response.data.jobs);
      setTotal(response.data.total);
    } catch (err) {
      setError("Failed to load jobs");
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5003/jobs/recommended",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecommendedJobs(response.data);
    } catch (err) {
      setError("Failed to load recommended jobs");
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(
        `http://localhost:5003/applications/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications((prev) => ({ ...prev, [jobId]: response.data }));
    } catch (err) {
      setError("Failed to load applications");
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/jobs", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", skills_required: "" });
      fetchJobs();
      fetchRecommendedJobs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add job");
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:5003/applications",
        { job_id: jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchApplications(jobId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to apply");
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
      fetchRecommendedJobs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete job");
    }
  };

  return (
    <div className="jobs">
      <h2>Job Board</h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search jobs..."
        />
      </div>
      <form onSubmit={handleJobSubmit} className="job-form">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Job Title"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Job Description"
        />
        <textarea
          value={form.skills_required}
          onChange={(e) =>
            setForm({ ...form, skills_required: e.target.value })
          }
          placeholder="Required Skills (e.g., JavaScript, Python)"
        />
        <button type="submit">Post Job</button>
      </form>
      {error && <p className="error">{error}</p>}
      <h3>Recommended Jobs for You</h3>
      <div className="job-list">
        {recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => (
            <div key={job.id} className="job-card recommended">
              <h4>{job.title}</h4>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
              <p>
                <strong>Skills Required:</strong> {job.skills_required}
              </p>
              <p>
                <strong>Posted by:</strong> {job.username}
              </p>
              <button onClick={() => fetchApplications(job.id)}>
                View Applicants
              </button>
              <button onClick={() => handleApply(job.id)}>Apply</button>
              {job.user_id === user.id && (
                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              )}
              {applications[job.id] && (
                <div className="applications">
                  <h5>Applicants:</h5>
                  {applications[job.id].length > 0 ? (
                    applications[job.id].map((app) => (
                      <p key={app.id}>{app.username}</p>
                    ))
                  ) : (
                    <p>No applicants yet</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No recommended jobs yet</p>
        )}
      </div>
      <h3>All Jobs</h3>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h4>{job.title}</h4>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
              <p>
                <strong>Skills Required:</strong> {job.skills_required}
              </p>
              <p>
                <strong>Posted by:</strong> {job.username}
              </p>
              <button onClick={() => fetchApplications(job.id)}>
                View Applicants
              </button>
              <button onClick={() => handleApply(job.id)}>Apply</button>
              {job.user_id === user.id && (
                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              )}
              {applications[job.id] && (
                <div className="applications">
                  <h5>Applicants:</h5>
                  {applications[job.id].length > 0 ? (
                    applications[job.id].map((app) => (
                      <p key={app.id}>{app.username}</p>
                    ))
                  ) : (
                    <p>No applicants yet</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No jobs yet! Post one above.</p>
        )}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Jobs;
