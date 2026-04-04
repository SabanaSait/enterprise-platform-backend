import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MetricsResponse } from './types/metrics.types';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/metrics',
})
export class MetricsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Metrics websocket initialized');
  }

  public emitMetricsUpdate(data: MetricsResponse) {
    this.server.emit('metrics:update', data);
  }
}
