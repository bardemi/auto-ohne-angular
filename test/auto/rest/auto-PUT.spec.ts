/* globals describe, expect, test, beforeAll, afterAll */

import { AutoArt } from '../../../src/auto/entity';
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
const geaendertesAuto: object = {
    // fahrgestellnummer wird nicht geaendet
    marke: 'Geaendert',
    modell: 'S-Klasse',
    art: AutoArt.PKW,
    preis: 33.33,
    sitze: 0.033,
    lieferbar: true,
    lieferdatum: '2016-02-03',
    homepage: 'https://test.te',
    vorbesitzer: [{ nachname: 'Gamma', vorname: 'Claus' }],
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};
const idVorhanden = '00000000-0000-0000-0000-000000000003';

const geaendertesAutoIdNichtVorhanden: object = {
    marke: 'Nichtvorhanden',
    modell: 'S-Klasse',
    art: AutoArt.PKW,
    preis: 33.33,
    sitze: 0.033,
    lieferbar: true,
    lieferdatum: '2016-02-03',
    vorbesitzer: [{ nachname: 'Gamma', vorname: 'Claus' }],
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};
const idNichtVorhanden = '00000000-0000-0000-0000-000000000999';

const geaendertesAutoInvalid: object = {
    marke: 'Alpha',
    modell: 'X',
    art: 'UNSICHTBAR',
    preis: -0.01,
    sitze: 0,
    lieferbar: true,
    lieferdatum: '2016-02-01',
    fahrgestellnummer: 0,
    vorbesitzer: [{ nachname: 'Test', vorname: 'Theo' }],
    schlagwoerter: [],
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
describe('PUT /autos/:id', () => {
    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => (server = await createTestserver()));

    afterAll(async () => {
        server.close();
        // "open handle error (TCPSERVERWRAP)" bei Supertest mit Jest vermeiden
        // https://github.com/visionmedia/supertest/issues/520
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // eslint-disable-line @typescript-eslint/no-magic-numbers
    });

    test('Vorhandenes Auto aendern', async () => {
        // given: geaendertesAuto
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('Authorization', `Bearer ${token}`)
            .set('If-Match', '"0"')
            .send(geaendertesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.NO_CONTENT);
        expect(Object.entries(body)).to.be.empty;
    });

    test('Nicht-vorhandenes Auto aendern', async () => {
        // given: geaendertesAutoIdNichtVorhanden
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .put(`${path}/${idNichtVorhanden}`)
            .set('Authorization', `Bearer ${token}`)
            .set('If-Match', '"0"')
            .send(geaendertesAutoIdNichtVorhanden)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.PRECONDITION_FAILED);
        expect(Object.entries(body)).to.be.empty;
    });

    test('Vorhandenes Auto aendern, aber mit ungueltigen Daten', async () => {
        // given: geaendertesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('Authorization', `Bearer ${token}`)
            .set('If-Match', '"0"')
            .send(geaendertesAutoInvalid)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.BAD_REQUEST);
        const { art, fahrgestellnummer } = body;

        expect(art).to.be.equal('Die Art eines Autoes muss PKW oder LKW sein.');
        expect(fahrgestellnummer).to.endWith(
            'eine gueltige FAHRGESTELLNUMMER-Nummer.',
        );
    });

    test('Vorhandenes Auto aendern, aber ohne Versionsnummer', async () => {
        // given: geaendertesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'text/plain')
            .send(geaendertesAuto)
            .trustLocalhost();

        // then
        const { status, text } = response;
        expect(status).to.be.equal(HttpStatus.PRECONDITION_REQUIRED);
        expect(text).to.be.equal('Versionsnummer fehlt');
    });

    test('Vorhandenes Auto aendern, aber mit alter Versionsnummer', async () => {
        // given: geaendertesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('Authorization', `Bearer ${token}`)
            .set('If-Match', '"-1"')
            .set('Accept', 'text/plain')
            .send(geaendertesAuto)
            .trustLocalhost();

        // then
        const { status, text } = response;
        expect(status).to.be.equal(HttpStatus.PRECONDITION_FAILED);
        expect(text).to.have.string('Die Versionsnummer');
    });

    test('Vorhandenes Auto aendern, aber ohne Token', async () => {
        // given: geaendertesAuto

        // when
        const response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('If-Match', '"0"')
            .send(geaendertesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });

    test('Vorhandenes Auto aendern, aber mit falschem Token', async () => {
        // given: geaendertesAuto
        const falscherToken = 'x';

        // when
        const response = await request(server)
            .put(`${path}/${idVorhanden}`)
            .set('Authorization', `Bearer ${falscherToken}`)
            .set('If-Match', '"0"')
            .send(geaendertesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });
});
