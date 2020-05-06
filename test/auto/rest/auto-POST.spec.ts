/* globals describe, expect, test, beforeAll, afterAll */

import { AutoArt } from '../../../src/auto/entity';
import type { Auto } from '../../../src/auto/entity/types';
import { HttpStatus } from '../../../src/shared';
import { PATHS } from '../../../src/app';
import type { Server } from 'http';
import chai from 'chai';
import { createTestserver } from '../../createTestserver';
import request from 'supertest';

const { expect } = chai;

// startWith(), endWith()
import('chai-string').then(chaiString => chai.use(chaiString.default));

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const neuesAuto: Auto = {
    marke: 'Neu',
    modell: 'Neu-Klasse',
    art: AutoArt.PKW,
    preis: 99.99,
    sitze: 0.099,
    lieferbar: true,
    lieferdatum: '2016-02-28',
    fahrgestellnummer: '0-0070-0644-6',
    homepage: 'https://test.de/',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
    vorbesitzer: [{ nachname: 'Test', vorname: 'Theo' }],
};
const neuesAutoInvalid: object = {
    marke: 'Blabla',
    modell: '',
    art: 'UNSICHTBAR',
    preis: 0,
    sitze: 0,
    lieferbar: true,
    lieferdatum: '2016-02-01',
    fahrgestellnummer: '%%%',
    vorbesitzer: [{ nachname: 'Test', vorname: 'Theo' }],
    schlagwoerter: [],
};
const neuesAutoMarkeExistiert: Auto = {
    marke: 'Alpha',
    modell: 'S-Klasse',
    art: AutoArt.LKW,
    preis: 99.99,
    sitze: 0.099,
    lieferbar: true,
    lieferdatum: '2016-02-28',
    fahrgestellnummer: '0-0070-9732-8',
    vorbesitzer: [{ nachname: 'Test', vorname: 'Theo' }],
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};

const loginDaten: object = {
    username: 'admin',
    password: 'p',
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
const path = PATHS.autos;
const loginPath = PATHS.login;
let server: Server;

// Test-Suite
describe('POST /autos', () => {
    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => (server = await createTestserver()));

    afterAll(async () => {
        server.close();
        // "open handle error (TCPSERVERWRAP)" bei Supertest mit Jest vermeiden
        // https://github.com/visionmedia/supertest/issues/520
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // eslint-disable-line @typescript-eslint/no-magic-numbers
    });

    test('Neues Auto', async () => {
        // given: neuesAuto
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, header } = response;
        expect(status).to.be.equal(HttpStatus.CREATED);

        const { location } = header;
        expect(location).to.exist;
        expect(typeof location === 'string').to.be.true;
        expect(location).not.to.be.empty;

        // UUID: Muster von HEX-Ziffern
        const indexLastSlash: number = location.lastIndexOf('/');
        const idStr = location.slice(indexLastSlash + 1);

        expect(idStr).to.match(
            // eslint-disable-next-line max-len
            /[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}/u,
        );
    });

    test('Neues Auto mit ungueltigen Daten', async () => {
        // given: neuesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAutoInvalid)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.BAD_REQUEST);
        const { art, modell } = body;

        expect(art).to.be.equal('Die Art eines Autoes muss PKW oder LKW sein.');
        expect(modell).to.endWith('eine gueltige Bewertung.');
    });

    test('Neues Auto, aber der Marke existiert bereits', async () => {
        // given: neuesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAutoMarkeExistiert)
            .trustLocalhost();

        // then
        const { status, text } = response;
        expect(status).to.be.equal(HttpStatus.BAD_REQUEST);
        expect(text).has.string('Marke');
    });

    test('Neues Auto, aber ohne Token', async () => {
        // given: neuesAuto

        // when
        const response = await request(server)
            .post(path)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });

    test('Neues Auto, aber mit falschem Token', async () => {
        // given: neuesAuto
        const falscherToken = 'x';

        // when
        const response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${falscherToken}`)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });

    // test.todo('Test mit abgelaufenem Token');
});
