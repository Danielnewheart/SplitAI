import React, { useState, useRef, useEffect } from 'react';
import './ChatPlatform.css';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

function ChatPlatform() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        setMessages([...messages, { text: inputMessage, sender: 'user' }]);

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: inputMessage }] }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
        } catch (error) {
            console.error('Error calling Gemini AI:', error);
            setMessages(prevMessages => [...prevMessages, { text: "Sorry, I couldn't process that request.", sender: 'ai' }]);
        }

        setInputMessage('');
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