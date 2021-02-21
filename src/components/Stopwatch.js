import React, { useEffect } from "react";
import styled from "styled-components";

import { BsPlayFill, BsStopFill, BsArrowRepeat } from "react-icons/bs";
import { Button, ButtonContainer, AddInput } from "../common/shared";

export default function Stopwatch(props) {
    const {
        isWorking,
        stopwatchname,
        diffTimeString,
        onChangeAddInput,
        onClickPlayOrStop,
        onClickArrowRepeat,
    } = props;

    const force1Ref = React.useRef();
    const force2Ref = React.useRef();
    const firstFocusRef = React.useRef();
    const lastFocusRef = React.useRef();
    const startFocusRef = React.useRef();

    useEffect(() => {
        const handler1 = () => {
            lastFocusRef.current.focus();
        };
        if (force1Ref.current) {
            force1Ref.current.addEventListener("focus", handler1);
        }
        const handler2 = () => {
            firstFocusRef.current.focus();
        };
        if (force2Ref.current) {
            force2Ref.current.addEventListener("focus", handler2);
        }

        const keydownHandlerLast = (e) => {
            if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
                startFocusRef.current.focus();
            }
            if (e.code == "ArrowUp") {
                firstFocusRef.current.focus();
            }
        };

        if (lastFocusRef.current) {
            lastFocusRef.current.addEventListener(
                "keydown",
                keydownHandlerLast
            );
        }

        const keydownHandlerStart = (e) => {
            if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
                lastFocusRef.current.focus();
            }
            if (e.code == "ArrowUp") {
                firstFocusRef.current.focus();
            }
        };
        if (startFocusRef.current) {
            startFocusRef.current.addEventListener(
                "keydown",
                keydownHandlerStart
            );
        }

        const keydownHandlerFirst = (e) => {
            if (e.code == "Enter") {
                e.preventDefault();
                startFocusRef.current.focus();
            }
        };
        if (firstFocusRef.current) {
            firstFocusRef.current.addEventListener(
                "keydown",
                keydownHandlerFirst
            );
        }

        return () => {
            force1Ref.current &&
                force1Ref.current.removeEventListener("focus", handler1);
            force2Ref.current &&
                force2Ref.current.removeEventListener("focus", handler2);
            lastFocusRef.current &&
                lastFocusRef.current.removeEventListener(
                    "keydown",
                    keydownHandlerLast
                );
            startFocusRef.current &&
                startFocusRef.current.removeEventListener(
                    "keydown",
                    keydownHandlerStart
                );
            firstFocusRef.current &&
                firstFocusRef.current.removeEventListener(
                    "keydown",
                    keydownHandlerFirst
                );
        };
    }, [
        force1Ref.current,
        force2Ref.current,
        firstFocusRef.current,
        lastFocusRef.current,
        startFocusRef.current,
    ]);

    return (
        <Container>
            <div ref={force1Ref} tabIndex="1"></div>
            <AddInput
                ref={firstFocusRef}
                tabIndex="2"
                onChange={onChangeAddInput}
                value={stopwatchname}
            />
            <TimeText>{diffTimeString}</TimeText>
            <ButtonContainer isWorking={isWorking}>
                <Button
                    ref={startFocusRef}
                    onClick={onClickPlayOrStop}
                    tabIndex="3"
                >
                    {isWorking ? <BsStopFill /> : <BsPlayFill />}
                </Button>
                <Button
                    ref={lastFocusRef}
                    onClick={onClickArrowRepeat}
                    tabIndex="4"
                >
                    <BsArrowRepeat />
                </Button>
            </ButtonContainer>
            <div ref={force2Ref} tabIndex="5"></div>

            <Working is_on={isWorking} />
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    padding: 20px;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.1);

    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;

    margin-bottom: 15px;

    @media (max-width: 500px) {
        width: 320px;
    }
`;
const Working = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) =>
        props.is_on ? "rgb(255, 69, 58)" : "rgb(142, 142, 147)"};
    transition: all 0.6s;
`;
const TimeText = styled.p`
    font-size: 52px;
    margin: 10px 0px 25px 0px;
    @media (max-width: 500px) {
        font-size: 38px;
    }
`;
