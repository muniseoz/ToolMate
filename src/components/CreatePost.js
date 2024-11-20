// CreatePost.js
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CreatePost.css';
import Markdown from 'react-markdown';

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
            <Markdown>Descriptions can be formatted using [Markdown](https://www.markdownguide.org/cheat-sheet/)! Feel free to add links and images if helpful.</Markdown>
            <textarea
                className='desc'
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                rows={3}
                required
            />
            <button type="submit" className='submit-button'>Create Post</button>
        </form>
        </div>
    );
}
