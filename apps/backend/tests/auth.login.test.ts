import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ENV } from '../src/utils/env.js';
import {
  badEmail,
  createUser,
  invalidUser,
  invalidUserPassword,
  userOne,
  userOneHash,
  userOnePassword,
} from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await createUser({ ...userOne, hash: userOneHash });
  });

  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('accepts valid credentials', async () => {
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

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('accessToken');
  });

  it('rejects invalid credentials', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUser.email,
        password: invalidUserPassword,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });

  it('rejects payload without email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        password: userOnePassword,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'email'",
    });
  });

  it('rejects payload with bad email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: badEmail,
        password: userOnePassword,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/email must match format "email"',
    });
  });

  it('rejects payload with invalid email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUser.email,
        password: userOnePassword,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });

  it('rejects payload without password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'password'",
    });
  });

  it('rejects payload with invalid password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
        password: invalidUserPassword,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });
});
