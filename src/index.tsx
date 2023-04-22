import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container!);

function App() {
	return <div>Hello World!</div>;
}

root.render(<App />);
