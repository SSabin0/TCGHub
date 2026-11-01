import Fastify from 'fastify';
import AuthController from '@/controllers/authController.js';
import {
  authLoginSchema,
  authSignupSchema,
  type AuthLoginBody,
  type AuthSignupBody,
} from './routeSchemas.js';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new AuthController();

  fastify.post<{ Body: AuthLoginBody }>(
    '/login',
    {
      schema: {
        ...authLoginSchema,
        response: {
          200: {
            description: 'Successful login',
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
            },
          },
          401: {
            description: 'Invalid Credentials',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          400: {
            description: 'Bad Request',
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              code: { type: 'string' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    controller.loginPost,
  );

  fastify.post<{ Body: AuthSignupBody }>(
    '/signup',
    {
      schema: {
        ...authSignupSchema,
        response: {
          201: {
            description: 'Account Creation Successful',
            type: 'object',
            properties: {
              success: { type: 'string' },
            },
          },
          400: {
            description: 'Bad Request',
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              code: { type: 'string' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          409: {
            description: 'Conflict',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.signupPost,
  );

  fastify.get(
    '/protected',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        response: {
          200: {
            description: 'OK',
            type: 'object',
            properties: {
              success: { type: 'string' },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              code: { type: 'string' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    controller.protectedGet,
  );
}
