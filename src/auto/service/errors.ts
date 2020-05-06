/* eslint-disable max-classes-per-file */

import type { ValidationErrorMsg } from '../entity/types';
import { logger } from '../../shared';

// http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript#answer-5251506
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Error

export class ValidationError extends Error {
    constructor(msg: ValidationErrorMsg) {
        // *NICHT* JSON5, damit der Client einen regulaeren JSON-Parser nutzen kann
        super(JSON.stringify(msg));
        logger.debug(`ValidationError.constructor(): ${this.message}`);
        this.name = 'ValidationError';
    }
}

export class MarkeExistsError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`MarkeExistsError.constructor(): ${message}`);
        this.name = 'MarkeExistsError';
    }
}

export class FahrgestellnummerExistsError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`FahrgestellnummerExistsError.constructor(): ${message}`);
        this.name = 'FahrgestellnummerExistsError';
    }
}

export class VersionInvalidError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`VersionInvalidError.constructor(): ${message}`);
        this.name = 'VersionInvalidError';
    }
}

export class AutoNotExistsError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`AutoNotExistsError.constructor(): ${message}`);
        this.name = 'AutoNotExistsError';
    }
}

export class FileNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`FilenNotFoundError.constructor(): ${message}`);
        this.name = 'FileNotFoundError';
    }
}

export class MultipleFilesError extends Error {
    constructor(message: string) {
        super(message);
        logger.debug(`MultipleFilesError.constructor(): ${message}`);
        this.name = 'MultipleFilesError';
    }
}

/* eslint-enable max-classes-per-file */
