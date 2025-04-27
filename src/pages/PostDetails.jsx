import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

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
        window.location = "/"; // Redirect to home after deleting
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

  useEffect(() => {
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

    fetchPost();
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

      </div>
    </div>
  );
  
};

export default PostDetails;
