import { useState, useEffect } from "react"

import Comment from "./Comment"
import Ranking from "./Ranking"


export default function SoftwareTool (props) {
    const {id, name, upvotes, desc, onUpdateUpvotes} = props
    const [comments, setComments] = useState([])


    // function to get the comments given the id of the software tool
    // in firebase langauge: 
    //      get software tool document using id
    //      get the documents inside the comments  subcollection of found document IN RATING ORDER
    const getComments = async (id) => {
        
        let commentsArray = []
        if (id === "exampleID") {
            commentsArray = [
                {
                    id: "commentID",
                    comment: "This is an example comment",
                    upvotes: 6,
                },
    
                {
                    id: "commentID2",
                    comment: "This is another example comment",
                    upvotes: 2,
                }
            ]
        }
        setComments(commentsArray)
    }

    // Runs every time page is reloaded, updates comments
    useEffect(() => {
        getComments(id)
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
        <Comment key={comment.id} comment={comment.comment} id={comment.id} upvotes={comment.upvotes} onUpdateUpvotes={updateUpvotes}/>
    ))

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