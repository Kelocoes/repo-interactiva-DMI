import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StoreEntity } from './entities/store.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StoresGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Conexión en tiempo real establecida
  }

  handleDisconnect(client: Socket) {
    // Cliente desconectado
  }

  /**
   * Notifica a todos los clientes conectados que se creó una nueva tienda
   */
  broadcastStoreCreated(store: StoreEntity) {
    if (this.server) {
      this.server.emit('store:created', store);
    }
  }

  /**
   * Notifica a todos los clientes conectados la actualización atómica de likes
   */
  broadcastStoreLiked(payload: { id: string; likes: number }) {
    if (this.server) {
      this.server.emit('store:liked', payload);
    }
  }
}
