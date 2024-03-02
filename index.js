// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const startDB = require("./helpers/DB");
const userRoutes = require("./routes/user");
fastify.register(startDB);

// Declare a route
// fastify.get("/", function handler(request, reply) {
//   reply.send({ hello: "user" });
// });

userRoutes.forEach((route) => {
  fastify.route(route);
});

// Run the server!
fastify.listen({ port: 3002 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
