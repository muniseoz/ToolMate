// CreatePost.js
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CreatePost.css';

export default function CreatePost({ courseId, onPostCreated }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, `courses/${courseId}/softwareTools`), {
                name,
                desc,
                link,
                upvotes: 0,
            });
            onPostCreated(); // Callback to refresh the tools list
            setName('');
            setDesc('');
            setLink('');
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    return (
        <div className='form-container'>
        <form onSubmit={handleSubmit}>
            <input
                className='name'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tool Name"
                required
            />
            <input
                className='desc'
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                className='link'
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link"
                required
            />
            <button type="submit" className='submit-button'>Create Post</button>
        </form>
        </div>
    );
}
