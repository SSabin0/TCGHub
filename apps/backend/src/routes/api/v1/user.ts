import Fastify from 'fastify';
import { UserIdParamsSchema, type UserIdParamsInterface } from './routeSchemas.js';
import UserController from '@/controllers/userController.js';
export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new UserController();

  fastify.get<{ Params: UserIdParamsInterface }>(
    '/:userId',
    {
      schema: {
        params: UserIdParamsSchema,
        response: {
          503: {
            description: 'Service Unavailable',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.getUserDetails,
  );

  fastify.patch<{ Body: {}; Params: UserIdParamsInterface }>(
    '/:userId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: UserIdParamsSchema,
        body: {},
        response: {
          503: {
            description: 'Service Unavailable',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.updateUserDetails,
  );

  fastify.delete<{ Body: {}; Params: UserIdParamsInterface }>(
    '/:userId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: UserIdParamsSchema,
        body: {},
        response: {
          503: {
            description: 'Service Unavailable',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.deleteUser,
  );
}
