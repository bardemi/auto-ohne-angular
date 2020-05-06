/* globals describe, expect, test, beforeAll, afterAll */

// REST-Schnittstelle testen: Supertest oder (primitiver!) request

// import dotenv from 'dotenv';
// const result = dotenv.config();
// if (result.error !== undefined) {
//     throw result.error;
// }
// console.info(`.env: ${JSON.stringify(result.parsed)}`);
// const dev = result?.parsed?.NODE_ENV?.startsWith('dev') ?? false;

import { HttpStatus } from '../../../src/shared';
import { PATHS } from '../../../src/app';
import type { AutoData } from '../../../src/auto/entity/types';
import type { Server } from 'http';
import chai from 'chai';
import { createTestserver } from '../../createTestserver';
import request from 'supertest';

const { expect } = chai;

// startWith(), endWith()
import('chai-string').then(chaiString => chai.use(chaiString.default));

// -----------------------------------------------------------------------------
// T e s t s e r v e r   m i t   H T T P   u n d   R a n d o m   P o r t
// -----------------------------------------------------------------------------
const path = PATHS.autos;
let server: Server;

// Test-Suite
describe('GET /autos', () => {
    beforeAll(async () => (server = await createTestserver()));

    afterAll(async () => {
        server.close();
        // "open handle error (TCPSERVERWRAP)" bei Supertest mit Jest vermeiden
        // https://github.com/visionmedia/supertest/issues/520
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // eslint-disable-line @typescript-eslint/no-magic-numbers
    });

    test('Alle Autos', async () => {
        // when
        const response = await request(server).get(path).trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // https://jestjs.io/docs/en/expect
        // JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;
    });

    test('Autos mit einem Marke, der ein "a" enthaelt', async () => {
        // given
        const teilMarke = 'a';

        // when
        const response = await request(server)
            .get(`${path}?marke=${teilMarke}`)
            .trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // response.body ist ein JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;

        // Jedes Auto hat einen Marke mit dem Teilstring 'a'
        body.map((auto: AutoData) => auto.marke).forEach((marke: string) =>
            expect(marke).to.have.string(teilMarke),
        );
    });

    test('Keine Autos mit einem Marke, der "XX" enthaelt', async () => {
        // given
        const teilMarke = 'XX';

        // when
        const response = await request(server)
            .get(`${path}?marke=${teilMarke}`)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.NOT_FOUND);
        // Leerer Rumpf
        expect(Object.entries(body)).to.be.empty;
    });

    test('Mind. 1 Auto mit dem Schlagwort "javascript"', async () => {
        // given
        const schlagwort = 'javascript';

        // when
        const response = await request(server)
            .get(`${path}?${schlagwort}=true`)
            .trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;

        // Jedes Auto hat im Array der Schlagwoerter "javascript"
        body.map(
            (auto: AutoData) => auto.schlagwoerter,
        ).forEach((s: Array<string>) =>
            expect(s).to.include(schlagwort.toUpperCase()),
        );
    });

    test('Keine Autos mit dem Schlagwort "csharp"', async () => {
        // given
        const schlagwort = 'csharp';

        // when
        const response = await request(server)
            .get(`${path}?${schlagwort}=true`)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.NOT_FOUND);
        // Leerer Rumpf
        expect(Object.entries(body)).to.be.empty;
    });
});
