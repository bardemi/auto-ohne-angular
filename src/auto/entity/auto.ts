export enum AutoArt {
    PKW = 'PKW',
    LKW = 'LKW',
}

// gemeinsames Basis-Interface fuer REST und GraphQL
export interface Auto {
    _id?: string;
    __v?: number;
    marke: string;
    modell?: string;
    art?: AutoArt | '';
    preis: number;
    sitze?: number;
    lieferbar?: boolean;
    lieferdatum?: string | Date;
    fahrgestellnummer: string;
    homepage?: string;
    schlagwoerter?: Array<string>;
    vorbesitzer: any;
}

export interface AutoData extends Auto {
    createdAt?: number;
    updatedAt?: number;
    _links?: {
        self?: { href: string };
        list?: { href: string };
        add?: { href: string };
        update?: { href: string };
        remove?: { href: string };
    };
}
