const http = require("http");
const { app } = require("./app");
const { initSocket } = require("./sockets/socket");
const { PORT } = require("./utils/constants");

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});