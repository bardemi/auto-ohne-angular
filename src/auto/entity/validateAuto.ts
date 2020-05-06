import { AutoData } from './auto';
import type { Document } from 'mongoose';
import validator from 'validator';

const { isUUID, isURL, isAlphanumeric } = validator;

export interface ValidationErrorMsg {
    id?: string;
    marke?: string;
    art?: string;
    modell?: string;
    fahrgestellnummer?: string;
    homepage?: string;
}

/* eslint-disable no-null/no-null */
export const validateAuto = (auto: Document) => {
    const err: ValidationErrorMsg = {};
    const {
        marke,
        modell,
        art,
        fahrgestellnummer,
        homepage,
    } = auto as Document & AutoData;

    const autoDocument = auto;
    if (!autoDocument.isNew && !isUUID(autoDocument._id)) {
        err.id = 'Das Auto hat eine ungueltige ID.';
    }

    if (marke === undefined || marke === null || marke === '') {
        err.marke = 'Ein Auto muss einen Marke haben.';
    } else if (!/^\w.*/u.test(marke)) {
        err.marke =
            'Ein Automarke muss mit einem Autostaben, einer Ziffer oder _ beginnen.';
    }
    if (art === undefined || art === null || art === '') {
        err.art = 'Die Art eines Autoes muss gesetzt sein';
    } else if (art !== 'PKW' && art !== 'LKW') {
        err.art = 'Die Art eines Autoes muss PKW oder LKW sein.';
    }
    if (modell === undefined || modell === null || modell === '') {
        err.modell = `${modell} ist keine gueltige Bewertung.`;
    }
    if (
        fahrgestellnummer !== undefined &&
        fahrgestellnummer !== null &&
        (typeof fahrgestellnummer !== 'string' ||
            isAlphanumeric(fahrgestellnummer))
    ) {
        err.fahrgestellnummer = 'Keine gueltige FAHRGESTELLNUMMER-Nummer.';
    }
    // Falls "preis" ein string ist: Pruefung z.B. 12.30
    // if (isPresent(preis) && !isCurrency(`${preis}`)) {
    //     err.preis = `${preis} ist kein gueltiger Preis`
    // }
    if (
        homepage !== undefined &&
        homepage !== null &&
        (typeof homepage !== 'string' || !isURL(homepage))
    ) {
        err.homepage = 'Keine gueltige URL.';
    }

    return Object.entries(err).length === 0 ? undefined : err;
};
