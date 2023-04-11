import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import "./styles.css";
import ProfileCard from '../../components/profile_card'

function Comment(props)
{
    const[childProps, setChildProps] = useState({"created_at": null, "id": null, "user_id": null, "message": null});
    const[commentable, setCommentable] = useState(false);   
    const[comment, setComment] = useState("");

    function getChildProps(){
        const query = new URLSearchParams();
        query.append("parent_id", props.id);
        query.append("page", 1);
        fetch(`http://localhost:8000/comments/property_reviews?${query}`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            let comment_data = data.reviews[0];
            setChildProps({"created_at": comment_data.created_at, "id": comment_data.id, "user_id": comment_data.user_id, "message": comment_data.message});
        })
        .catch(error => {
            console.log("error");
        }
        )
        
    }

    function check_or_create_comment(precheck, message){
        const data = new FormData();
        data.append("parent_id", props.id);
        data.append("message", message);
        if(precheck){
            data.append("precheck", precheck);
        }

        fetch(`http://localhost:8000/comments/property_reviews/`,
        { method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data
        })
        .then(response => {
            if (response.ok) {
                if (precheck){
                    setCommentable(true);
                }
                else {
                    getChildProps();
                }
            }
            else {
                throw new Error('Something went wrong');
            }
        })
        .catch(error => {
            if (precheck){
                setCommentable(false);
            }            
        }
        )

    }

    useEffect(() => {
        getChildProps();
        check_or_create_comment(true, "");
    }
    , [props]);

    let childComment;
    if (childProps.id !== null) {
        childComment = <Comment id={childProps.id} user_id={childProps.user_id} created_at={childProps.created_at} message={childProps.message}/>
    }

    let replyPrompt;
    if (commentable) {
        replyPrompt = 
        <details>  
            <summary className="packed-text reply-button">Reply</summary>
            
            <div className="two-col justifyLeft">
            <input className="reply-input marginTop10" type="text" wrap="soft" placeholder="Add a reply..." onChange={(e) => setComment(e.target.value)} value={comment}/>
            <button className="small gold-button" id="replyButton" onClick={() => {check_or_create_comment(false, comment); setCommentable(false)}}>Reply</button>
            </div>
        </details>
       
    }

    return(
        <>
        <ProfileCard user_id={props.user_id} create_time={props.created_at}/>
        <p className="medium packed-text">{props.message}</p>
        {replyPrompt}
        <div className='margin20Left'>
            {childComment}
        </div>
        </>
    );    

}

export default Comment;