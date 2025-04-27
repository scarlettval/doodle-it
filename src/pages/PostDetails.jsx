import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

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
  
        <Link to={`/edit/${post.id}`}>
          <button className="edit-button">Edit Post</button>
        </Link>
      </div>
    </div>
  );
  
};

export default PostDetails;
