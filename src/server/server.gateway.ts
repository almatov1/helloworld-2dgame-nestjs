import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ServerService } from './server.service';
import { Socket, Server } from "socket.io";
import { MoveDto } from './dto/move.dto';

@WebSocketGateway(3002)
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly serverService: ServerService) { }

  handleConnection(client: Socket) {
    this.serverService.connected(client, this.server);
  }

  handleDisconnect(client: Socket) {
    this.serverService.disconnected(client, this.server);
  }

  @SubscribeMessage("move")
  handleMove(client: Socket, args: MoveDto) {
    this.serverService.move(client, this.server, args);
  }
}
