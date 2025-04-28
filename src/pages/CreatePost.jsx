import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router for navigation
import './CreatePost.css';
import { supabase } from '../client'; // Assuming supabase is already set up

const CreatePost = ({ title }) => {  // Accept title prop
    // State to manage form inputs
    const [post, setPost] = useState({
        title: "", description: "", upvotes: 0
    });

    // Use the useNavigate hook for redirecting after successful post creation
    const navigate = useNavigate();

    // Function to handle form submission
    const createPost = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Insert the new post into Supabase
        const { data, error } = await supabase
            .from('Posts')  // Ensure your table name is correct (use 'Post' or 'Posts' based on your schema)
            .insert({
                title: post.title,
                description: post.description,
                type: 'challenge', // to differentiate from regular forum post
            })
            .select(); 

        if (error) {
            console.error('Error inserting post:', error);
        } else {
            console.log('Post created:', data);
            navigate('/');  // Redirect to the homepage after successful post creation
        }
    };

    // Handle changes in the form fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div style={{
            transform: 'translateX(650px) translateY(120px)',  // Use transform for translation
            textAlign: 'center',
            backgroundColor: '#e7e5e5', // Use camelCase for background-color
            borderRadius: '12px', // Use camelCase for border-radius
            padding: '60px', // Single padding definition
            marginTop: '30px',
            width: '90%',
            maxWidth: '1200px',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)', // Use camelCase for box-shadow
        }}>
            {/* Display the dynamic title */}
            <h2>{title}</h2>  {/* Display title dynamically */}

            <form onSubmit={createPost}>
                <label className="label">Title</label><br />
                <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    className="input-field"
                    required  // Optional: Makes the title field required
                /><br /><br />

                <label className="label">Prompt</label><br />
                <textarea
                    rows="5"
                    cols="50"
                    name="description"
                    value={post.description}
                    onChange={handleChange}
                    className="input-field"
                    required  // Optional: Makes the description field required
                ></textarea>

                <br />
                <input
                    type="submit"
                    value="Submit"
                    className="submit-btn"
                    style={{ fontFamily: 'Finger Paint, sans-serif' }}
                />
            </form>
        </div>
    );
};

export default CreatePost;
