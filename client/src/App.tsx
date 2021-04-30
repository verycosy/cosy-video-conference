import io from 'socket.io-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.emit('getCapabilities', {}, (data: RtpCapabilities) => {
  console.log(data);
});

function App() {
  return <div>Hello, Mediasoup!</div>;
}

export default App;
