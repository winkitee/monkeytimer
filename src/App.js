import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import { IconContext } from "react-icons";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import firebase from "firebase/app";
import "firebase/auth";

// import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";

function App() {
    const [user, setUser] = useState(null);
    const signupWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        try {
            firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    };

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                console.log(user);
            } else {
                setUser(user);
            }
        });
    }, []);

    return (
        <div className="App">
            <div className="App-Container">
                <Header>monkeytimer</Header>

                <Stopwatch />

                <NavMenu>
                    <IconContext.Provider
                        value={{ color: "rgb(144, 144, 147)" }}
                    >
                        {user == null ? (
                            <NavLinkContainer onClick={signupWithGoogle}>
                                <AiFillGoogleCircle />
                            </NavLinkContainer>
                        ) : (
                            <NavLinkContainer onClick={signOut}>
                                <FaUserCircle />
                                <span>{user.displayName}</span>
                            </NavLinkContainer>
                        )}
                    </IconContext.Provider>
                </NavMenu>
            </div>
        </div>
    );
}

const Header = styled.div`
    color: rgb(255, 214, 10);
    font-size: 38px;
    font-weight: 900;

    position: fixed;
    top: 38px;
    left: 48px;

    @media (max-width: 500px) {
        font-size: 18px;
        top: 20px;
        left: 20px;
    }
`;

export const NavLinkContainer = styled.div`
    display: flex;
    cursor: pointer;
    opacity: 0.4;
    align-items: center;
    justify-content: center;

    transition: all 0.3s;

    span {
        margin-left: 10px;
        font-size: 16px;
    }

    :hover {
        opacity: 1;
    }
`;

const NavMenu = styled.nav`
    position: fixed;
    bottom: 48px;
    right: 50px;
`;

export default App;
