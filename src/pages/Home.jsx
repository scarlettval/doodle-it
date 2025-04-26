import React, { useState, useEffect } from 'react';
import { supabase } from '../client';  // Ensure this path is correct
import Card from '../components/Card';  // Assuming you have a Card component
import './Home.css'; // Adjust the path as needed


const Home = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select()
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Ensure data is not null or undefined before setting the state
                setPosts(data || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [props]);

    return (
        <div className="Home" style={{ padding: '20px' }}>
            {posts && posts.length > 0 ? (
                posts.map((post) => (
                    <Card
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        created_at={post.created_at}
                    />
                ))
            ) : (
                <h2>{'No Challenges Yet 😞'}</h2>
            )}
        </div>
    );
};

export default Home;
