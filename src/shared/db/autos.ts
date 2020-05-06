/*
 * Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export const autos = [
    {
        _id: '00000000-0000-0000-0000-000000000001',
        marke: 'Alpha',
        modell: 'Alpha-Modell',
        art: 'LKW',
        preis: 11.1,
        sitze: 0.011,
        lieferbar: true,
        // https://docs.mongodb.com/manual/reference/method/Date
        lieferdatum: new Date('2019-02-01'),
        fahrgestellnummer: '978-3897225831',
        homepage: 'https://acme..at/',
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
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000002',
        marke: 'Beta',
        modell: 'Beta-Modell',
        art: 'PKW',
        preis: 22.2,
        sitze: 0.022,
        lieferbar: true,
        lieferdatum: new Date('2019-02-02'),
        fahrgestellnummer: '978-3827315526',
        homepage: 'https://acme..biz/',
        schlagwoerter: ['TYPESCRIPT'],
        vorbesitzer: [
            {
                nachname: 'Beta',
                vorname: 'Brunhilde',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000003',
        marke: 'Gamma',
        modell: 'Gamma-Modell',
        art: 'LKW',
        preis: 33.3,
        sitze: 0.033,
        lieferbar: true,
        lieferdatum: new Date('2019-02-03'),
        fahrgestellnummer: '978-0201633610',
        homepage: 'https://acme.com/',
        schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
        vorbesitzer: [
            {
                nachname: 'Gamma',
                vorname: 'Claus',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000004',
        marke: 'Delta',
        modell: 'Delta-Modell',
        art: 'LKW',
        preis: 44.4,
        sitze: 0.044,
        lieferbar: true,
        lieferdatum: new Date('2019-02-04'),
        fahrgestellnummer: '978-0387534046',
        homepage: 'https://acme.de/',
        schlagwoerter: [],
        vorbesitzer: [
            {
                nachname: 'Delta',
                vorname: 'Dieter',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000005',
        marke: 'Epsilon',
        modell: 'Epsilon-Modell',
        art: 'PKW',
        preis: 55.5,
        sitze: 0.055,
        lieferbar: true,
        lieferdatum: new Date('2019-02-05'),
        fahrgestellnummer: '978-3824404810',
        homepage: 'https://acme.es/',
        schlagwoerter: ['TYPESCRIPT'],
        vorbesitzer: [
            {
                nachname: 'Epsilon',
                vorname: 'Elfriede',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
];
