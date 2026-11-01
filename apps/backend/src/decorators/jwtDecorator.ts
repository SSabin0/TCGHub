import NotFoundError from '@/errortypes/NotFoundError.js';
import Facade from '@/services/facade.js';
import { UserJwt } from '@/types/JWTObject.js';
import type { UserJwtType } from '@/types/JWTObject.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

declare module 'fastify' {
  interface FastifyInstance {
    jwt_verify(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

export default function registerJwtDecorator(fastify: FastifyInstance) {
  fastify.decorate('jwt_verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }

    const jwt: UserJwtType = UserJwt.parse(request.user);
    let user;
    try {
      user = await facade.getUserWithChats(jwt.userId);
    } catch (error) {
      /* c8 ignore else */
      if (error instanceof NotFoundError) {
        return reply.code(401).send({ error: 'User Not Found' });
      } else {
        throw error;
      }
    }
  });
}
