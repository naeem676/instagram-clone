
import { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  useEffect(()=>{
    const unSubscribe = auth
    .onAuthStateChanged((authUser )=> {
      if(authUser){
       
        setUser(authUser)
        
      } else{
        setUser(null)
      }
    })
    return ()=> {
      unSubscribe();
    }
    
  },[user, username])

  useEffect(()=>{
      db
      .collection('posts')
      .orderBy("timestamp", 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post:doc.data()
        })))
      })
  },[posts]);
  const signUp =(e) =>{
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(error => alert(error.message));
    setOpen(false);
  }

  const signIn = e =>{
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="app">
          

           <Modal
              
              open={open}
              onClose={()=>setOpen(false)}
            >
              <div style={modalStyle} className={classes.paper}>
              <form className="app_header_form">
             <center>
             <img className="app_header_image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png" alt="" srcset="" />
             </center>
              
             <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            />
            <Input
            type="text"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
            <Input
            type="text"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signUp}>Sign Up</Button>
               
           
          
              </form>
            </div>
            
            
            </Modal>
            <Modal
              
              open={openSignIn}
              onClose={()=>setOpenSignIn(false)}
              
            >
              <div style={modalStyle} className={classes.paper}>
              <form className="app_header_form">
             <center>
             <img className="app_header_image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png" alt="" srcset="" />
             </center>
              
            <Input
            type="text"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
            <Input
            type="text"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signIn}>Sign in</Button>
               
           
          
              </form>
            </div>
            
            
            </Modal>
           
      
      <div className="app_header">
        <img className="app_header_image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png" alt="" srcset="" />
        {user ? <Button onClick={()=> auth.signOut()}>LogOut</Button> :
            <div className="app_loginContainer">
              <Button onClick={()=> setOpenSignIn(true)}>sign In</Button>
              <Button onClick={()=> setOpen(true)}>sign Up</Button>
            </div>
            }
      </div>
     
     
      <div className="app_post">
      {
        posts.map(({id,post}) => <Post key={id} user={user} postId={id} username={post.username} timestamp={post.timestamp} caption={post.caption} imageURL={post.imagesURL} />)
      }
      </div>
      <InstagramEmbed
        url='https://www.instagram.com/naeemuddin939/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />

{user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>Sorry, you need to login to upload</h3>}
      
      
    </div>
  );
}

export default App;
