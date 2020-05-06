import { Schema, model } from 'mongoose';
import { autoIndex, optimistic } from '../../shared';

// Eine Collection in MongoDB besteht aus Dokumenten im BSON-Format

// Mongoose ist von Valeri Karpov, der auch den Begriff "MEAN-Stack" gepraegt hat:
// http://thecodebarbarian.com/2013/04/29//easy-web-prototyping-with-mongodb-and-nodejs
// Ein Schema in Mongoose definiert die Struktur und Methoden fuer die
// Dokumente in einer Collection.
// Ein Property im Schema definiert eine Property fuer jedes Dokument.
// Ein Schematyp (String, Number, Boolean, Date, Array, ObjectId) legt den Typ
// der Property fest.
// Objection.js ist ein alternatives Werkzeug für ORM:
// http://vincit.github.io/objection.js

// https://mongoosejs.com/docs/schematypes.html
export const autoSchema = new Schema(
    {
        // MongoDB erstellt implizit einen Index fuer _id
        _id: { type: String },
        marke: { type: String, required: true, unique: true },
        modell: { type: String, required: true, unique: true },
        art: { type: String, enum: ['PKW', 'LKW'] },
        preis: { type: Number, required: true },
        sitze: Number,
        lieferbar: Boolean,
        lieferdatum: Date,
        fahrgestellnummer: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
        },
        homepage: String,
        schlagwoerter: { type: [String], sparse: true },
        // "anything goes"
        vorbesitzer: [Schema.Types.Mixed],
    },
    {
        toJSON: { getters: true, virtuals: false },
        // createdAt und updatedAt als automatisch gepflegte Felder
        timestamps: true,
        autoIndex,
    },
);

// Optimistische Synchronisation durch das Feld __v fuer die Versionsnummer
autoSchema.plugin(optimistic);

// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei auto.check() zu eines TS-Syntaxfehler fuehrt:
// schema.methods.check = () => {...}
// schema.statics.findByMarke =
//     (marke: string, cb: Function) =>
//         return this.find({marke: marke}, cb)

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
// Name des Models = Name der Collection
export const AutoModel = model('Auto', autoSchema);
