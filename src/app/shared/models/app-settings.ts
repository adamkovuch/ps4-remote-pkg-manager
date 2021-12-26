export interface AppSettings {
    connection: {
        interface: string;
        httpPort: number;
        torrentPath?: string;
        torrentPort: number;
    };

    lastIp?: string;
}