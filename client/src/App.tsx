import { RtpCapabilities } from 'mediasoup-client/lib/types';
import { socket } from './lib/PromisifySocket';
import {
  createProducerTransport,
  getWebCamTrack,
  loadMyDevice,
} from './lib/utils';

async function main() {
  try {
    const rtpCapabilties = await socket.request<RtpCapabilities>(
      'getCapabilities'
    );
    const device = await loadMyDevice(rtpCapabilties);
    const transport = await createProducerTransport(device);

    const params = { track: await getWebCamTrack() };
    const producer = await transport.produce(params);
    console.log(producer);
  } catch (err) {
    console.error(err);
  }
}

main();

function App() {
  return <div>Hello, Mediasoup!</div>;
}

export default App;
