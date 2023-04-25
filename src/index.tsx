import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';
import { GlobalStyle } from './components/GlobalStyle/GlobalStyle';

declare let window: any;
declare let device: any;

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<App />);

const renderReactDom = () => {
	root.render(
		<>
			<GlobalStyle />
			<App />
		</>
	);
};

if (window.cordova) {
	document.addEventListener(
		'deviceready',
		() => {
			window.screen.orientation.lock('portrait');
			localStorage.setItem('uuid', device.uuid);
			renderReactDom();
		},
		false
	);
} else {
	renderReactDom();
}
