import { useEffect, useState } from "react"
import { db } from '../config/firebase';
import Markdown from "react-markdown";
import Ranking from "./Ranking"
import './Comment.css';

import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, serverTimestamp } from "firebase/firestore";

export default function Comment (props) {
    // NOTE: Currently, it is set to recursively find all replies including replies of replies,
    // as replies are displayed as Comment components. If we desire to remove this functionality for simplicity we can do that later.

    const {id, comment, upvotes, onUpdateUpvotes, path} = props
    const [replies, setReplies] = useState([])
    const [showReplies, setShowReplies] = useState(false)
    const [newComment, setNewComment] = useState("");
    const [showCreateReply, setShowCreateReply] = useState(false)


    // Gets the replies from the comment's subcollection in Firebase
    // Sets replies to an array of objects with the fields as the keys
    const getReplies = async () => {
        try {
            const repliesRef = await getDocs(query(collection(db, path, "replies"), orderBy("upvotes", "desc")));
            
            const filteredReplies = repliesRef.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                path: doc.ref.path
            }));

            setReplies(filteredReplies);
    
        } catch (err) {
            console.error(err);
        }
    }

    // Runs every time page is reloaded, updates comments
    useEffect(() => {
        getReplies()
    }, [])
    
    // Update upvotes for a reply
    const updateUpvotes = async (path, change) => {
        // Get document to update using path (easiest way)
        const replyRef = doc(db, path);
        const replyUpvotes = (await getDoc(replyRef)).data().upvotes;

        await updateDoc(replyRef, {upvotes: replyUpvotes+change});

        // Refresh page with the change
        getReplies();
    };

    // Add a new reply to Firestore
    const addReply = async () => {
        if (!newComment.trim()) return; // Avoid adding empty comments

        try {
            const commentsRef = collection(db, path, "replies");
            await addDoc(commentsRef, {
                reply: newComment.trim(),
                upvotes: 0, // Default upvotes for a new comment
                timestamp: serverTimestamp(), // For ordering comments by time
            });
            setNewComment(""); // Clear the input field
            setShowCreateReply(false); // hide the input for replies
            getReplies(); // Refresh the comments list
        } catch (err) {
            console.error("Error adding reply:", err);
        }
    };
    
    const commentComponentArray = replies.map((reply) => (
        <Comment 
            key={reply.id} 
            comment={reply.reply} 
            id={reply.id} 
            upvotes={reply.upvotes} 
            onUpdateUpvotes={updateUpvotes} 
            path={reply.path}
        />

    ))
    return (
        <li>
        <div className="comment-container">
            <Markdown className="comment">{comment}</Markdown>
            <p>Upvotes: {upvotes}</p>
            <div className="comment-buttons">
                <Ranking id={id} path={path} name={comment} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
                <button  href="" onClick={(e) => {e.preventDefault(); setShowCreateReply((prev) => !prev)}} className="reply-button">Create Reply</button>
            </div>
            
            { showCreateReply &&
            <div className="create-reply">
                <Markdown className='tip'>*Replies can be formatted using [Markdown](https://www.markdownguide.org/cheat-sheet/)! Feel free to add links and images if helpful.*</Markdown>
                <textarea
                    placeholder="Write a reply..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="comment-textarea"
                />
                <button onClick={addReply}>Submit</button>
            </div>
            }
            {replies.length !== 0 && 
            <>
                <p><a className="replies" href="" onClick={(e) => {e.preventDefault(); setShowReplies((prev) => !prev)}}>Replies{showReplies ? ':' : ` (${replies.length})`}</a></p>
                {showReplies &&
                <div style={{marginLeft: "25px"}}>
                    {commentComponentArray}
                </div>
                }
            </>
            }
        </div>
        </li>
    )
}