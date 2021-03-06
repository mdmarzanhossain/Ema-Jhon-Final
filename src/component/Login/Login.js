import {UserContext} from "../../App";
import {useHistory, useLocation} from "react-router-dom";
import {useContext, useState} from "react";
import {
    createUserByEmailAndPassword,
    handleFbSignIn,
    handleGoogleSignIn,
    handleSignOut,
    initializeLoginFramework, signInByEmailAndPassword
} from "./loginManager";
import {updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {getAuth} from "firebase/auth";


function Login() {

    const auth = getAuth();
    initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let {from} = location.state || {from: {pathname: "/"}};

    const [newUser, setNewUser] = useState(false);

    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: ''
    });

    const handleSubmit = (e) => {
        console.log("handle submit",user.email, user.password);
        if (newUser && user.email && user.password){
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // ...
                })
                .then(res=>{
                    const newUserInfo = {...user};
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);
                    setLoggedInUser(newUserInfo); //context api use kore userlogin hocche naki loggin e set korchi
                    history.replace(from);
                })
                .catch((error) => {
                    const newUserInfo = {...user};
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }

        if(!newUser && user.email && user.password){
            console.log("not submit");
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                })
                .then(res => {
                    const newUserInfo = {...user};
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    setLoggedInUser(newUserInfo); //context api use kore userlogin hocche naki loggin e set korchi
                    history.replace(from);
                })
                .catch((error) => {
                    const newUserInfo = {...user};
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }
        e.preventDefault(); // puro page load howa bondho korbe
    }

    const updateUserName = (name) => {
        updateProfile(auth.currentUser, {
            displayName: name
        }).then(() => {
            console.log("username updated successfully");
            // ...
        }).catch((error) => {
            console.log(error);
        });
    }

        const handleBlur = (e) => {
            let isFieldValid = 'true';
            if (e.target.name === 'email') {
                isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
            }
            if (e.target.name === 'password') {
                const isPasswordValid = e.target.value.length > 6;
                const isPasswordHasNumber = /\d{1}/.test(e.target.value);
                isFieldValid = isPasswordHasNumber && isPasswordValid;
            }

            if (isFieldValid) {
                const newUserInfo = {...user};
                newUserInfo[e.target.name] = e.target.value;
                setUser(newUserInfo);
                //console.log(user);
            }
        }

        const googleSignIn = () => {
            handleGoogleSignIn()
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
        }

        const signOut = () => {
            handleSignOut()
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
        }

        const fbSignIn = () => {
            handleFbSignIn()
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
        }


        //console.log(newUser);
        return (
            <div style={{textAlign: "center"}}>

                {
                    user?.isSignedIn ? <button onClick={signOut}>Sign Out</button>
                        :
                        <button onClick={googleSignIn}>Sign In using Google</button>
                }
                <br/>
                <button onClick={fbSignIn}>Sign in using facebook</button>
                {
                    user?.isSignedIn && <div>
                        <p>Welcome, {user.name}</p>
                        <p>Your Email: {user.email}</p>
                        <p>Password: {user.password}</p>
                        <img src={user.photo} alt=""/>
                    </div>
                }
                <h1>Our own Authentication</h1>

                <input type="checkbox" onChange={() => {
                    setNewUser(!newUser);
                    user.success = false
                }} name="newUser" id=""/>
                <label htmlFor="newUser">New User Sign up</label>

                <form onSubmit={handleSubmit} action="">
                    {newUser && <input placeholder="Name" name="name" onBlur={handleBlur} type="text" required/>}
                    <br/>
                    <input placeholder="Email" name="email" onBlur={handleBlur} type="text" required/>
                    <br/>
                    <input placeholder="Password" name="password" onBlur={handleBlur} type="password" required/>
                    <br/>
                    <input type="submit" value={newUser ? 'Sign Up' : 'Log In'}/>
                </form>
                <p style={{color: "red"}}>{user?.error}</p>
                {user?.success && <p style={{color: "green"}}>User {newUser ? 'created' : 'logged in'} successfully</p>}
            </div>
        );
    }
    export default Login;
