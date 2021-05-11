import { Device } from 'mediasoup-client';
import { RtpCapabilities, TransportOptions } from 'mediasoup-client/lib/types';
import { socket } from './PromisifySocket';

export async function getWebCamTrack() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  const track = stream.getVideoTracks()[0];

  return track;
}

export async function loadMyDevice(routerRtpCapabilities: RtpCapabilities) {
  const device = new Device();
  await device.load({ routerRtpCapabilities });

  return device;
}

export async function createProducerTransport(device: Device) {
  const data = await socket.request<TransportOptions>(
    'createProducerTransport'
  );

  const transport = device
    .createSendTransport(data)
    .on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await socket.request('connectProducerTransport', { dtlsParameters });
        callback();
      } catch (err) {
        errback(err);
      }
    })
    .on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const result = await socket.request<{ id: string }>('produce', {
          transportId: transport.id,
          kind,
          rtpParameters,
        });

        callback(result);
      } catch (err) {
        errback(err);
      }
    })
    .on('connectionstatechange', (state) => {
      console.log(state);
    });

  return transport;
}
