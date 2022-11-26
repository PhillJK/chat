export interface User {
    id: number;
    name: string;
}

export interface Chat {
    id: number;
    participants: User[];
}
