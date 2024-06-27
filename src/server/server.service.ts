import { Injectable } from '@nestjs/common';
import { Socket, Server } from "socket.io";
import { MoveDto } from './dto/move.dto';
import { UserItemDto } from './dto/user.item.dto';

@Injectable()
export class ServerService {
    users: UserItemDto[] = [];

    connected(client: Socket, server: Server) {
        this.users.push({
            id: client.id,
            x: 0,
            y: 0
        });
        this.notify(server);
    }

    disconnected(client: Socket, server: Server) {
        this.users.filter(item => item.id !== client.id);
        this.notify(server);
    }

    move(client: Socket, server: Server, args: MoveDto) {
        const foundClient = this.users.findIndex(item => item.id === client.id);
        if (foundClient !== -1) args.vertical
            ? this.users[foundClient].y += args.increment ? 1 : -1
            : this.users[foundClient].x += args.increment ? 1 : -1;
        this.notify(server);
    }

    notify(server: Server) {
        server.emit("notify", this.users);
    }
}
