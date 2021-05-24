import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './Post.css';
import { db } from './firebase';
import { useState } from 'react';
import  firebase  from 'firebase';

const Post = ({username, caption, imageURL, timestamp, postId, user}) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(()=>{
        let unSubscribe;
        if(postId){
            unSubscribe = db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", 'desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }
        return ()=> {
            unSubscribe();
        }
    },[postId])
    
    const postComment = (event) =>{
        event.preventDefault();
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');

    }
    
    return (
        <div className="post">
            <div className="post_header">
            <Avatar className="post_avatar" src="https://cdn0.iconfinder.com/data/icons/professional-avatar-5/48/3d_modeling_male_avatar_men_character_professions-512.png" alt="Naeem"/>
            <h1>{username}</h1>
            </div>
            <h4 className="post_text">caption <br /> <strong>{username} </strong>:{caption}  </h4>
            
            <img className="post_image" src={imageURL} alt="" />
            
            <div className="post_comments">
                <p>comments</p>
                {
                    comments.map(comment => 
                        <p>
                            <b>{comment.username} : </b>
                            {comment.text}
                        </p>
                    )
                }
            </div>
           {user && (
                <form className="post_commentBox">
                <input 
                className="post_input"
                 type="text"
                 placeholder="Add a comments..."
                 value={comment}
                 onChange={e=> setComment(e.target.value)}
                  />
                  <button
                  className="post_btn"
                  disabled={!comment}
                  type="submit"
                  onClick={postComment}
                  >comment</button>
            </form>
           )}
        </div>
        
    );
};

export default Post;