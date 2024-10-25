const http = require("http");
const { app } = require("./src/app");
const { initSocket } = require("./src/sockets/socket");
const { PORT } = require("./src/utils/constants");

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});