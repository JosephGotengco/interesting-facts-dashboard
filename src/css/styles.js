import styled from "styled-components";

// see https://styled-components.com/ for more info about this library
export const AppContainer = styled.div`
    width: 750px;
    margin: 0 auto;
    box-shadow: 5px 5px 15px 5px #ccc;
    border-radius: 12px;
`;

export const AppSection = styled.div`
    width: 50%;
    padding: 20px 25px;
`;

export const AppSectionHeader = styled.h4`
    font-family: "Roboto", sans-serif;
    weight: 500;
    font-size: 22px;
`;

export const StatLabel = styled.h3`
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    weight: 700;
`;

export const StatValue = styled.p`
    font-family: "Space Grotesk", sans-serif;
    font-size: 14px;
    weight: 400;
`;

export const Logo = styled.img`
    width: 150px;
    height: 150px;
`;

export const TitleText = styled.h1`
    font-family: "Roboto", sans-serif;
    weight: 700;
    font-size: 32px;
    margin: auto 0;
`;

export const SubTitle = styled.h4`
    font-family: "Roboto", sans-serif;
    weight: 500;
    font-size: 16px;
    margin: auto 0;
`;

export const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export const HeaderWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
