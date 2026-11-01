import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, afterEach } from 'vitest';
import { ENV } from '../src/utils/env.js';
import {
  createUser,
  userOne,
  userOneHash,
  userOnePassword,
  userTwo,
  userTwoPassword,
} from './helpers/userPresets.js';
import { prisma } from '../src/utils/prisma.js';
import { AuthSignupBody } from '../src/routes/api/v1/routeSchemas.js';
import { verifyPassword } from '../src/utils/hashing.js';

const server = await buildServer({}, ENV);

describe('/api/v1/auth/signup', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('creates user with valid details', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: { ...userOne, password: userOnePassword },
    });
    const payload = await response.json();
    const databaseUser = await prisma.user.findUnique({
      where: {
        username: userOne.username,
      },
    });
    if (databaseUser === null) {
      throw new Error('user not in database');
    }

    expect(response.statusCode).toBe(201);
    expect(payload).toMatchObject({ success: 'Account creation successful' });
    expect(databaseUser).toMatchObject({
      username: userOne.username,
      email: userOne.email,
      first_name: userOne.first_name,
      last_name: userOne.last_name,
    });
    expect(await verifyPassword(databaseUser.hash, userOnePassword));
  });

  it('blocks signup with used email', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const requestPayload: AuthSignupBody = {
      ...userTwo,
      password: userTwoPassword,
      email: userOne.email,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(409);
    expect(responsePayload).toMatchObject({ error: 'Email already registered' });
  });

  it('blocks signup with used username', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    const requestPayload: AuthSignupBody = {
      ...userTwo,
      password: userTwoPassword,
      username: userOne.username,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(409);
    expect(responsePayload).toMatchObject({ error: 'Username already registered' });
  });
});
