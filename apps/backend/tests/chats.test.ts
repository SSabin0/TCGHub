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
import { ChatDetailsInterface, createChats } from './helpers/chatPresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('returns chats user is part of', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const createChatsInput: Array<ChatDetailsInterface> = [
      { title: 'chatOne', type: 'DIRECT', memberIDs: [userOne.id, userTwo.id] },
      { title: 'chatTwo', type: 'DIRECT', memberIDs: [userOne.id, userTwo.id] },
      { title: 'chatThree', type: 'GROUP', memberIDs: [userOne.id, userTwo.id] },
    ];
    const savedChats = await createChats(createChatsInput);

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/chats/',
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload: Array<{}> = await response.json();

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveLength(createChatsInput.length);
    payload.forEach((x, idx) => {
      expect(x).toEqual({
        id: savedChats[idx].id,
        type: createChatsInput[idx].type,
        title: createChatsInput[idx].title,
        created_at: savedChats[idx].created_at.toISOString(),
        members: createChatsInput[idx].memberIDs,
        last_read_message_id: null,
        joined_at: expect.any(String),
      });
    });
  });

  it('hadles request from a user that no longer exists', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/chats',
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

describe('POST /api/v1/chats', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('lets a logged in user create a chat', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/chats/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        title: 'test Chat',
        type: 'DIRECT',
        members: [],
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(201);
    expect(payload).toHaveProperty('chatID');
    expect(payload).toMatchObject({
      success: 'Chat created',
    });
  });
});

describe('DELETE /api/v1/chats/', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('returns service unavailable', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/v1/chats/',
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(503);
    // expect(payload).toMatchObject({
    // error: 'not implemented yet',
    // });
  });
});
