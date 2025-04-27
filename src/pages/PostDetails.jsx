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
  const [drawingData, setDrawingData] = useState(null); // Store the drawing image data

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
  
  const handleUpvote = async (commentId) => {
    // Find the comment with the given ID
    const comment = comments.find(c => c.id === commentId);
  
    // Only allow upvoting if the comment has an image
    if (comment && comment.image_data) {
      // Update upvotes in the database
      const { error } = await supabase
        .from('Comments')
        .update({ upvotes: comment.upvotes + 1 })
        .eq('id', commentId);
  
      // If there is an error, log it
      if (error) {
        console.error('Error upvoting comment:', error);
      } else {
        // Update the state optimistically to reflect the change immediately
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
          )
        );
      }
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
      // Ensure each comment has an 'upvotes' property, default to 0 if not set
      const commentsWithUpvotes = data.map(comment => ({
        ...comment,
        upvotes: comment.upvotes || 0,  // Default to 0 if no upvotes are found
      }));
      setComments(commentsWithUpvotes || []);
    }
  };
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() === '' && !drawingData) return;

    const { data, error } = await supabase
      .from('Comments')
      .insert([
        {
          post_id: id,
          text: newComment,
          image_data: drawingData || null, // Include the image data if available
          upvotes: 0 // Initialize upvotes to 0
        }
      ]);

    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      setNewComment('');
      setDrawingData(null); // Reset the drawing data after submission
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

        <button className="upvote-button" onClick={() => handleUpvote(post.id)}>
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

          {/* Pass the onSaveDrawing handler to DrawingCanvas */}
          <DrawingCanvas postId={post.id} onSaveDrawing={setDrawingData} />

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
                  {comment.image_data && <img src={comment.image_data} alt="Drawing" />}
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>

                  {/* Show Heart Upvote button if there is an image */}
                  {comment.image_data && (
                    <button 
                      className="heart-upvote-button"
                      onClick={() => handleUpvote(comment.id)}
                    >
                      ❤️ {comment.upvotes || 0}
                    </button>
                  )}
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
