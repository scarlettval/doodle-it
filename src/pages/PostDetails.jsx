import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useParams, Link } from 'react-router-dom'; //go to other screens
import './PostDetails.css'; // Add this import statement at the top of your file

const PostDetails = () => {
  const { id } = useParams();  // Grab the post ID from the URL
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
    <div className="PostDetails" style={{
        transform: 'translateX(410px) translateY(120px)',  // Use transform for translation
        textAlign: 'center',
        backgroundColor: '#e7e5e5', // Use camelCase for background-color
        borderRadius: '12px', // Use camelCase for border-radius
        padding: '60px', // Single padding definition
        marginTop: '30px',
        width: '90%',
        maxWidth: '1200px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)', // Use camelCase for box-shadow
    }}>
      <h1 className='title-challenge'>{post.title}</h1>
      <p> {post.description}</p>
  
      <Link to={`/edit/${post.id}`}>
        <button style={{ display: 'block', marginTop: '20px', padding: '10px 20px', backgroundColor: 'blue', color: 'white' }}>
            Edit Post
        </button>
    </Link>

    </div>
  );
  
  
};

export default PostDetails;
