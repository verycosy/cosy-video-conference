import { createWorker } from 'mediasoup';
import { RtpCodecCapability, Worker } from 'mediasoup/lib/types';

export class MyWorker {
  static mediaCodecs: RtpCodecCapability[] = [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
    },
  ];

  static async createWorker() {
    const worker = await createWorker({
      logLevel: 'warn',
    });

    worker.on('died', () => {
      console.error(`Mediasoup workder pid#${worker.pid} died`);
    });

    return worker;
  }

  static async createRouter(worker: Worker) {
    return await worker.createRouter({
      mediaCodecs: MyWorker.mediaCodecs,
    });
  }
}
