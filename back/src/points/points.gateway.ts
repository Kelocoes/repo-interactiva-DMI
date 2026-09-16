import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PointsService } from './points.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PointsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly pointsService: PointsService) {}

  async handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado por WebSocket: ${client.id}`);
    const points = await this.pointsService.findAll();
    client.emit('allPoints', points);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('addPoint')
  async handleAddPoint(
    @MessageBody()
    data: {
      lat: number;
      lng: number;
      title?: string;
      description?: string;
      color?: string;
      icon?: string;
    },
  ) {
    console.log('📍 Nuevo punto con icono recibido:', data);
    const savedPoint = await this.pointsService.create(data);

    // Emitir a todos los clientes conectados
    this.server.emit('newPoint', savedPoint);
    return savedPoint;
  }

  @SubscribeMessage('clearPoints')
  async handleClearPoints() {
    await this.pointsService.clearAll();
    this.server.emit('pointsCleared');
  }
}
