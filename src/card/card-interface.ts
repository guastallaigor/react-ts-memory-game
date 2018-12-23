export interface ICardInterface {
    imageUrl: string;
    id: number;
    onTurn:(id?: number) => void;
    isTurned: boolean;
}