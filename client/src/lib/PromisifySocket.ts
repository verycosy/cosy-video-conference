import { Manager } from 'socket.io-client';

class PromisifySocket extends Manager {
  constructor(url: string) {
    super(url, { transports: ['websocket'] });
  }

  request<T>(messageType: string, data?: any) {
    return new Promise<T>((resolve, _) => {
      this.socket('/').emit(messageType, data, resolve);
    });
  }
}

export const socket = new PromisifySocket('http://localhost:5000');
