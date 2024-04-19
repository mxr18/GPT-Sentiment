import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
	const [message, setMessage] = useState('');
	const [sentiment, setSentiment] = useState('');
	const [animate, setAnimate] = useState(false);
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	useEffect(() => {
		if (sentiment) {
			setAnimate(true);
			setTimeout(() => { setAnimate(false); }, 500);
		}
	}, [sentiment]);

	const getSentiment = async() => {
    try {
    	fetch('http://localhost:5000/api/sentiment', {
     		method: 'POST',
      		headers: { 'Content-Type': 'application/json' },
      		body: JSON.stringify({ message })
    	})
    	.then(res => res.json())
    	.then(json => setSentiment(json));

		fetch('http://localhost:5000/api/messages', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message: message,
				sentiment: sentiment
			})
		});
	}
    catch (err) {
      console.error('Error: ' + err);
      setSentiment('X');
    }
};

	return (
		<>
			<textarea
				ref={ inputRef }
				onChange={ e => setMessage(e.target.value) }
				placeholder='Write your message here!'
				cols='50'
				rows='10'/>
			<br/>
			<button onClick={ getSentiment }>Get Message Sentiment</button>
			{
				sentiment &&
				<h2>
					<br/>
					Message sentiment is:
					<span id='emoji' className={ animate ? 'animate' : '' }>
						{ sentiment }
					</span>
				</h2>
			}
		</>
	);
}

export default App;