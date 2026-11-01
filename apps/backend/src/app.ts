import Fastify from 'fastify';
import fastify_jwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import authRoutes from '@/routes/api/v1/auth.js';
import userRoutes from '@/routes/api/v1/user.js';
import cardRoutes from '@/routes/api/v1/cards.js';
import chatRoutes from '@/routes/api/v1/chats.js';
import specCheckPlugin from './decorators/specCheck.js';
import registerJwtDecorator from '@/decorators/jwtDecorator.js';
import { validateDatabaseConnection } from '@/utils/validateDatabaseConnection.js';
import type { Env } from '@/utils/env.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
  RawServerDefault,
} from 'fastify';

export default async function buildServer(
  opts = {},
  env: Env,
): Promise<
  FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    FastifyTypeProviderDefault
  >
> {
  const server: Fastify.FastifyInstance = Fastify({
    ...opts,
    ajv: {
      customOptions: {
        coerceTypes: false,
      },
    },
  });

  await server.register(fastifySwagger);
  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  /* c8 ignore next */
  if (process.env.NODE_ENV === 'test') {
    specCheckPlugin(server);
  }
  registerJwtDecorator(server);

  await server.register(fastify_jwt, { secret: env.SERVER_SECRET });
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(userRoutes, { prefix: '/api/v1/user' });
  await server.register(chatRoutes, { prefix: '/api/v1/chats' });
  await server.register(cardRoutes, { prefix: '/api/v1/cards' });
  await server.register(cardRoutes, { prefix: '/api/v1/:id' });

  await validateDatabaseConnection();
  return server;
}
