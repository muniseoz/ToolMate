import { useState, useEffect } from "react";

import Comment from "./Comment";
import Ranking from "./Ranking";

import { db } from '../config/firebase';
import { collection, doc, getDocs } from "firebase/firestore";


export default function SoftwareTool (props) {
    const {id, name, upvotes, desc, onUpdateUpvotes, path} = props;
    const [comments, setComments] = useState([]);

    // Gets the commments from the softwareTool's subcollection in Firebase
    // Sets comments to an array of objects with the fields as the keys
    const getComments = async () => {
        try {
            // Using the path prop, gets the comment documents from the comments subcollection of the softwareTool
            const commentsRef = await getDocs(collection(db, path, "comments"));
            
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

    // Runs every time page is reloaded, updates comments
    useEffect(() => {
        getComments();
    }, [])

    const updateUpvotes = (id, change) => {
        setComments((prevComment) =>
            prevComment.map((comment) =>
                comment.id === id
                    ? { ...comment, upvotes: comment.upvotes + change }
                    : comment
            )
        );
    };

    const commentComponentArray = comments.map((comment) => (
        <Comment key={comment.id} comment={comment.comment} id={comment.id} upvotes={comment.upvotes} onUpdateUpvotes={updateUpvotes} path={comment.path}/>
    ));

    return (
        <div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <p>Upvotes: {upvotes}</p>

            <Ranking id={id} name={name} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
            <div>
                <h4>Comments:</h4>
                <ul>{commentComponentArray}</ul>
                
            </div>
        </div>
    )
}