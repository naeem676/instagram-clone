import React from 'react';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';


const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange= e =>{
        if(e.target.files[0]){
            setFile(e.target.files[0]);
        }
    }
    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on("state_change", (snapshot)=>{
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress)
        },
        (error) => {
            console.log(error)
            alert(error.message)
        },
        ()=> {
            storage
            .ref("images")
            .child(file.name)
            .getDownloadURL()
            .then(url => {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imagesURL : url,
                    username:username
                });
                setProgress(0);
                setCaption('');
                setFile(null);
            })
        }
        )

    }
    return (
        <div className="image_upload">
            <progress className="progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption..." value={caption} onChange={e => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>upload</Button>
            
        </div>
    );
};

export default ImageUpload;