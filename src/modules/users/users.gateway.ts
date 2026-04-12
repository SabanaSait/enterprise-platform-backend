import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersWSEvent } from './types/user.types';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/users',
})
export class UsersGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('Users websocket initialized');
  }

  public emitUsersUpdate(event: UsersWSEvent) {
    this.server.emit('users:update', event);
  }
}
