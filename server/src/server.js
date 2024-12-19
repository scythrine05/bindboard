const http = require("http");
const { app } = require("./app");
const { initSocket } = require("./sockets/socket");
const { PORT } = require("./utils/constants");

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port: ${PORT}`);
});
