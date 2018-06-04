#!/usr/bin/env node

'use strict';

var express = require('express');
var logger = require('winston');

const DEFAULT_PORT = 8080;

class VisualizationServer {
  constructor(port) {
    this.port = port || DEFAULT_PORT;
    this.app = express();
  }

  start() {
    this.app.use(express.static('.'));
    this.app.listen(this.port);
    logger.info('===== VisualizationServer: started listening.');
  }
}

module.exports = {
  VisualizationServer
};

const server = new VisualizationServer();
server.start();
