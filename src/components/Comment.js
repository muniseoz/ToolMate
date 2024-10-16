import { useEffect, useState } from "react"
import Ranking from "./Ranking"

export default function Comment (props) {
    const {id, comment, upvotes, onUpdateUpvotes} = props


    const [replies, setReplies] = useState([])

    // NOTE technically, the functionality to have replies that have replies that have replies is technically possible, as replies are just Comments
    // function to get the comments given the id of the software tool
    // in firebase langauge: 
    //      get comment document using id
    //      get the documents inside the replies subcollection of found document IN RATING ORDER
    const getReplies = async (id) => {
        
        let repliesArray = []
        if (id === "commentID2") {
            repliesArray = [
                {
                    id: "reply1",
                    reply: "Reply number 1",
                    upvotes: 2,
                },
    
                {
                    id: "reply2",
                    reply: "Reply number 2",
                    upvotes: 0,
                }
            ]
        }
        setReplies(repliesArray)
    }

    // Runs every time page is reloaded, updates comments
    useEffect(() => {
        getReplies(id)
    }, [])
    // Update upvotes for a specific software tool
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