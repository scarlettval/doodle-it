import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditPost.css';
import { supabase } from '../client';

const EditPost = () => {
    const { id } = useParams();

    const [post, setPost] = useState({
            title: "", description: "" //, upVote: ""
        });
    

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('Posts')
                .select()
                .eq('id', id)
                .single();

            if (data) setPost(data);
        };

        fetchPost();
    }, [id]);

    const updatePost = async (event) => {
        event.preventDefault();

        await supabase
            .from('Posts')
            .update({
                title: post.title,
                description: post.description,
            })
            .eq('id', id);

        window.location = "/";
    };

    const deletePost = async (event) => {
        event.preventDefault();

        await supabase
            .from('Posts')
            .delete()
            .eq('id', id);

        window.location = "/";
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
                <label>Title</label><br />
                <input type="text" name="title" value={post.title} onChange={handleChange} /><br /><br />

                <label>Prompt</label><br />
                <textarea name="description" value={post.description} onChange={handleChange} rows="5" cols="50" />


                <input type="submit" value="Update" onClick={updatePost} />
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
    );
};

export default EditPost;


