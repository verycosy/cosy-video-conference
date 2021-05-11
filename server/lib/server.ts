import * as mediasoup from 'mediasoup';
import { Producer, Transport } from 'mediasoup/lib/types';
import { Server as SocketIO, Socket } from 'socket.io';
import express, { Application } from 'express';
import http, { Server } from 'http';
import { MyWorker } from './my-worker';

export class WebServer {
  private app: Application;
  private port: number;
  private webServer: Server;
  private io: SocketIO;

  private myWorker: MyWorker;
  private producerTransport: Transport;
  private producer: Producer;

  constructor(port = 5000) {
    this.port = port;
    this.app = express();
    this.webServer = http.createServer(this.app);
    this.io = new SocketIO(this.webServer);
    this.io.on('connection', this.socketEvent);
  }

  private socketEvent = (socket: Socket) => {
    console.log('Client connected :)');

    socket.on('getCapabilities', (data, callback) => {
      callback(this.myWorker.router.rtpCapabilities);
    });

    socket.on('createProducerTransport', async (data, callback) => {
      try {
        const { transport, params } =
          await this.myWorker.createWebRtcTransport();
        this.producerTransport = transport;
        callback(params);
      } catch (err) {
        console.error(err);
        callback(err.message);
      }
    });

    socket.on('connectProducerTransport', async (data, callback) => {
      await this.producerTransport.connect({
        dtlsParameters: data.dtlsParameters,
      });
      callback();
    });

    socket.on('produce', async (data, callback) => {
      const { kind, rtpParameters } = data;
      this.producer = await this.producerTransport.produce({
        kind,
        rtpParameters,
      });
      callback({ id: this.producer.id });

      //TODO: broadcast
    });
  };

  run() {
    this.webServer.listen(this.port, async () => {
      const mediaSoupWorker = await mediasoup.createWorker({
        logLevel: 'warn',
      });

      this.myWorker = new MyWorker(mediaSoupWorker);
      await this.myWorker.createRouter();

      console.log(`Server running on localhost:${this.port}`);
    });
  }
}
