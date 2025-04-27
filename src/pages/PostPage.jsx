// Used tp show either PostDetailsDrawing or PostDetailsForum based on the post's type
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client';
import PostDetailsDrawing from './PostDetailsDrawing';
import PostDetailsForum from './PostDetailsForum';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!post) return <h2>Post not found!</h2>;

  if (post.type === 'challenge') {
    return <PostDetailsDrawing post={post} />;
  } else if (post.type === 'forum') {
    return <PostDetailsForum post={post} />;
  } else {
    return <h2>Unknown post type.</h2>;
  }
};

export default PostPage;
