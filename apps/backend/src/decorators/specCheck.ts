import type { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    specViolations: string[];
  }
}
export default function specCheckPlugin(fastify: FastifyInstance) {
  const violations: string[] = [];
  fastify.decorate('specViolations', violations);

  fastify.addHook('onSend', async (req, reply, payload) => {
    const declared = Object.keys(req.routeOptions.schema?.response ?? {});
    const code = String(reply.statusCode);
    const ok =
      declared.includes(code) || declared.includes(`${code[0]}xx`) || declared.includes('default');

    if (!ok) {
      violations.push(
        `${req.method} ${req.routeOptions.url} returned ${code}, declared: [${declared.join(', ')}]`,
      );
    }
    return payload;
  });
}
