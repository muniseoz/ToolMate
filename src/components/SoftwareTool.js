import { useState, useEffect } from "react";
import Markdown from 'react-markdown'

import Comment from "./Comment";
import Ranking from "./Ranking";

import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, addDoc, serverTimestamp} from "firebase/firestore";


export default function SoftwareTool (props) {
    const {id, name, upvotes, desc, onUpdateUpvotes, path} = props;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Gets the commments from the softwareTool's subcollection in Firebase
    // Sets comments to an array of objects with the fields as the keys
    const getComments = async () => {
        try {
            // Using the path prop, gets the comment documents from the comments subcollection of the softwareTool
            const commentsRef = await getDocs(query(collection(db, path, "comments"), orderBy("upvotes", "desc")));
            
            const filteredComments = commentsRef.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                path: doc.ref.path
            }));

            setComments(filteredComments);
    
        } catch (err) {
            console.error(err);
        }

    }
    // Add a new comment to Firestore
    const addComment = async () => {
        if (!newComment.trim()) return; // Avoid adding empty comments

        try {
            const commentsRef = collection(db, path, "comments");
            await addDoc(commentsRef, {
                comment: newComment.trim(),
                upvotes: 0, // Default upvotes for a new comment
                timestamp: serverTimestamp(), // For ordering comments by time
            });
            setNewComment(""); // Clear the input field
            getComments(); // Refresh the comments list
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    // Runs every time page is reloaded, updates comments
    useEffect(() => {
        getComments();
    }, [])

    // Updates upvotes for Comments
    const updateUpvotes = async (path, change) => {
        // Get document to update using path (easiest way)
        const commentRef = doc(db, path);
        const commentUpvotes = (await getDoc(commentRef)).data().upvotes;
        // updateDoc(doc, {upvotes: })
        await updateDoc(commentRef, {upvotes: commentUpvotes+change});

        // Refresh page with the change
        getComments();
    };

    const commentComponentArray = comments.map((comment) => (
        <Comment key={comment.id} comment={comment.comment} id={comment.id} upvotes={comment.upvotes} onUpdateUpvotes={updateUpvotes} path={comment.path}/>
    ));

    return (
        <div>
            <h3>{name}</h3>
            <Markdown className='software-tool-desc'>{desc}</Markdown>
            <p>Upvotes: {upvotes}</p>

            <Ranking id={id} path={path} name={name} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
            <div>
            <Markdown className='tip'>*Comments are formatted using [Markdown](https://www.markdownguide.org/cheat-sheet/)! Feel free to add links and images if helpful.*</Markdown>
                <div style={{marginTop: '15px'}} className="create-comment">
                    <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="comment-textarea"
                    />
                    <button onClick={addComment}>Submit</button>
                </div>
                <h4>Comments:</h4>
                <ul className="comment-list">{commentComponentArray}</ul>
            </div>
        </div>
    )
}