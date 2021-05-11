import { Router, RtpCodecCapability, Worker } from 'mediasoup/lib/types';

export class MyWorker {
  public router: Router;

  constructor(private worker: Worker) {
    this.worker.on('died', () => {
      console.error(`Mediasoup workder pid#${worker.pid} died`);
    });
  }

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

  async createRouter() {
    this.router = await this.worker.createRouter({
      mediaCodecs: MyWorker.mediaCodecs,
    });
  }

  async createWebRtcTransport() {
    const transport = await this.router.createWebRtcTransport({
      listenIps: [{ ip: '127.0.0.1' }],
      enableTcp: true,
      enableUdp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 1000000,
    });

    return {
      transport,
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }
}
