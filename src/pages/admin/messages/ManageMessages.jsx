import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useSocket } from '../../../hooks/useSocket';
import api from '../../../services/socketApi';

export default function AdminMessages() {
  const { admin } = useAdmin();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/users/messages/admin/conversations');
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
        const res = await api.get(`/users/messages/admin/conversations/${activeConversation._id}`);
        setMessages(res.data);
        // Mark as read when opening
        await api.patch(`/users/messages/admin/conversations/${activeConversation._id}/read`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (data) => {
      if (data.conversationId === activeConversation?._id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update conversation list
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, lastMessage: data.message, lastMessageAt: data.message.createdAt, unreadCount: (c.unreadCount || 0) + 1 } : c
      ));
    });

    socket.on('message_reply', (data) => {
      if (data.conversationId === activeConversation?._id) {
        setMessages(prev => [...prev, data.message]);
      }
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId ? { ...c, lastMessage: data.message, lastMessageAt: data.message.createdAt } : c
      ));
    });

    return () => {
      socket.off('new_message');
      socket.off('message_reply');
    };
  }, [socket, activeConversation]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && !attachment) return;

    const formData = new FormData();
    formData.append('content', replyText);
    if (attachment) formData.append('attachment', attachment);

    try {
      await api.post(`/users/messages/admin/conversations/${activeConversation._id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReplyText('');
      setAttachment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async () => {
    if (!activeConversation) return;
    try {
      await api.patch(`/users/messages/admin/conversations/${activeConversation._id}/read`);
      setConversations(prev => prev.map(c =>
        c._id === activeConversation._id ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-messages-container">
      <div className="conversations-list">
        <h3>All Conversations</h3>
        {conversations.map(conv => (
          <div
            key={conv._id}
            className={`conversation-item ${activeConversation?._id === conv._id ? 'active' : ''}`}
            onClick={() => setActiveConversation(conv)}
          >
            <div className="conv-header">
              <strong>{conv.user?.name}</strong>
              {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
            </div>
            <p className="last-message">{conv.lastMessage?.content.substring(0, 30)}...</p>
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
                    <strong>
                      {msg.senderType === 'user'
                        ? activeConversation.user?.name
                        : `Admin (${msg.senderId?.name})`}
                    </strong>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                    {msg.senderType === 'user' && (
                      <span className={`read-status ${msg.isRead ? 'read' : 'unread'}`}>
                        {msg.isRead ? '✓ Read' : '✓ Unread'}
                      </span>
                    )}
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

            <form onSubmit={handleSendReply} className="message-input-form">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
              />
              <input type="file" onChange={(e) => setAttachment(e.target.files[0])} accept="image/*" />
              <button type="submit">Send</button>
              <button type="button" onClick={handleMarkRead}>Mark as read</button>
            </form>
          </>
        ) : (
          <div className="no-conversation">No conversations yet</div>
        )}
      </div>
    </div>
  );
}