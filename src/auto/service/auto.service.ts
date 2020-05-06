/* eslint-disable max-lines */

import type { Auto, AutoData } from '../entity/types';
import { AutoModel, validateAuto } from '../entity';
import {
    AutoNotExistsError,
    FahrgestellnummerExistsError,
    MarkeExistsError,
    ValidationError,
    VersionInvalidError,
} from './errors';
import { dbConfig, logger } from '../../shared';
import { AutoServiceMock } from './mock';
import type { Document } from 'mongoose';
import JSON5 from 'json5';
import { startSession } from 'mongoose';
// UUID v4: random
// https://github.com/uuidjs/uuid
import { v4 as uuid } from 'uuid';

const { mockDB } = dbConfig;

// API-Dokumentation zu mongoose:
// http://mongoosejs.com/docs/api.html
// https://github.com/Automattic/mongoose/issues/3949

/* eslint-disable require-await, no-null/no-null */
export class AutoService {
    private readonly mock: AutoServiceMock | undefined;

    constructor() {
        if (mockDB) {
            this.mock = new AutoServiceMock();
        }
    }

    // Status eines Promise:
    // Pending: das Resultat gibt es noch nicht, weil die asynchrone Operation,
    //          die das Resultat liefert, noch nicht abgeschlossen ist
    // Fulfilled: die asynchrone Operation ist abgeschlossen und
    //            das Promise-Objekt hat einen Wert
    // Rejected: die asynchrone Operation ist fehlgeschlagen and das
    //           Promise-Objekt wird nicht den Status "fulfilled" erreichen.
    //           Stattdessen ist im Promise-Objekt die Fehlerursache enthalten.

    async findById(id: string) {
        if (this.mock !== undefined) {
            return this.mock.findById(id);
        }
        logger.debug(`AutoService.findById(): id= ${id}`);

        // ein Auto zur gegebenen ID asynchron suchen
        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // null falls nicht gefunden
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        return AutoModel.findById(id)
            .lean<AutoData>()
            .then(auto => auto ?? undefined);
    }

    async find(query?: any) {
        if (this.mock !== undefined) {
            return this.mock.find(query);
        }

        logger.debug(`AutoService.find(): query=${JSON5.stringify(query)}`);
        const tmpQuery = AutoModel.find().lean<AutoData>();

        // alle Autos asynchron suchen u. aufsteigend nach marke sortieren
        // nach _id sortieren: Timestamp des INSERTs (Basis: Sek)
        // https://docs.mongodb.org/manual/reference/object-id
        if (query === undefined || Object.entries(query).length === 0) {
            // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
            return tmpQuery.sort('marke').lean<AutoData>();
        }

        const { marke, javascript, typescript, ...dbQuery } = query;

        // Autos zur Query (= JSON-Objekt durch Express) asynchron suchen
        if (marke !== undefined) {
            // Marke in der Query: Teilstring des Markes,
            // d.h. "LIKE" als regulaerer Ausdruck
            // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
            // NICHT /.../, weil das Muster variabel sein muss
            // CAVEAT: KEINE SEHR LANGEN Strings wg. regulaerem Ausdruck
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (marke.length < 20) {
                dbQuery.marke = new RegExp(marke, 'iu'); // eslint-disable-line security/detect-non-literal-regexp
            }
        }

        // z.B. {javascript: true, typescript: true}
        const schlagwoerter = [];
        if (javascript === 'true') {
            schlagwoerter.push('JAVASCRIPT');
        }
        if (typescript === 'true') {
            schlagwoerter.push('TYPESCRIPT');
        }
        if (schlagwoerter.length === 0) {
            delete dbQuery.schlagwoerter;
        } else {
            dbQuery.schlagwoerter = schlagwoerter;
        }

        logger.debug(`AutoService.find(): dbQuery=${JSON5.stringify(dbQuery)}`);

        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // leeres Array, falls nichts gefunden wird
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        return AutoModel.find(dbQuery).lean<AutoData>();
        // Auto.findOne(query), falls das Suchkriterium eindeutig ist
        // bei findOne(query) wird null zurueckgeliefert, falls nichts gefunden
    }

    // eslint-disable-next-line max-statements,max-lines-per-function
    async create(autoData: Auto) {
        if (this.mock !== undefined) {
            return this.mock.create(autoData);
        }

        // Das gegebene Auto innerhalb von save() asynchron neu anlegen:
        // Promise.reject(err) bei Verletzung von DB-Constraints, z.B. unique

        const auto = new AutoModel(autoData);
        const errorMsg = validateAuto(auto);
        if (errorMsg !== undefined) {
            logger.debug(
                `AutoService.create(): Validation Message: ${JSON5.stringify(
                    errorMsg,
                )}`,
            );
            // Promise<void> als Rueckgabewert
            // Eine von Error abgeleitete Klasse hat die Property "message"
            return Promise.reject(new ValidationError(errorMsg));
        }

        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        const { marke } = autoData;
        let tmp = await AutoModel.findOne({ marke }).lean<AutoData>();
        if (tmp !== null) {
            // Promise<void> als Rueckgabewert
            // Eine von Error abgeleitete Klasse hat die Property "message"
            return Promise.reject(
                new MarkeExistsError(`Der Marke "${marke}" existiert bereits.`),
            );
        }

        const { fahrgestellnummer } = autoData;
        tmp = await AutoModel.findOne({ fahrgestellnummer }).lean<AutoData>();
        if (tmp !== null) {
            return Promise.reject(
                new FahrgestellnummerExistsError(
                    `Die FAHRGESTELLNUMMER-Nr. "${fahrgestellnummer}" existiert bereits.`,
                ),
            );
        }

        auto._id = uuid(); // eslint-disable-line require-atomic-updates

        let autoSaved!: Document;
        // https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions
        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                autoSaved = await auto.save();
            });
        } catch (err) {
            logger.error(
                `AutoService.create(): Die Transaktion wurde abgebrochen: ${JSON5.stringify(
                    err,
                )}`,
            );
            // TODO Weitere Fehlerbehandlung bei Rollback
        } finally {
            session.endSession();
        }
        const autoDataSaved: AutoData = autoSaved.toObject();
        logger.debug(
            `AutoService.create(): autoDataSaved=${JSON5.stringify(
                autoDataSaved,
            )}`,
        );

        // TODO Email senden

        return autoDataSaved;
    }

    // eslint-disable-next-line max-lines-per-function,max-statements
    async update(autoData: Auto, versionStr: string) {
        if (this.mock !== undefined) {
            return this.mock.update(autoData);
        }

        if (versionStr === undefined) {
            return Promise.reject(
                new VersionInvalidError('Die Versionsnummer fehlt'),
            );
        }
        const version = Number.parseInt(versionStr, 10);
        if (Number.isNaN(version)) {
            return Promise.reject(
                new VersionInvalidError('Die Versionsnummer ist ungueltig'),
            );
        }
        logger.debug(`AutoService.update(): version=${version}`);

        logger.debug(`AutoService.update(): auto=${JSON5.stringify(autoData)}`);
        const auto = new AutoModel(autoData);
        const err = validateAuto(auto);
        if (err !== undefined) {
            logger.debug(
                `AutoService.update(): Validation Message: ${JSON5.stringify(
                    err,
                )}`,
            );
            // Promise<void> als Rueckgabewert
            return Promise.reject(new ValidationError(err));
        }

        const { marke }: { marke: string } = autoData;
        const tmp = await AutoModel.findOne({ marke }).lean<AutoData>();
        if (tmp !== null && tmp._id !== auto._id) {
            return Promise.reject(
                new MarkeExistsError(
                    `Der Marke "${marke}" existiert bereits bei ${
                        tmp._id as string
                    }.`,
                ),
            );
        }

        const autoDb = await AutoModel.findById(auto._id).lean<AutoData>();
        if (autoDb === null) {
            return Promise.reject(
                new AutoNotExistsError('Kein Auto mit der ID'),
            );
        }
        const versionDb = autoDb?.__v ?? 0;
        if (version < versionDb) {
            return Promise.reject(
                new VersionInvalidError(
                    `Die Versionsnummer ${version} ist nicht aktuell`,
                ),
            );
        }

        // findByIdAndReplace ersetzt ein Document mit ggf. weniger Properties
        const result = await AutoModel.findByIdAndUpdate(auto._id, auto).lean<
            AutoData
        >();
        if (result === null) {
            return Promise.reject(
                new VersionInvalidError(
                    `Kein Auto mit ID ${
                        auto._id as string
                    } und Version ${version}`,
                ),
            );
        }

        if (result.__v !== undefined) {
            result.__v++;
        }
        logger.debug(`AutoService.update(): result=${JSON5.stringify(result)}`);

        // Weitere Methoden von mongoose zum Aktualisieren:
        //    Auto.findOneAndUpdate(update)
        //    auto.update(bedingung)
        return Promise.resolve(result);
    }

    async delete(id: string) {
        if (this.mock !== undefined) {
            return this.mock.remove(id);
        }
        logger.debug(`AutoService.delete(): id=${id}`);

        // Das Auto zur gegebenen ID asynchron loeschen
        const { deletedCount } = await AutoModel.deleteOne({ _id: id });
        logger.debug(`AutoService.delete(): deletedCount=${deletedCount}`);
        return deletedCount !== undefined;

        // Weitere Methoden von mongoose, um zu loeschen:
        //  Auto.findByIdAndRemove(id)
        //  Auto.findOneAndRemove(bedingung)
    }
}
