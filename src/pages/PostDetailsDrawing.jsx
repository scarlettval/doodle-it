import React, { useEffect, useState } from 'react';
import { supabase } from '../client.js';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import DrawingCanvas from '../components/DrawingCanvas.jsx';

const PostDetailsDrawing = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]); // For filtered comments
  const [newComment, setNewComment] = useState('');
  const [drawingData, setDrawingData] = useState(null); // Store the drawing image data
  const [filterImages, setFilterImages] = useState(false); // For toggling the filter
  const [errorMessage, setErrorMessage] = useState(''); // New error state for showing the message

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
    if (!post) return;

    // Increment the upvotes by 1
    const updatedUpvotes = post.upvotes + 1;

    const { error } = await supabase
      .from('Posts')
      .update({ upvotes: updatedUpvotes })
      .eq('id', id);

    if (error) {
      console.error('Error upvoting post:', error);
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        upvotes: updatedUpvotes,
      }));
    }
  };

  const handleCommentUpvote = async (commentId) => {
    const commentToUpdate = comments.find(comment => comment.id === commentId);
    if (!commentToUpdate) return;
  
    // Increment the upvotes for the comment by 1
    const updatedUpvotes = commentToUpdate.upvotes + 1;
  
    const { error } = await supabase
      .from('Comments')
      .update({ upvotes: updatedUpvotes })
      .eq('id', commentId);
  
    if (error) {
      console.error('Error upvoting comment:', error);
    } else {
      // Update local state with the new upvotes count for the comment
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, upvotes: updatedUpvotes }
            : comment
        )
      );
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
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      const commentsWithUpvotes = data.map(comment => ({
        ...comment,
        upvotes: comment.upvotes || 0,  // Default to 0 if no upvotes
      }));
      setComments(commentsWithUpvotes || []);
      setFilteredComments(commentsWithUpvotes || []); // Set filtered comments on load
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Check if the canvas is blank (no drawing data)
    if (!drawingData) {
      setErrorMessage("You need to doodle before posting");
      return; // Prevent form submission if no drawing data
    }

    // Proceed with submission if there's a drawing
    const { data, error } = await supabase
      .from('Comments')
      .insert([{
        post_id: id,
        text: newComment, // Optional, text can still be included even if empty
        image_data: drawingData, // Include the image data for the drawing
        upvotes: 0 // Initialize upvotes to 0
      }]);

    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      setNewComment(''); // Reset comment input
      setDrawingData(null); // Reset drawing data
      setErrorMessage(''); // Clear error message after successful submission
      fetchComments(); // Refresh comments
    }
  };
  
  // Disable the submit button if no comment or drawing is provided
  const isSubmitDisabled = !drawingData;

  // Toggle the filter for comments with images
  const toggleFilter = () => {
    setFilterImages(prevState => !prevState);
  };

  // Apply the filter when it's toggled
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (filterImages) {
      setFilteredComments(comments.filter(comment => comment.image_data));
    } else {
      setFilteredComments(comments);
    }
  }, [filterImages, comments]);

  if (!post) return <h2>Loading...</h2>;

  return (
    <div className="PostDetailsWrapper">
      <div className="PostDetails">
        <h1 className="title-challenge">{post.title}</h1>
        <p>{post.description}</p>

        <button className="upvoteBtn" onClick={() => handleUpvote(post.id)}>
          ⬆️ Upvote ({post.upvotes})
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
          <DrawingCanvas postId={post.id} onSaveDrawing={setDrawingData} />

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Write A Caption..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="submit-comment-button" disabled={isSubmitDisabled}>
              Post
            </button>
          </form>
          
          {/* Show error message if no drawing data */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        
          {/* List of filtered comments */}
          <div className="comments-list">
            {filteredComments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              filteredComments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.text}</p>
                  {comment.image_data && <img src={comment.image_data} alt="Drawing" />}
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>

                  {comment.image_data && (
                    <button className="heart-upvote-button" onClick={() => handleCommentUpvote(comment.id)}>
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

export default PostDetailsDrawing;
