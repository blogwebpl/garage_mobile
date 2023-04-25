import 'react-circular-progressbar/dist/styles.css';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
	HistoryContainer,
	LightContainer,
	ProgressContainer,
	SettingsContainer,
	StyledContainer,
	SwitchContainer,
	VideoContainer,
} from './app.style';
import { useEffect, useState } from 'react';

import History from '../../assets/History';
import LightOff from '../../assets/LightOff';
import LightOn from '../../assets/LightOn';
import Settings from '../../assets/Settings';
import SwitchGateClose from '../../assets/SwichGateClose';
import SwitchGateClosing from '../../assets/SwichGateClosing';
import SwitchGateOpen from '../../assets/SwichGateOpen';
import SwitchGateOpening from '../../assets/SwichGateOpening';
import SwitchGateStop from '../../assets/SwichGateStop';
import SwitchGateUnknown from '../../assets/SwichGateUnknown';
import Video from '../../assets/Video';
import config from '../../config';
import mqtt from 'mqtt';

export const App = () => {
	const [client, setClient] = useState<mqtt.Client | null>(null);
	const [connectStatus, setConnectStatus] = useState('');
	const [startLongPress, setStartLongPress] = useState(false);
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState('unknown');
	const [light, setLight] = useState('off');
	const clientId = localStorage.getItem('uuid') || 'mobile';

	const mqttConnect = (host: string) => {
		setConnectStatus('connecting');
		const c = mqtt.connect(host, {
			clientId,
			clean: true,
			port: config.port,
			keepalive: 2,
			reconnectPeriod: 1000,
			username: config.userName,
			password: config.password,
			will: {
				topic: `${clientId}/status`,
				payload: 'offline',
				qos: 1,
				retain: true,
			},
		});
		setClient(c);
	};

	const handleGateButton = () => {
		mqttPublish({
			topic: `${config.garageId}/gate/switch`,
			qos: 0,
			payload: new Date().toString(),
		});
		setStartLongPress(false);
	};

	const handleLightButton = (on: boolean) => {
		mqttPublish({
			topic: `${config.garageId}/light`,
			qos: 0,
			payload: on ? 'true' : 'false',
		});
	};

	const mqttPublish = (context: any) => {
		if (client) {
			const { topic, qos, payload } = context;
			client.publish(topic, payload, { qos }, (error) => {
				if (error) {
					// console.log('Publish error: ', error);
				}
			});
		}
	};
	useEffect(() => {
		mqttConnect(config.mosquittoBroker);
	}, []);

	useEffect(() => {
		let timerId: NodeJS.Timeout | undefined = undefined;
		if (startLongPress) {
			setProgress(100);
			timerId = setTimeout(() => {
				handleGateButton();
			}, config.longPressMs);
		} else {
			setProgress(0);
			if (timerId !== undefined) {
				clearTimeout(timerId);
			}
		}

		return () => {
			if (timerId !== undefined) {
				clearTimeout(timerId);
			}
		};
	}, [startLongPress, handleGateButton]);

	useEffect(() => {
		if (client) {
			client.on('connect', () => {
				setConnectStatus('connected');
				client.publish(`${clientId}/status`, 'online', {
					retain: true,
					qos: 1,
				});
				client.subscribe(`${config.garageId}/status`, function (_err) {
					// console.log(_err);
				});
				client.subscribe(`${config.garageId}/gate/state`, function (_err) {
					// console.log(_err);
				});
				client.subscribe(`${config.garageId}/light/state`, function (_err) {
					// console.log(_err);
				});
			});
			client.on('message', (topic: string, message: any) => {
				if (topic === `${config.garageId}/gate/state`) {
					setStatus(message.toString());
				}
				if (topic === `${config.garageId}/light/state`) {
					setLight(message.toString());
				}
			});
		}
	}, [client]);

	return (
		<StyledContainer>
			<VideoContainer>
				<Video />
			</VideoContainer>
			<LightContainer
				onClick={() => {
					handleLightButton(light === 'off');
				}}
			>
				{light === 'on' ? <LightOn /> : <LightOff />}
			</LightContainer>
			<HistoryContainer>
				<History />
			</HistoryContainer>
			<SettingsContainer>
				<Settings />
			</SettingsContainer>
			<ProgressContainer>
				<CircularProgressbar
					value={status === 'closing' || status === 'opening' ? 100 : progress}
					styles={buildStyles({
						// Rotation of path and trail, in number of turns (0-1)
						rotation: 0,

						// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
						strokeLinecap: 'butt',
						// How long animation takes to go from one percentage to another, in seconds
						pathTransitionDuration:
							//(progress === 0 && status === 'close') || status === 'open'
							status === 'close' || status === 'open'
								? config.longPressMs / 1000
								: status === 'opening'
								? 14
								: 12.4,

						// Can specify path transition in more detail, or remove it entirely
						// pathTransition: 'none',

						// Colors
						pathColor:
							status === 'close' || status === 'opening'
								? '#8BC24A'
								: '#F44236',
						trailColor: 'black',
					})}
				/>
			</ProgressContainer>
			<SwitchContainer
				onMouseDown={() => {
					if (connectStatus === 'connected') {
						setStartLongPress(true);
					}
				}}
				onMouseUp={() => {
					setStartLongPress(false);
				}}
				onTouchStart={() => {
					setStartLongPress(true);
				}}
				onTouchEnd={() => {
					setStartLongPress(false);
				}}
			>
				{status === 'open' ? <SwitchGateOpen /> : null}
				{status === 'close' ? <SwitchGateClose /> : null}
				{status === 'unknown' ? <SwitchGateUnknown /> : null}
				{status === 'opening' ? <SwitchGateOpening /> : null}
				{status === 'closing' ? <SwitchGateClosing /> : null}
				{status === 'stop' ? <SwitchGateStop /> : null}
			</SwitchContainer>
		</StyledContainer>
	);
};
