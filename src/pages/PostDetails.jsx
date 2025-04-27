import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import DrawingCanvas from '../components/DrawingCanvas.jsx';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const deletePost = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    
    if (confirmed) {
      const { error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error('Error deleting post:', error);
      } else {
        window.location = "/";
      }
    }
  };
  
  const handleUpvote = async () => {
    const { error } = await supabase
      .from('Posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);
  
    if (error) {
      console.error('Error upvoting:', error);
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        upvotes: prevPost.upvotes + 1
      }));
    }
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('Posts')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('Comments')
      .select()
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data || []);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() === '') return;

    const { data, error } = await supabase
      .from('Comments')
      .insert([
        { post_id: id, text: newComment }
      ]);

    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      setNewComment('');
      fetchComments(); // Refresh comments after adding
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  if (!post) return <h2>Loading...</h2>;

  return (
    <div className="PostDetailsWrapper">
      <div className="PostDetails">

        <h1 className='title-challenge'>{post.title}</h1>

        <p>{post.description}</p>

        <button className="upvote-button" onClick={handleUpvote}>
          Upvote
        </button>

        <Link to={`/edit/${post.id}`}>
          <button className="edit-button">Edit Post</button>
        </Link>

        <button className="delete-button" onClick={deletePost}>
          Delete Post
        </button>

        {/* --- COMMENTS SECTION --- */}
        <div className="comments-section">
          <h3>Comments</h3>

          <DrawingCanvas postId={post.id} />


          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="submit-comment-button">
              Post
            </button>
          </form>

          {/* List of comments */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.text}</p>
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
