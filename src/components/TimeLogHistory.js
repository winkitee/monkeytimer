import React from "react";
import styled from "styled-components";

import { getTimelogString } from "../lib/utils";

export default function TimelogHistory({ timelog }) {
    return (
        <TimeLogContainer>
            {timelog.map((log) => (
                <TimeLog key={log.id}>
                    <TimeLogText>
                        {getTimelogString(log.startTime, log.endTime)}
                    </TimeLogText>
                </TimeLog>
            ))}
        </TimeLogContainer>
    );
}

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
