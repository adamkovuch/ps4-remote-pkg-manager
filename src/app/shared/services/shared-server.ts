import { Server } from "http";

export abstract class SharedServer {
    protected server: Server;

    protected abstract get port(): number;
    protected abstract get inteface(): string;

    startServer() {
        if(this.server && !this.server.listening) {
            this.server.listen(this.port, this.inteface);
            console.log(`Http server started on port ${this.port}`);
        }
    }

    stopServer() {
        if(this.server && this.server.listening) {
            this.server.close();
            console.log(`Http server stopped on port ${this.port}`);
        }
    }
}