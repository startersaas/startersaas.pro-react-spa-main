// src/contexts/ChatsContext.js
import React, { createContext, useContext, useState } from 'react';

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatsContext.Provider>
  );
};

export const useChats = () => {
  const context = useContext(ChatsContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatsProvider');
  }
  return context;
};


