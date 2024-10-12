import { useState, useEffect } from "react"

import Comment from "./Comment"

export default function SoftwareTool (props) {
    const {id, name, upvotes, desc} = props
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

    const commentComponentArray = comments.map((comment) => (
        <Comment key={comment.id} comment={comment.comment} id={comment.id} upvotes={comment.upvotes} />
    ))

    return (
        <div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <p>Upvotes: {upvotes}</p>
            <div>
                <h4>Comments:</h4>
                <ul>{commentComponentArray}</ul>
                
            </div>
        </div>
    )
}