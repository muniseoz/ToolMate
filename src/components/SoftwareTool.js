import { useState, useEffect } from "react";

import Comment from "./Comment";
import Ranking from "./Ranking";

import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";


export default function SoftwareTool (props) {
    const {id, name, upvotes, desc, onUpdateUpvotes, path} = props;
    const [comments, setComments] = useState([]);

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

    console.log(desc);
    return (
        <div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <p>Upvotes: {upvotes}</p>

            <Ranking id={id} path={path} name={name} upvotes={upvotes} onUpdateUpvotes={onUpdateUpvotes} />
            <div>
                <h4>Comments:</h4>
                <ul>{commentComponentArray}</ul>
                
            </div>
        </div>
    )
}