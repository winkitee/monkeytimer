import React, { useEffect, useMemo, useState } from "react";

import Timer from "./Timer";
import Summary from "./Summary";
import TimeKeys from "./TimeKeys";
import Stopwatch from "./Stopwatch";

import { getDiffTimeString } from "../lib/utils";
import { Caption, CaptionButton } from "../common/shared";
import { updateStopwatchTimelog, deleteStopwatchWithKey } from "../common/api";

export default function Main({ user, name = "Base" }) {
    const [is_ms, set_is_ms] = useState(false);
    const [is_timer, set_is_timer] = useState(false);
    const [is_working, set_is_working] = useState(false);
    const [is_summary, set_is_summary] = useState(false);

    const [min, setMin] = useState(40);
    const [stopwatchname, setStopwatchname] = useState(name);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [timelog, setTimelog] = useState([]);
    const [timeKeys, setTimeKeys] = useState(
        JSON.parse(localStorage.getItem("key")) || []
    );

    const timer = React.useRef();

    function setTimerValue(e) {
        setMin(!isNaN(e.target.value) ? Number(e.target.value) : 40);
    }

    function save() {
        const newlog = {
            id: startTime + endTime,
            startTime,
            endTime,
            diffTime: endTime - startTime,
        };
        timelog.push(newlog);

        const keyJSON = localStorage.getItem("key");
        let keys = [];
        if (keyJSON) {
            keys = JSON.parse(keyJSON);
            if (!keys[stopwatchname]) {
                keys[stopwatchname] = 1;
                localStorage.setItem("key", JSON.stringify(keys));
                setTimeKeys(keys);
            }
        } else {
            keys = { [stopwatchname]: 1 };
            localStorage.setItem("key", JSON.stringify(keys));
            setTimeKeys(keys);
        }

        localStorage.setItem(stopwatchname, JSON.stringify(timelog));
        setTimelog(timelog);
        set_is_summary(true);

        // Update Firebase firestore
        updateStopwatchTimelog(stopwatchname, timelog);
    }

    function reset() {
        cancelAnimationFrame(timer.current);
        const current = new Date().getTime();
        setStartTime(current);
        setEndTime(current);
        set_is_working(false);
    }

    function start() {
        setStartTime(new Date().getTime());
        setEndTime(new Date().getTime());

        const frame = is_ms ? 39 : 1;
        const fpsInterval = parseInt(1000 / frame);
        let than = Date.now();

        function animate() {
            cancelAnimationFrame(timer.current);
            timer.current = requestAnimationFrame(animate);

            const now = Date.now();
            const elapsed = now - than;

            if (elapsed > fpsInterval) {
                than = now - (elapsed % fpsInterval);

                setEndTime(new Date().getTime());
            }
        }
        animate();
        set_is_working(true);
    }

    function stop() {
        cancelAnimationFrame(timer.current);
        setEndTime(new Date().getTime());
        set_is_working(false);
        save();
    }

    function toggleIsWorking() {
        if (!is_working) {
            start();
        } else {
            stop();
        }
    }

    function toggleMS() {
        set_is_ms(!is_ms);
        reset();
    }

    function updateCache(name) {
        const item = localStorage.getItem(name);
        if (item) {
            try {
                const timelog = JSON.parse(item);
                setTimelog(timelog);
            } catch (e) {
                localStorage.removeItem(name);
            }
        } else {
            setTimelog([]);
        }
    }

    function onChangeHandler(e) {
        setStopwatchname(e.target.value);
        updateCache(e.target.value);
    }

    function selectKey(key) {
        try {
            setStopwatchname(key);
            const data = localStorage.getItem(key) || [];
            setTimelog(JSON.parse(data));
        } catch (e) {
            console.log(e);
        } finally {
            reset();
        }
    }

    function backOrReset() {
        set_is_summary(false);
        if (!is_working) {
            reset();
        }
    }

    function deleteStopwatch() {
        const isCheck = window.confirm("Do you really want to delete?");
        if (!isCheck) return;
        localStorage.removeItem(stopwatchname);
        setTimelog([]);
        delete timeKeys[stopwatchname];
        localStorage.setItem("key", JSON.stringify(timeKeys));
        setTimeKeys(timeKeys);
        setStopwatchname("Base");
        set_is_summary(false);
        reset();

        // Delete Firebase firestore
        deleteStopwatchWithKey(stopwatchname);
    }

    const diffTimeString = useMemo(
        () => getDiffTimeString(endTime - startTime, is_ms),
        [endTime, startTime, is_ms]
    );

    useEffect(() => {
        updateCache(stopwatchname);
    }, []);

    useEffect(() => {
        const keyJSON = localStorage.getItem("key");
        setTimeKeys(keyJSON ? JSON.parse(keyJSON) : {});
        setTimelog([]);
    }, [user]);

    return (
        <>
            {/* start code */}
            <TimeKeys
                stopwatchname={stopwatchname}
                data={timeKeys}
                onClickItem={(key) => selectKey(key)}
            />
            {is_summary ? (
                <Summary
                    timelog={timelog}
                    isWorking={is_working}
                    stopwatchname={stopwatchname}
                    diffTimeString={diffTimeString}
                    onClickArrowLeftAndRefresh={backOrReset}
                    onClickTrash={deleteStopwatch}
                />
            ) : (
                <div style={{ position: "relative", zIndex: 2 }}>
                    <Stopwatch
                        isWorking={is_working}
                        stopwatchname={stopwatchname}
                        diffTimeString={diffTimeString}
                        onChangeAddInput={onChangeHandler}
                        onClickPlayOrStop={toggleIsWorking}
                        onClickArrowRepeat={reset}
                    />
                    <Caption>
                        {/* stopwatch{" "} */}
                        <CaptionButton
                            is_on={is_timer}
                            onClick={() => set_is_timer(!is_timer)}
                        >
                            timer
                        </CaptionButton>
                        <span> </span>
                        <CaptionButton is_on={is_ms} onClick={toggleMS}>
                            ms
                        </CaptionButton>
                        <span> </span>
                        <CaptionButton
                            is_on={is_summary}
                            onClick={() => set_is_summary(true)}
                        >
                            history
                        </CaptionButton>
                    </Caption>
                </div>
            )}

            {is_summary ? null : is_timer ? (
                <div style={{ zIndex: 1 }}>
                    <Timer
                        min={min}
                        onChangeTimerMin={setTimerValue}
                        startTime={startTime}
                        endTime={endTime}
                        isWorking={is_working}
                    />
                </div>
            ) : null}
        </>
    );
}
