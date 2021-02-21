import { useState } from "react";
import styled from "styled-components";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AddInput } from "./Stopwatch";

function Timer({ startTime, endTime, isWorking }) {
    const [min, setMin] = useState(40);

    const timer = 1000 * 60 * min;
    const diff = endTime - startTime;
    const progress = (diff / timer) * 100;
    const diffMin = parseInt(diff / 1000 / 60);

    return (
        <FixedContainer>
            <InnnerContainer>
                <CircularProgressbar
                    value={progress}
                    strokeWidth={1}
                    styles={buildStyles({
                        pathTransition: "easeInOut",
                        pathTransitionDuration: 0.6,
                        pathColor: "rgba(255, 214, 10, 0.5)",
                        trailColor: "rgba(0, 0, 0, 0.1)",
                    })}
                />
                <Container>
                    <AddInput
                        onChange={(e) =>
                            setMin(
                                !isNaN(e.target.value)
                                    ? Number(e.target.value)
                                    : 40
                            )
                        }
                        value={min - diffMin < 0 ? 0 : min - diffMin}
                        disabled={isWorking}
                        maxLength={3}
                        style={{
                            width: 40,
                            fontSize: 18,
                            textAlign: "center",
                            padding: 8,
                        }}
                    />
                    <span>min</span>
                </Container>
            </InnnerContainer>
        </FixedContainer>
        // <Container>
        //     {/* {timestring} */}
        //     <AddInput />

        //     <ProgressBar>
        //         <UnderProgressBar />
        //         <OverProgressBar />
        //     </ProgressBar>
        // </Container>
    );
}

const InnnerContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const FixedContainer = styled.div`
    position: absolute;
    width: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-width: 500px) {
        width: 500px;
    }
`;

// const ProgressBar = styled.div`
//     position: relative;
//     width: 100%;
//     height: 12px;
//     border-radius: 6px;
//     overflow: hidden;
// `;
// const OverProgressBar = styled.div`
//     position: absolute;
//     width: 70%;
//     height: 100%;
//     background-color: rgb(255, 214, 10);
// `;
// const UnderProgressBar = styled.div`
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background-color: rgb(144, 144, 147);
// `;

const Container = styled.div`
    top: 60px;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    padding: 4px;
    margin-bottom: 45px;
    border-radius: 20px;
    /* background-color: rgba(0, 0, 0, 0.1); */

    display: grid;
    /* grid-template-rows: 100px; */
    /* grid-template-columns: 1fr; */
    justify-content: center;
    align-items: center;

    span {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        color: rgb(144, 144, 147);
    }
`;

export default Timer;
