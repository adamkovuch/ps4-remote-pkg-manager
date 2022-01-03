export interface AppSettings {
    connection: {
        interface: string;
        httpPort: number;
        torrentPath?: string;
    };

    lastIp?: string;
}