export enum PkgTaskSoruce {
    file = 'File',
    torrent = 'Torrent',
    link = 'Link',
}

export interface PkgTask {
    taskId: number;
    name: string;
    source: PkgTaskSoruce,
    progress: number;
}