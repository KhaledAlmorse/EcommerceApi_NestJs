import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from '../Services';
import { Types } from 'mongoose';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealTimeGetway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly tokenService: TokenService) {}
  private clients: Map<string, string> = new Map();

  @WebSocketServer()
  io: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    const accessToken = client.handshake.auth.accessToken;
    const { user } =
      await this.tokenService.ValidateAndVerifyToken(accessToken);
    this.clients.set(user.id.toString(), client.id);
  }

  async handleDisconnect(client: Socket) {
    const accessToken = client.handshake.auth.accessToken;
    const { user } =
      await this.tokenService.ValidateAndVerifyToken(accessToken);
    this.clients.delete(user.id.toString());
  }

  emitProductStockUpdate(productId: Types.ObjectId | string, newStock: number) {
    this.io.emit('product_stock_update', { productId, newStock });
  }
}
