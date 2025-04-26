import React, { useState } from 'react';
import './CreatePost.css';
import { supabase } from '../client';
import SelectInput from '../components/SelectInput';

const CreatePost = () => {

    // Add form inputs
    const [post, setPost] = useState({
        title: "", description: "", upVote: ""
    });

    // making createPost() an asynchronous function
    const createPost = async (event) => {
        event.preventDefault();

        const { data, error } = await supabase
            .from('Post')
            .insert({
                title: post.titel,
                description: post.description,
                upVote: post.upVote
            })
            .select(); 

        if (error) {
            console.error('Error inserting post:', error);
        } else {
            console.log('Post created:', data);
            window.location = "/";
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
                <label>Name</label><br />
                <input type="text" name="name" onChange={handleChange} /><br /><br />

                <SelectInput
                    label="Choose your animal"
                    name="animal"
                    value={post.animal}  // Change formData.animal to post.animal
                    options={[
                        { value: '', label: '--Select an animal--' },
                        { value: 'dog', label: 'Dog' },
                        { value: 'cat', label: 'Cat' },
                        { value: 'horse', label: 'Horse' },
                        { value: 'monkey', label: 'Monkey' },
                        { value: 'duck', label: 'Duck' },
                        { value: 'rabbit', label: 'Rabbit' },
                    ]}
                    onChange={handleChange}
                />

                <SelectInput
                    label="Choose your favorite gag"
                    name="favorite_gag"
                    value={post.favorite_gag}  // Change formData.favorite_gag to post.favorite_gag
                    options={[
                        { value: '', label: '--Select a gag--' },
                        { value: 'throw', label: 'Throw' },
                        { value: 'squirt', label: 'Squirt' },
                        { value: 'lure', label: 'Lure' },
                        { value: 'trap', label: 'Trap' },
                        { value: 'toon-up', label: 'Toon-Up' },
                        { value: 'drop', label: 'Drop' },
                    ]}
                    onChange={handleChange}
                />

                <label>Laff</label><br />
                <input type="number" name="laff" onChange={handleChange} /><br /><br />

                <label>Doodle</label><br />
                <input type="text" name="doodle" onChange={handleChange} /><br /><br />

                <br />
                <input type="submit" value="Submit" onClick={createPost} />
            </form>
        </div>
    );
};

export default CreatePost;
