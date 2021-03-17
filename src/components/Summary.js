import React, { useMemo } from "react";
import moment from "moment";
import styled from "styled-components";
import { BsArrowClockwise, BsTrashFill, BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";

import { getDiffTimeString } from "../lib/utils";
import { Button, ButtonContainer } from "../common/shared";
import { colors } from "../styles/config";

function TimeStamp({ timeString }) {
    return (
        <div>
            <p>current record</p>
            <h3>{timeString}</h3>
        </div>
    );
}

export default function Summary(props) {
    const {
        timelog,
        isWorking,
        stopwatchname,
        diffTimeString,
        onClickArrowLeftAndRefresh,
        onClickTrash,
    } = props;

    function getInfo(timelog) {
        let count = timelog.length;
        let total = 0;

        for (const log of timelog) {
            total += log.diffTime;
        }

        let average = parseInt(total / count);
        if (isNaN(average)) average = 0

        return {
            count,
            average: getDiffTimeString(average, false, true),
            total: getDiffTimeString(total, false, true),
        };
    }

    function getLineDataTimeLog(timelog) {
        return {
            labels: timelog.map((log) =>
                moment(log.startTime).format("YYYY-MM-DD")
            ),
            datasets: [
                {
                    label: "",
                    data: timelog.map((log) => parseInt(log.diffTime / 1000)),
                    fill: false,
                    backgroundColor: colors.PRIMARY_COLOR,
                    borderColor: colors.PRIMARY_COLOR,
                },
            ],
        };
    }

    const { count, average, total } = useMemo(() => getInfo(timelog), [
        timelog.length,
        stopwatchname,
    ]);
    const lineData = useMemo(() => getLineDataTimeLog(timelog), [
        timelog.length,
        stopwatchname,
    ]);

    return (
        <>
            <SummaryContainer>
                <h1>{stopwatchname}</h1>
                <p>
                    count: {count} | average: {average} | total: {total}
                </p>
                {timelog.length != 0 && (
                    <GraphContainer>
                        <Line
                            data={lineData}
                            options={{
                                layout: {
                                    padding: { right: 5 },
                                },
                                legend: { display: false },
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{ display: false }],
                                    yAxes: [
                                        {
                                            ticks: {
                                                beginAtZero: true,
                                                callback: function (value) {
                                                    return getDiffTimeString(
                                                        value * 1000
                                                    );
                                                },
                                            },
                                        },
                                    ],
                                },
                                tooltips: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return getDiffTimeString(
                                                timelog[tooltipItem.index]
                                                    .diffTime
                                            );
                                        },
                                    },
                                },
                            }}
                        />
                    </GraphContainer>
                )}
                <TimeStamp timeString={diffTimeString} />
            </SummaryContainer>
            <ButtonContainer>
                <Button
                    style={{ fontSize: 24 }}
                    onClick={onClickArrowLeftAndRefresh}
                >
                    {isWorking ? <BsArrowLeft /> : <BsArrowClockwise />}
                </Button>
                <Button style={{ fontSize: 24 }} onClick={onClickTrash}>
                    <BsTrashFill />
                </Button>
            </ButtonContainer>
        </>
    );
}

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
        color: ${colors.PRIMARY_COLOR};
    }
    p {
        grid-column: 2 / 4;
        font-size: 14px;
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
