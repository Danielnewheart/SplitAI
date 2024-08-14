import React from 'react';

function ChatButton({ onClick, isActive }) {
    console.log('ChatButton rendering');
    return (
        <button 
            onClick={onClick} 
            className={`chat-button ${isActive ? 'active' : ''}`}
        >
            Chat
        </button>
    );
}

export default ChatButton;