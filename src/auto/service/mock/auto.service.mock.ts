import { auto, autos } from './auto';
import { Auto } from '../../entity/types';
import JSON5 from 'json5';
import { logger } from '../../../shared';
import { v4 as uuid } from 'uuid';

/* eslint-disable @typescript-eslint/no-unused-vars,require-await,@typescript-eslint/require-await */
export class AutoServiceMock {
    async findById(id: string) {
        auto._id = id;
        return auto;
    }

    async find(_?: any) {
        return autos;
    }

    async create(autoData: Auto) {
        autoData._id = uuid();
        logger.info(`Neues Auto: ${JSON5.stringify(autoData)}`);
        return autoData;
    }

    async update(autoData: Auto) {
        if (autoData.__v !== undefined) {
            autoData.__v++;
        }
        logger.info(`Aktualisiertes Auto: ${JSON5.stringify(autoData)}`);
        return Promise.resolve(autoData);
    }

    async remove(id: string) {
        logger.info(`ID des geloeschten Autoes: ${id}`);
        return true;
    }
}
