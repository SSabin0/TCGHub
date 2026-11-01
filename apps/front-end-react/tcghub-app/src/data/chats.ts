// Placeholder conversations until the backend has a messages endpoint.
// Both the Messages tab and the chat screen read from here.

export type ChatMessage = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
};

export type Chat = {
  id: string;
  name: string;
  initials: string;
  distance: string;
  cardName: string;
  cardColor: string;
  cardDetail: string;
  unread: boolean;
  lastTime: string;
  messages: ChatMessage[];
};

export const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Sean S.',
    initials: 'SS',
    distance: '1.2 km away',
    cardName: 'The One Ring',
    cardColor: '#6E5A2E',
    cardDetail: 'Near mint · Trade',
    unread: true,
    lastTime: '2m',
    messages: [
      { id: 'm1', fromMe: true, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?', time: '3:41 pm' },
      { id: 'm2', fromMe: false, text: 'Sed do eiusmod tempor incididunt ut labore.', time: '3:44 pm' },
      { id: 'm3', fromMe: true, text: 'Ut enim ad minim veniam, quis nostrud exercitation.', time: '3:46 pm' },
      { id: 'm4', fromMe: false, text: 'Duis aute irure dolor in reprehenderit?', time: '3:53 pm' },
    ],
  },
  {
    id: '2',
    name: 'Lucas Z.',
    initials: 'LZ',
    distance: '2.8 km away',
    cardName: 'Orcish Bowmasters',
    cardColor: '#3B3550',
    cardDetail: 'Lightly played · Sell',
    unread: false,
    lastTime: '1h',
    messages: [
      { id: 'm1', fromMe: false, text: 'Lorem ipsum dolor sit amet?', time: '2:10 pm' },
      { id: 'm2', fromMe: true, text: 'Consectetur adipiscing elit, sed do eiusmod.', time: '2:15 pm' },
    ],
  },
];

// How many chats have unread messages, this will show up on tabs
export const unreadCount = CHATS.filter((chat) => chat.unread).length;