import React, { useState } from 'react';
import './CreatePost.css';
import { supabase } from '../client';
// import SelectInput from '../components/SelectInput';

const CreatePost = () => {
    // Add form inputs
    const [post, setPost] = useState({
        title: "", description: "" //, upVote: ""
    });

    // making createPost() an asynchronous function
    const createPost = async (event) => {
        event.preventDefault();

        const { data, error } = await supabase
            .from('Post')
            .insert({
                title: post.title,
                description: post.description,
                // upVote: post.upVote
            })
            .select(); 

        if (error) {
            console.error('Error inserting post:', error);
        } else {
            console.log('Post created:', data);
            window.location = "/";  // Redirect back to the home page
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <form>
                <label className="label">Title</label><br />
                <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    className="input-field"
                /><br /><br />

                <label className="label">Prompt</label><br />
                <textarea
                    rows="5"
                    cols="50"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    className="input-field"
                ></textarea>

                <br />
                <input
                    type="submit"
                    value="Submit"
                    onClick={createPost}
                    className="submit-btn"
                />
            </form>
        </div>
    );
};

export default CreatePost;
