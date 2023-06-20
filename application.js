const express = require('express');
const cluster = require('cluster');
const path = require('path');
const os = require('os');
const http = require("http");
const https = require("https"),
  fs = require("fs");
const credentials = {
  key: fs.readFileSync("/etc/letsencrypt/live/maro.skyblockextras.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/maro.skyblockextras.com/fullchain.pem")
};

const app = express();

const ValidateBody = require('./middleware/validateBody');
const ErrorHandler = require('./middleware/errorHandler');
const NotFound = require('./middleware/notFound');
const Auctions = require('./routes/auctions');
const Bazaar = require('./routes/bazaar');
const Networth = require('./routes/networth');
const Leaderboard = require('./routes/leaderboard');
const ForgeProfits = require('./routes/forgeProfits');
const ApiStats = require('./routes/apiStats');

require('./jobs/updateAuctions');
require('./jobs/updateBazaar');

const createCluster = function () {
  const clusters = process.env.CLUSTERS || os.cpus().length;

  console.log(`Booting Maro's API with ${clusters} instances`);

  for (let i = 0; i < clusters; i++) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.id} had a heart attack, starting a new one`);

    cluster.fork();
  });
};

const startWebService = async function () {
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(ValidateBody);
  app.use(ErrorHandler);

  app.use('/api/auctions', Auctions);
  app.use('/api/bazaar', Bazaar);
  app.use('/api/networth', Networth);
  app.use('/api/leaderboard', Leaderboard);
  app.use('/api/forge', ForgeProfits);
  app.use('/api/stats', ApiStats);

  app.use(NotFound);

  // const port = process.env.PORT || 3000;
  // app.listen(port, () => {
  //   console.log(`Worker ${cluster.worker.id} with process id ${process.pid} is now listening on port ${port}`);
  // });
  let httpServer = http.createServer(app);
  let httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443);
  httpServer.listen(8080);
};

if (cluster.isMaster) {
  createCluster();
} else {
  startWebService();
}
