import { Router, Worker } from 'mediasoup/lib/types';
import { Server as SocketIO, Socket } from 'socket.io';
import express, { Application } from 'express';
import http, { Server } from 'http';
import { MyWorker } from './my-worker';

export class WebServer {
  private app: Application;
  private port: number;
  private webServer: Server;
  private io: SocketIO;

  private worker: Worker;
  private router: Router;

  constructor(port = 5000) {
    this.port = port;
    this.app = express();
    this.webServer = http.createServer(this.app);
    this.io = new SocketIO(this.webServer);
    this.io.on('connection', this.socketEvent);
  }

  private socketEvent = (socket: Socket) => {
    console.log('Client connected :)');

    socket.on('getCapabilities', (data, cb) => {
      cb(this.router.rtpCapabilities);
    });
  };

  run() {
    this.webServer.listen(this.port, async () => {
      this.worker = await MyWorker.createWorker();
      this.router = await MyWorker.createRouter(this.worker);

      console.log(`Server running on localhost:${this.port}`);
    });
  }
}
