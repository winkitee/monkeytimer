import React from "react";
import styled from 'styled-components'
import { colors } from '../styles/config'

function MonkeyTimerHeader() {
    return (
        <Header
            style={{ cursor: "pointer" }}
            onClick={() => window.location.reload()}
        >
            monkeytimer
        </Header>
    );
}

const Header = styled.div`
    color: ${colors.PRIMARY_COLOR};
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

export default MonkeyTimerHeader