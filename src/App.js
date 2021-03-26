import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import firebase from "firebase/app";
import "firebase/auth";

import Main from "./components/Main";
import CalendarGraph from './components/CalendarGraph'
import Loading from "./common/Loading";
import Header from './common/Header'
import { setStopwatchDataToLocalStorage } from "./common/api";
import { colors } from "./styles/config";

function App() {
    const [user, setUser] = useState(null);
    const [is_loading, set_is_loading] = useState(true);

    const signupWithGoogle = async () => {
        set_is_loading(true);
        const provider = new firebase.auth.GoogleAuthProvider();

        try {
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        } finally {
            set_is_loading(false);
        }
    };

    const signOut = async () => {
        set_is_loading(true);
        try {
            await firebase.auth().signOut();
            localStorage.clear();
        } catch (error) {
            console.log(error);
        } finally {
            set_is_loading(false);
        }
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            set_is_loading(true);
            try {
                if (user) {
                    await setStopwatchDataToLocalStorage();
                    setUser(user);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.log(e);
            } finally {
                set_is_loading(false);
            }
        });
    }, []);

    return (
        <Container>
            <AppContiner>
                <Header />

                {is_loading ? (
                    <Loading />
                ) : (
                    <>
                        <Main user={Boolean(user)} />
                        <NavMenu>
                            <IconContext.Provider
                                value={{ color: "rgb(144, 144, 147)" }}
                            >
                                {user == null ? (
                                    <NavLinkContainer
                                        onClick={signupWithGoogle}
                                    >
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
                    </>
                )}
            </AppContiner>
            <GraphContainer>
                <CalendarGraph />
            </GraphContainer>
        </Container>
    );
}

const Container = styled.div`
    text-align: center;
`;

const AppContiner = styled.div`
    background-color: ${colors.BACKGROUND_COLOR};
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
    overflow: hidden;
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

const GraphContainer = styled.div`
    position: fixed;
    width: 100%;
    bottom: 100px;

    display: flex;
    justify-content: center;
`

export default App;
