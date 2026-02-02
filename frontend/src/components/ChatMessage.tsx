import React from 'react';
import { User } from '../types';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
    isOwn: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl p-3 ${
        message.isOwn 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
      }`}>
        {!message.isOwn && (
          <div className="text-xs font-semibold mb-1">@{message.sender.username}</div>
        )}
        <div className="mb-1">{message.content}</div>
        <div className="text-xs opacity-70 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;