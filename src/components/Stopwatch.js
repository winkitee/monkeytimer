import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import {
    BsPlayFill,
    BsStopFill,
    // BsPauseFill,
    BsArrowRepeat,
    BsArrowClockwise,
    BsTrashFill,
    BsArrowLeft,
} from "react-icons/bs";

import Timer from "./Timer";

const zeroCreator = (v) => (v < 10 ? `0${v}` : v);
export const getDiffTimeString = (diffTime = 0, is_ms, is_string) => {
    let ms;
    if (is_ms) {
        ms = parseInt(
            diffTime < 10 ? diffTime : diffTime.toString().slice(-3, -1)
        );
        ms = zeroCreator(ms);
    }
    let s = parseInt(diffTime / 1000);
    let m = parseInt(s / 60);
    s = parseInt(s % 60);
    if (!is_string) s = zeroCreator(s);
    let h = parseInt(m / 60);
    if (!is_string) h = zeroCreator(h);
    m = parseInt(m % 60);
    if (!is_string) m = zeroCreator(m);

    if (is_string) {
        return `${h}h ${m}m ${s}s`;
    }

    if (is_ms) {
        return `${h}:${m}:${s}:${ms}`;
    }
    return `${h}:${m}:${s}`;
};

const getTimelogString = (st, et) => {
    const date = moment(st).format("YYYY-MM-DD");
    const startAt = moment(st).format("HH:mm:ss");
    const endAt = moment(et).format("HH:mm:ss");
    const time = getDiffTimeString(et - st);
    return `${date} ${startAt} - ${endAt} | ${time}`;
};

export default function Stopwatch({ name = "Base" }) {
    const [is_ms, set_is_ms] = useState(true);
    const [stopwatchname, setStopwatchname] = useState(name);
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [timelog, setTimelog] = useState([]);
    const [isSummary, setIsSummary] = useState(false);
    const [keysLocal, setKeysLocal] = useState(
        JSON.parse(localStorage.getItem("key")) || []
    );
    const [is_timer, set_is_timer] = useState(true);
    const timer = React.useRef();
    const force1Ref = React.useRef();
    const force2Ref = React.useRef();
    const firstFocusRef = React.useRef();
    const lastFocusRef = React.useRef();
    const startFocusRef = React.useRef();

    const save = useCallback(() => {
        timelog.push({
            id: startTime + endTime,
            startTime,
            endTime,
            diffTime: endTime - startTime,
        });

        const keyJSON = localStorage.getItem("key");
        if (keyJSON) {
            const keys = JSON.parse(keyJSON);
            if (!keys[stopwatchname]) {
                keys[stopwatchname] = 1;
                localStorage.setItem("key", JSON.stringify(keys));
                setKeysLocal(keys);
            }
        } else {
            const keys = { [stopwatchname]: 1 };
            localStorage.setItem("key", JSON.stringify(keys));
            setKeysLocal(keys);
        }

        localStorage.setItem(stopwatchname, JSON.stringify(timelog));
        setTimelog(timelog);
        setIsSummary(true);
    }, [stopwatchname, startTime, endTime]);

    const startOrStop = useCallback(() => {
        if (!isWorking) {
            // start
            setStartTime(new Date().getTime());
            setEndTime(new Date().getTime());

            const fpsInterval = 1000 / 60;
            let than = Date.now();

            function animate() {
                timer.current = requestAnimationFrame(animate);

                const now = Date.now();
                const elapsed = now - than;

                if (elapsed > fpsInterval) {
                    than = now - (elapsed % fpsInterval);

                    setEndTime(new Date().getTime());
                }
            }
            animate();
            setIsWorking(true);
        } else {
            // stop
            cancelAnimationFrame(timer.current);
            setEndTime(new Date().getTime());
            setIsWorking(false);
            save();
        }
    }, [isWorking, is_ms, save]);

    // const pause = useCallback(() => {

    // }, [])

    const reset = useCallback(() => {
        cancelAnimationFrame(timer.current);
        const current = new Date().getTime();
        setStartTime(current);
        setEndTime(current);
        setIsWorking(false);
    });

    const toggleStart = useCallback(() => {
        set_is_ms(!is_ms);
        reset();
    });

    const updateCache = (name) => {
        const item = localStorage.getItem(name);
        if (item) {
            try {
                const timelog = JSON.parse(item);
                setTimelog(timelog);
            } catch (e) {
                localStorage.removeItem(e.target.value);
            }
        } else {
            setTimelog([]);
        }
    };

    const onChangeHandler = useCallback((e) => {
        setStopwatchname(e.target.value);
        updateCache(e.target.value);
    });

    // useEffect(() => {
    //     const handler = (e) => {
    //         console.log(e.code);
    //         if (e.code == "Space") {
    //             startOrStop();
    //         }
    //     };
    //     window.addEventListener("keydown", handler);
    // }, []);
    useEffect(() => {
        updateCache(stopwatchname);
    }, []);

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

    const selectKey = useCallback(
        (key) => {
            try {
                setStopwatchname(key);
                const data = localStorage.getItem(key) || [];
                setTimelog(JSON.parse(data));
            } catch (e) {
                console.log(e);
            } finally {
                reset();
            }
        },
        [reset, save]
    );

    const deleteStopwatch = useCallback(() => {
        const isCheck = window.confirm("Do you really want to delete?");
        if (!isCheck) return;
        localStorage.removeItem(stopwatchname);
        setTimelog([]);
        // if (stopwatchname != "Base") {
        delete keysLocal[stopwatchname];
        localStorage.setItem("key", JSON.stringify(keysLocal));
        setKeysLocal(keysLocal);
        // }
        setStopwatchname("Base");
        setIsSummary(false);
        reset();
    }, [stopwatchname, keysLocal, reset]);

    const getInfo = useCallback(() => {
        let count = timelog.length;
        let total = 0;

        for (const log of timelog) {
            total += log.diffTime;
        }

        let average = parseInt(total / count);

        return {
            count,
            average: getDiffTimeString(average, false, true),
            total: getDiffTimeString(total, false, true),
        };
    }, [timelog]);

    function getLineData() {
        return {
            labels: timelog.map((log) =>
                moment(log.startTime).format("YYYY-MM-DD")
            ),
            datasets: [
                {
                    label: "",
                    data: timelog.map((log) => parseInt(log.diffTime / 1000)),
                    fill: false,
                    backgroundColor: "rgb(255, 214, 10)",
                    borderColor: "rgba(255, 214, 10, 0.4)",
                },
            ],
        };
    }

    const { count, average, total } = getInfo();

    return (
        <>
            {/* start code */}

            <Keys>
                {Object.keys(keysLocal)
                    .sort()
                    .map((key, i) => (
                        <div style={{ display: "block" }} key={key}>
                            <CaptionButton
                                onClick={() => selectKey(key)}
                                is_on={key == stopwatchname}
                            >
                                {key}
                            </CaptionButton>
                            {/* {i + 1 != Object.keys(keysLocal).length && (
                                <span> | </span>
                            )} */}
                        </div>
                    ))}
            </Keys>

            <div style={{ zIndex: 2 }}>
                {isSummary ? (
                    <>
                        <SummaryContainer>
                            <h1>{stopwatchname}</h1>
                            <p>
                                count: {count} | average: {average} | total:{" "}
                                {total}
                            </p>
                            {timelog.length != 0 && (
                                <GraphContainer>
                                    <Line
                                        data={getLineData()}
                                        options={{
                                            layout: {
                                                padding: { right: 5 },
                                            },
                                            legend: { display: false },
                                            maintainAspectRatio: false,
                                            scales: {
                                                xAxes: [{ display: false }],
                                            },
                                        }}
                                    />
                                </GraphContainer>
                            )}
                            <div>
                                <p>current record</p>
                                <h3>
                                    {getDiffTimeString(endTime - startTime)}
                                </h3>
                            </div>
                        </SummaryContainer>
                        <ButtonContainer>
                            <Button
                                style={{ fontSize: 24 }}
                                onClick={() => {
                                    setIsSummary(false);
                                    if (!isWorking) {
                                        reset();
                                    }
                                }}
                            >
                                {isWorking ? (
                                    <BsArrowLeft />
                                ) : (
                                    <BsArrowClockwise />
                                )}
                            </Button>
                            <Button
                                style={{ fontSize: 24 }}
                                onClick={deleteStopwatch}
                            >
                                <BsTrashFill />
                            </Button>
                        </ButtonContainer>
                    </>
                ) : (
                    <Container>
                        <div ref={force1Ref} tabIndex="1"></div>
                        <AddInput
                            ref={firstFocusRef}
                            tabIndex="2"
                            onChange={onChangeHandler}
                            value={stopwatchname}
                        />
                        <TimeText>
                            {getDiffTimeString(endTime - startTime, is_ms)}
                        </TimeText>
                        <ButtonContainer isWorking={isWorking}>
                            <Button
                                ref={startFocusRef}
                                onClick={startOrStop}
                                tabIndex="3"
                            >
                                {isWorking ? <BsStopFill /> : <BsPlayFill />}
                            </Button>
                            <Button
                                ref={lastFocusRef}
                                onClick={reset}
                                tabIndex="4"
                            >
                                <BsArrowRepeat />
                            </Button>
                        </ButtonContainer>
                        <div ref={force2Ref} tabIndex="5"></div>
                        <Caption>
                            {/* stopwatch{" "} */}
                            <CaptionButton
                                is_on={is_timer}
                                onClick={() => set_is_timer(!is_timer)}
                            >
                                timer
                            </CaptionButton>
                            <span> </span>
                            <CaptionButton is_on={is_ms} onClick={toggleStart}>
                                ms
                            </CaptionButton>
                            <span> </span>
                            <CaptionButton
                                is_on={isSummary}
                                onClick={() => setIsSummary(true)}
                            >
                                history
                            </CaptionButton>
                        </Caption>
                        <Working is_on={isWorking} />
                    </Container>
                )}
            </div>

            <div style={{ zIndex: 1 }}>
                {isSummary ? null : is_timer ? (
                    <Timer
                        startTime={startTime}
                        endTime={endTime}
                        isWorking={isWorking}
                    />
                ) : null}
            </div>
            {/* <TimeLogContainer>
                {timelog.map((log) => (
                    <TimeLog key={log.id}>
                        <TimeLogText>
                            {getTimelogString(log.startTime, log.endTime)}
                        </TimeLogText>
                    </TimeLog>
                ))}
            </TimeLogContainer> */}
        </>
    );
}

const Keys = styled.div`
    position: fixed;
    top: 120px;
    left: 55px;
    width: 200px;
    text-align: left;
    /* max-height: 20vh; */
    font-size: 12px;
    line-height: 1.8;
    overflow-y: hidden;
    color: rgb(144, 144, 147);

    @media (max-width: 500px) {
        display: none;
    }
`;

const SummaryContainer = styled.div`
    display: grid;
    grid-template-columns: 200px 500px;
    grid-template-rows: 80px 200px;
    grid-gap: 15px;
    margin-bottom: 20px;

    h1,
    h2,
    h3,
    p {
        text-align: left;
        margin: 0;
    }

    h1 {
        font-size: 24px;
        color: rgb(144, 144, 147);
        justify-self: start;
    }
    h3 {
        color: rgb(255, 214, 10);
    }
    p {
        grid-column: 2 / 4;
        font-size: 12px;
        color: rgb(144, 144, 147);
        line-height: 1.8;
        justify-self: end;
    }

    @media (max-width: 500px) {
        grid-template-columns: 100px 200px;
        padding: 20px;
    }
`;
const GraphContainer = styled.div`
    grid-column: 1 / 4;
    grid-row: 2;
`;
const TimeLogContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
`;
const TimeLog = styled.div``;
const TimeLogText = styled.p`
    font-size: 14px;
    margin: 4px 0;
    color: rgb(142, 142, 147);
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
export const CaptionButton = styled.div`
    display: inline;
    ${(props) => props.is_on && "color: rgb(255, 214, 10);"}

    transition: all 0.3s;
    cursor: pointer;
`;
export const Caption = styled.div`
    position: absolute;
    top: -20px;
    left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
`;
const Container = styled.div`
    position: relative;
    padding: 20px;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.1);

    display: grid;
    /* grid-template-rows: 100px; */
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;

    margin-bottom: 15px;

    @media (max-width: 500px) {
        width: 320px;
    }
`;

const TimeText = styled.p`
    font-size: 52px;
    margin: 10px 0px 25px 0px;
    @media (max-width: 500px) {
        font-size: 38px;
    }
`;

const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* ${(props) => (props.isWorking ? "repeat(3, 1fr)" : "repeat(2, 1fr)")}; */
    gap: 10px;
`;
const Button = styled.button`
    padding: 10px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.01);
    border: 3px solid transparent;
    color: white;
    font-weight: 600;
    transition: all 0.3s;
    cursor: pointer;
    font-size: 24px;

    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    :focus {
        border: 3px solid rgb(255, 255, 255, 0.1);
        outline: none;
    }

    @media (max-width: 500px) {
        font-size: 18px;
    }
`;

export const AddInput = styled.input`
    font-size: 28px;
    font-family: "CasCadia Code PL";
    font-weight: 600;

    padding: 12px 15px;
    background-color: transparent;
    border: 3px solid transparent;
    border-radius: 15px;
    color: rgb(255, 214, 13);
    transition: all 0.3s;

    :focus {
        color: white;
        border: 3px solid rgba(255, 255, 255, 0.3);
        outline: none;
        background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 500px) {
        font-size: 18px;
    }
`;
