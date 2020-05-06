import { AutoArt } from '../../entity';
import type { AutoData } from '../../entity/types';

export const auto: AutoData = {
    _id: '00000000-0000-0000-0000-000000000001',
    marke: 'Alpha',
    modell: 'Alpha-Modell',
    art: AutoArt.PKW,
    preis: 11.1,
    sitze: 0.011,
    lieferbar: true,
    lieferdatum: new Date('2018-02-01T00:00:00.000Z'),
    fahrgestellnummer: '000-0-00000-000-1',
    homepage: 'https://acme.at/',
    schlagwoerter: ['JAVASCRIPT'],
    vorbesitzer: [
        {
            nachname: 'Alpha',
            vorname: 'Adriana',
        },
        {
            nachname: 'Alpha',
            vorname: 'Alfred',
        },
    ],
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
};

export const autos: Array<AutoData> = [
    auto,
    {
        _id: '00000000-0000-0000-0000-000000000002',
        marke: 'Beta',
        modell: 'Beta-Model',
        art: AutoArt.PKW,
        preis: 22.2,
        sitze: 0.022,
        lieferbar: true,
        lieferdatum: new Date('2018-02-02T00:00:00.000Z'),
        fahrgestellnummer: '000-0-00000-000-2',
        homepage: 'https://acme.biz/',
        schlagwoerter: ['TYPESCRIPT'],
        vorbesitzer: [
            {
                nachname: 'Beta',
                vorname: 'Brunhilde',
            },
        ],
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
    },
];
