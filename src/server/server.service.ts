import { Injectable } from '@nestjs/common';
import { Socket, Server } from "socket.io";
import { MoveDto } from './dto/move.dto';
import { UserItemDto } from './dto/user.item.dto';

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

@Injectable()
export class ServerService {
    colors = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'brown', 'black', 'orange'];
    users: UserItemDto[] = [];

    connected(client: Socket, server: Server) {
        this.users.push({
            id: client.id,
            x: 0,
            y: 0,
            color: getRandomElement(this.colors)
        });
        this.notify(server);
    }

    disconnected(client: Socket, server: Server) {
        this.users = this.users.filter(item => item.id !== client.id);
        this.notify(server);
    }

    move(client: Socket, server: Server, args: MoveDto) {
        const foundClient = this.users.findIndex(item => item.id === client.id);
        if (foundClient !== -1) args.vertical
            ? this.users[foundClient].y += args.increment ? 20 : -20
            : this.users[foundClient].x += args.increment ? 20 : -20;
        this.notify(server);
    }

    notify(server: Server) {
        server.emit("notify", this.users);
    }
}
