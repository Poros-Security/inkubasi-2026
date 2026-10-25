export interface Message {
  id: number;
  sender: 'me' | 'them' | 'system';
  text: string;
  time: string;
}

export const chatHistory: Record<number, Message[]> = {
  1: [
    { id: 1, sender: 'them', text: 'Can you send me that file?', time: '08:58' },
    { id: 2, sender: 'me', text: 'sure.', time: '09:01' },
    { id: 3, sender: 'them', text: 'Yet another message here..', time: '09:05' },
    { id: 4, sender: 'me', text: 'What time should we meet?', time: '12:30' },
    { id: 5, sender: 'me', text: 'I\'ll be there in 10 minutes.', time: '10:12' },
    { id: 6, sender: 'them', text: 'Let\'s meet at the coffee shop.', time: '18:03' }
  ],
 0: [
    { id: 901, sender: 'system', text: '__HEX_MSG_1__', time: '00:01' },
    { id: 902, sender: 'system', text: '__HEX_MSG_2__', time: '00:02' },
    { id: 903, sender: 'system', text: '__HEX_FLAG__', time: '00:03' }
  ]
};

export const db = {
  getMessages: async (chatId: number) => {
    return chatHistory[chatId] || [];
  },
  
  saveMessage: async (chatId: number, text: string, dummyIv?: string, dummyHint?: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // chatHistory[chatId].push(newMessage);
    return newMessage;
  }
};
