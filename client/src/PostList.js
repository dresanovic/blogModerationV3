import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = ({ refresh }) => {
  const [posts, setPosts] = useState({});
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4002/posts");
      setPosts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts.");
    }
  }, []);

  const wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const pollPostsUntilUpdated = useCallback(async (postId, commentId) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await wait(700);

      try {
        const res = await axios.get("http://localhost:4002/posts");
        const nextPosts = res.data;
        setPosts(nextPosts);
        setError(null);

        const updatedComment = nextPosts[postId]?.comments?.find(
          (comment) => comment.id === commentId
        );

        if (updatedComment && updatedComment.status !== "pending") {
          return;
        }
      } catch (err) {
        console.error("Error polling posts:", err);
      }
    }
  }, []);

  const handleCommentCreated = useCallback(
    (postId, createdComment) => {
      setPosts((currentPosts) => {
        const post = currentPosts[postId];

        if (!post) {
          return currentPosts;
        }

        return {
          ...currentPosts,
          [postId]: {
            ...post,
            comments: [...(post.comments || []), createdComment],
          },
        };
      });

      pollPostsUntilUpdated(postId, createdComment.id);
    },
    [pollPostsUntilUpdated]
  );

  // initial load + whenever parent bumps refresh
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refresh]);

  const renderedPosts = Object.values(posts).map((post) => (
      <div
          className="card"
          style={{ width: "30%", marginBottom: "20px" }}
          key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments || []} />
          <CommentCreate
              postId={post.id}
              onSuccess={(createdComment) =>
                handleCommentCreated(post.id, createdComment)
              }
          />
        </div>
      </div>
  ));

  return (
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {error ? <div className="alert alert-danger">{error}</div> : renderedPosts}
      </div>
  );
};

export default PostList;
