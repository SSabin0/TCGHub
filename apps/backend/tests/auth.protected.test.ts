import { LightMyRequestResponse } from 'fastify';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import {
  createUser,
  invalidUserAccessToken,
  userOne,
  userOneHash,
  userOnePassword,
} from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('/api/v1/auth/protected', () => {
  beforeEach(async () => {
    await createUser({ ...userOne, hash: userOneHash });
  });

  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('accepts a valid access token', async () => {
    // TODO: figure out better way of testing jwt verification that doesnt rely on other endpoints
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
        password: userOnePassword,
      },
    });
    const payload = await response.json();
    const accessToken = payload['accessToken'];

    const protectedResponse: LightMyRequestResponse = await server.inject({
      method: 'get',
      url: '/api/v1/auth/protected',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const protectedPayload = await protectedResponse.json();

    expect(protectedResponse.statusCode).toBe(200);
    expect(protectedPayload).toMatchObject({
      success: 'verified and logged in',
    });
  });

  it('rejects an invalid access token', async () => {
    // TODO: better placement or replacement for access_token
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAxYTEwMDBmLTlmOTMtNzM0NC1hMzE5LWRkNjIyMGRjOGExNiIsImlhdCI6MTc5MTAwMjM4Nn0.V8vyggGJ4fgFl24zezk5FA0aAYfg1tlJKzGKko-O_xg';
    const protectedResponse: LightMyRequestResponse = await server.inject({
      method: 'get',
      url: '/api/v1/auth/protected',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const protectedPayload = await protectedResponse.json();

    expect(protectedResponse.statusCode).toBe(401);
    expect(protectedPayload).toMatchObject({
      statusCode: 401,
      code: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
      error: 'Unauthorized',
      message: 'Authorization token is invalid: The token signature is invalid.',
    });
  });
});
