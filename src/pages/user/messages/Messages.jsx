import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../hooks/useSocket'; // custom hook
import api from '../../../services/socketApi';

export default function UserMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useSocket(); // custom hook that returns socket instance

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/users/messages/user/conversations');
        setConversations(res.data);
        if (res.data.length > 0) {
          setActiveConversation(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/users/messages/user/conversations/${activeConversation._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (data) => {
      if (data.conversationId === activeConversation?._id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update conversation list last message
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, lastMessage: data.message, lastMessageAt: data.message.createdAt } : c
      ));
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, activeConversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const formData = new FormData();
    formData.append('content', newMessage);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const res = await api.post('/users/messages/user/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Message will appear via socket, so no need to add manually
      setNewMessage('');
      setAttachment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <div className="user-messages-container">
      <div className="conversations-list">
        <h3>Your Conversations</h3>
        {conversations.map(conv => (
          <div
            key={conv._id}
            className={`conversation-item ${activeConversation?._id === conv._id ? 'active' : ''}`}
            onClick={() => setActiveConversation(conv)}
          >
            <p className="last-message">
              {conv.lastMessage?.content.substring(0, 30)}...
            </p>
            <small>{new Date(conv.lastMessageAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="message-thread">
        {activeConversation ? (
          <>
            <div className="messages">
              {messages.map(msg => (
                <div key={msg._id} className={`message ${msg.senderType}`}>
                  <div className="message-header">
                    <strong>{msg.senderType === 'user' ? 'You' : `Admin (${msg.senderId?.name})`}</strong>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="message-content">{msg.content}</div>
                  {msg.attachments.length > 0 && (
                    <div className="attachments">
                      {msg.attachments.map((att, idx) => (
                        <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer">
                          📎 {att.originalName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <button type="submit" disabled={loading}>Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
}