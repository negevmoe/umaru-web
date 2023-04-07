export interface Character {
    images: CharacterImages;
    name: string;
    relation: string;
    actors: CharacterActors[];
    type: number;
    id: number;
}

export interface CharacterImages {
    small: string;
    grid: string;
    large: string;
    medium: string;
}

export interface CharacterActors {
    images: CharacterImages;
    name: string;
    short_summary: string;
    career: string[];
    id: number;
    type: number;
    locked: boolean;
}
