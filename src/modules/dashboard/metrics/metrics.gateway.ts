import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/metrics',
})
export class MetricsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Websocket initialized');
  }

  public emitMetricsUpdate(data: any) {
    this.server.emit('metrics:update', data);
  }
}
