import styled from 'styled-components';

export const StyledContainer = styled.div`
	background-color: black;
	position: relative;
	height: 100vh;
	color: white;
	user-select: none;
`;

export const SwitchContainer = styled.div`
	width: 146px;
	height: 146px;
	position: absolute;
	top: 50%;
	margin-top: -73px;
	left: 50%;
	margin-left: -73px;
	z-index: 100;
`;

export const ProgressContainer = styled.div`
	position: absolute;
	top: 50%;
	margin-top: -86px;
	left: 50%;
	margin-left: -86px;
	z-index: 90;
	width: 172px;
	height: 172px;
`;

export const VideoContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 80;
	margin-left: -155px;
	margin-top: -155px;
`;

export const LightContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 80;
	margin-left: 15px;
	margin-top: -155px;
`;

export const HistoryContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 80;
	margin-left: -155px;
	margin-top: 15px;
`;

export const SettingsContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 80;
	margin-left: 15px;
	margin-top: 15px;
`;
