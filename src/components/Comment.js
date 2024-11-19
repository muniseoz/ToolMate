import { useEffect, useState } from "react"
import { db } from '../config/firebase';
import Markdown from "react-markdown";
import Ranking from "./Ranking"
import './Comment.css';

import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";

export default function Comment (props) {
    // NOTE: Currently, it is set to recursively find all replies including replies of replies,
    // as replies are displayed as Comment components. If we desire to remove this functionality for simplicity we can do that later.

    const {id, comment, upvotes, onUpdateUpvotes, path} = props
    const [replies, setReplies] = useState([])
    const [showReplies, setShowReplies] = useState(false)

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
            <Ranking id={id} path={path} name={comment} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
            {replies.length !== 0 && 
            <>
                <p><a className="replies" href="" onClick={(e) => {e.preventDefault(); setShowReplies((prev) => !prev)}}>Replies{showReplies ? ':' : '(V)'}</a></p>
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