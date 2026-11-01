import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import {
  createUser,
  invalidUserAccessToken,
  userOne,
  userOneAccessToken,
  userOneHash,
  userTwo,
  userTwoHash,
} from './helpers/userPresets.js';
import { createChat } from './helpers/chatPresets.js';
import { createMessages } from './helpers/messagePresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats/:chatId/messages', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('returns all messages in a chat for a logged in user', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const chat = await createChat('chatOne', 'DIRECT', [userOne.id, userTwo.id]);
    const messages = [
      { sender_id: userOne.id, body: 'this is a message' },
      { sender_id: userTwo.id, body: 'message two' },
      { sender_id: userOne.id, body: 'and another' },
    ];
    await createMessages(chat.id, messages);

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${chat.id}/messages`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject({
      messages: messages.map((x) => {
        return { ...x, chat_id: chat.id };
      }),
    });
  });

  it("handles request for chats that don\'t exist", async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const invalidChatId = 'helloworld';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${invalidChatId}/messages`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(404);
    expect(payload).toMatchObject({
      error: 'Chat not found',
    });
  });

  it('hadles request from a user that no longer exists', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const chat = await createChat('chatOne', 'DIRECT', [userOne.id, userTwo.id]);
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${chat.id}/messages`,
      headers: {
        Authorization: `Bearer ${invalidUserAccessToken}`,
      },
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'User Not Found',
    });
  });
});

describe('POST /api/v1/chats/:chatId/messages', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('lets logged in member send a message', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const chat = await createChat('chatOne', 'DIRECT', [userOne.id, userTwo.id]);
    const messageText = 'this is a message';
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: `/api/v1/chats/${chat.id}/messages`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        body: messageText,
      },
    });

    const payload = await response.json();
    // TODO: deal with this later
    // const databaseMessage = prisma.message.findUnique({
    //   where: {

    //   }
    // })
    expect(response.statusCode).toBe(201);
    expect(payload).toMatchObject({
      success: 'message sent',
    });
  });

  it("handles sending a message to a chat that doesn't exist", async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const messageText = 'this is a message';
    const invalidChatId = 'helloworld';
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: `/api/v1/chats/${invalidChatId}/messages`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        body: messageText,
      },
    });

    const payload = await response.json();
    expect(response.statusCode).toBe(404);
    expect(payload).toMatchObject({
      error: 'Chat not found',
    });
  });
});
