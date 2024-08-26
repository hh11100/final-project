'use client'
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Title from '@/components/dashboard/Title';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { socket } from '@/lib/socket';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const fetchConversations = async () => {
  try {
    const response = await fetch('/api/conversations');
    if (!response.ok) {
      throw new Error(`Error fetching conversations: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
};

const fetchMessages = async (conversationId, lastMessageId, lastTimestamp) => {
  try {
    const queryParams = new URLSearchParams();
    if (lastMessageId) queryParams.append('lastMessageId', lastMessageId);
    if (lastTimestamp) queryParams.append('lastTimestamp', lastTimestamp);

    const response = await fetch(`/api/conversations/${conversationId}/messages?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching messages: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
};

export default function Page() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversationOtherUser, setConversationOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [otherUserIsTyping, setOtherUserIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const loadConversations = async () => {
      const convos = await fetchConversations();
      setConversations(convos);
      if (convos.length > 0) {
        setCurrentConversationId(convos[0].id); // Automatically load the first conversation
        setConversationOtherUser(convos[0].participants.find((p) => p.id !== user.id).firstName);
      }
    };

    loadConversations();

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      if (currentConversationId) {
        socket.emit("join", { conversationId: currentConversationId });
      }

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      socket.on("typing", ({ userId }) => {
        console.log(`User ${userId} is typing`);
        setOtherUserIsTyping(true);

        setTimeout(() => {
          setOtherUserIsTyping(false);
        }, 2000); // Clear the typing indicator after 2 seconds
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        const lastMessage = messages[messages.length - 1];
        const lastMessageId = lastMessage?.id;
        const lastTimestamp = lastMessage?.sentAt;

        const newMessages = await fetchMessages(currentConversationId, lastMessageId, lastTimestamp);
        if (newMessages.messages.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...newMessages.messages]);
          setConversationOtherUser(conversations.find((c) => c.id === currentConversationId).participants.find((p) => p.id !== user.id).firstName);
        }
      }
    };

    console.log("Loading messages...");
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 15000); // Polling every 15 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentConversationId, messages]);

  useEffect(() => {
    console.log("Current conversation ID:", currentConversationId);
    if (currentConversationId) {
      socket.emit("join", { conversationId: currentConversationId });
    }
  }, [currentConversationId]);

  useEffect(() => {
    // Scroll to the last message when the messages state changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/conversations/${currentConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      const newMessageData = await response.json();

      // Update local state to show the new message
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    socket.emit('typing', { userId: user.id, conversationId: currentConversationId });

    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of Enter key in a form
      handleSend();
    }
  };

  const handleConversationClick = (conversationId) => {
    setCurrentConversationId(conversationId);
    setMessages([]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '80vh', overflow: 'auto' }}>
          <Title>Conversations</Title>
          <List>
            {conversations.map((conversation) => (
              <ListItem button key={conversation.id} onClick={() => handleConversationClick(conversation.id)}>
                <ListItemText primary={conversation.title} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Title>Messages</Title>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button variant="contained" fullWidth color="secondary">
                Hire
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button variant="contained" fullWidth color="primary" onClick={() => router.push(`/dashboard/profile/${conversationOtherUser}`)}>
                View Profile
              </Button>
            </Grid>
          </Grid>

          <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem>
                  <ListItemText primary={message.sender.firstName} secondary={message.body} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {/* This div is used to ensure scrolling to the last message */}
            <div ref={messagesEndRef} />
          </List>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                {otherUserIsTyping ? `${conversationOtherUser} is typing...` : ''}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                label="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" fullWidth onClick={handleSend}>
                Send
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
