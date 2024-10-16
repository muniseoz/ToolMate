import { useEffect, useState } from "react"
import { db } from '../config/firebase';
import Ranking from "./Ranking"

import { collection, doc, getDocs } from "firebase/firestore";

export default function Comment (props) {
    // NOTE: Currently, it is set to recursively find all replies including replies of replies,
    // as replies are displayed as Comment components. If we desire to remove this functionality for simplicity we can do that later.

    const {id, comment, upvotes, onUpdateUpvotes, path} = props
    const [replies, setReplies] = useState([])

    // Gets the replies from the comment's subcollection in Firebase
    // Sets replies to an array of objects with the fields as the keys
    const getReplies = async () => {
        try {
            const repliesRef = await getDocs(collection(db, path, "replies"));
            
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
    // Update upvotes for a specific  tool
    const updateUpvotes = (id, change) => {
        setReplies((prevReplies) =>
            prevReplies.map((reply) =>
                reply.id === id
                    ? { ...reply, upvotes: reply.upvotes + change }
                    : reply
            )
        );
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
        <div>
            <p>{comment}</p>
            <p>Upvotes: {upvotes}</p>
            <Ranking id={id} name={comment} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
            {replies.length !== 0 && 
            <>
                <p>Replies:</p>
                <div style={{marginLeft: "25px"}}>
                    {commentComponentArray}
                </div>
            </>
            }
        </div>
        </li>
    )
}