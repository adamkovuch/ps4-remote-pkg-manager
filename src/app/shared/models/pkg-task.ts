import { Observable } from "rxjs";
import { Torrent, TorrentFile } from "webtorrent";

export enum PkgTaskSource {
    file = 'File',
    torrent = 'Torrent',
    link = 'Link',
}

export interface PkgTask {
    name: string;
    source: PkgTaskSource;
    link: string;
    size?: string;
    torrentData?: {
        torrent: Torrent;
        torrentFile: TorrentFile;
        progress$: Observable<string>;
    }
}