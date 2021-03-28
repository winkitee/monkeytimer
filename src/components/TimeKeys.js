import React, { useMemo } from "react";
import styled from "styled-components";
import { CaptionButton } from "../common/shared";

export default function TimeKeys(props) {
    const { stopwatchname, data, onClickItem } = props;
    const objKeys = Object.keys(data);
    const keys = useMemo(() => objKeys.sort(), [objKeys.length]);
    return (
        <Keys>
            {keys.map((key) => (
                <div style={{ display: "block" }} key={key}>
                    <CaptionButton
                        onClick={() => onClickItem(key)}
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

    transition: opacity 0.3s;
    opacity: 0;
    :hover {
        opacity: 1;
    }

    @media (max-width: 700px) {
        display: none;
    }
    @media (max-height: 800px) {
        display: none;
    }
`;
