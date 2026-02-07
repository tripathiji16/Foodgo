import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type Message = {
  _id: string;
  text: string;
  createdAt: number;
  user: {
    _id: number; // 1 for Customer, 2 for SupportBot
    name: string;
    avatar?: string;
  };
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => Promise<void>; 
};

const SUPPORT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/870/870175.png';

const getBotResponse = (text: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('hello') || lowerText.includes('hi')) 
    return "Hello! How can I help you today?";
  if (lowerText.includes('late') || lowerText.includes('time')) 
    return "I apologize for the delay. The rider is currently 5 minutes away.";
  if (lowerText.includes('food') || lowerText.includes('burger') || lowerText.includes('order')) 
    return "Your food is being prepared with care! It should be ready shortly.";
  if (lowerText.includes('thank')) 
    return "You're very welcome! Enjoy your meal when it arrives.";
  if (lowerText.includes('bye')) 
    return "Goodbye! Have a great day.";
  return "I see. Let me check the status of that request for you immediately.";
};


const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadChat = async () => {
      if (!user?.uid) {
        setMessages([]);
        return;
      }

      try {
        const key = `CHAT_HISTORY_${user.uid}`;
        const storedChat = await AsyncStorage.getItem(key);
        
        if (storedChat) {
          setMessages(JSON.parse(storedChat));
        } else {

          const initialMsg: Message = {
            _id: 'init-1',
            text: `Hi ${user.name || 'there'}! How can we help you today?`,
            createdAt: Date.now(),
            user: { 
                _id: 2, 
                name: 'Support',
                avatar: SUPPORT_AVATAR
            },
          };
          setMessages([initialMsg]);
          await AsyncStorage.setItem(key, JSON.stringify([initialMsg]));
        }
      } catch (e) {
        console.error("Failed to load chat", e);
      }
    };

    loadChat();
  }, [user?.uid]);

  const sendMessage = async (text: string) => {
    if (!user?.uid) return;
    const key = `CHAT_HISTORY_${user.uid}`;
    
    const userMsg: Message = {
      _id: Math.random().toString(36).substring(7),
      text,
      createdAt: Date.now(),
      user: { 
        _id: 1, 
        name: user.name || 'User',

      },
    };

   
    const historyAfterUser = [...messages, userMsg];
    setMessages(historyAfterUser);
    await AsyncStorage.setItem(key, JSON.stringify(historyAfterUser));

    setTimeout(async () => {

      const responseText = getBotResponse(text);

      const botMsg: Message = {
        _id: Math.random().toString(36).substring(7),
        text: responseText,
        createdAt: Date.now(),
        user: { 
            _id: 2, 
            name: 'Support',
            avatar: SUPPORT_AVATAR
        },
      };
  
      setMessages((prevMessages) => {
        const updatedHistory = [...prevMessages, botMsg];
        AsyncStorage.setItem(key, JSON.stringify(updatedHistory)); 
        return updatedHistory;
      });
      
    }, 1500); 
  };

  const clearChat = async () => {
    if (!user?.uid) return;
    const key = `CHAT_HISTORY_${user.uid}`;
    await AsyncStorage.removeItem(key);
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};