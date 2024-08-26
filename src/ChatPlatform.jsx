import React, { useState, useRef, useEffect } from 'react';
import './ChatPlatform.css';

function ChatPlatform() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
        setInputMessage('');

        try {
            const response = await fetch('http://localhost:3000/api/process-expense', { // Update to your server endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputMessage }) // Adjust based on Gemini API requirements
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Print output to the terminal
            const aiResponse = JSON.stringify(data, null, 2);
            setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        } catch (error) {
            console.error('Error calling API:', error);
            setError('Failed to process the message. Please try again.');
            setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", sender: 'ai' }]);
        }
    };

    return (
        <div className="chat-platform">
            <div className="chat-header">
                <h2>Chat with Gemini AI</h2>
            </div>
            <div className="chat-history">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="message-bubble">{message.text}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatPlatform;