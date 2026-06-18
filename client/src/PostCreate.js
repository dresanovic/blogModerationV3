import React, { useState } from "react";
import axios from "axios";

const PostCreate = ({ onSuccess }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/posts", { title });
      setTitle("");
      if (onSuccess) onSuccess(); // notify parent to refresh list
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titleInput">Title</label>
          <input
              id="titleInput"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
  );
};

export default PostCreate;
