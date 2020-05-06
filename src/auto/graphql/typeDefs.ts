/**
 * Typdefinitionen fuer GraphQL:
 *  Vordefinierte skalare Typen
 *      Int: 32‐bit Integer
 *      Float: Gleitkommmazahl mit doppelter Genauigkeit
 *      String:
 *      Boolean: true, false
 *      ID: eindeutiger Bezeichner, wird serialisiert wie ein String
 *  Auto: eigene Typdefinition für Queries
 *        "!" markiert Pflichtfelder
 *  Query: Signatur der Lese-Methoden
 *  Mutation: Signatur der Schreib-Methoden
 */
export const typeDefs = `
    enum Art {
        LKW
        PKW
    }

    type Auto {
        _id: ID!
        marke: String!
        modell: Int
        art: Art
        preis: Float
        sitze: Float
        lieferbar: Boolean
        lieferdatum: String
        fahrgestellnummer: String
        homepage: String
        schlagwoerter: [String]
        version: Int
    }

    type Query {
        autos(marke: String): [Auto]
        auto(id: ID!): Auto
    }

    type Mutation {
        createAuto(marke: String!, modell: Int, art: String,
            preis: Float, sitze: Float, lieferbar: Boolean, lieferdatum: String,
            fahrgestellnummer: String, homepage: String, schlagwoerter: [String]): Auto
        updateAuto(_id: ID, marke: String!, modell: Int, art: String,
            preis: Float, sitze: Float, lieferbar: Boolean,
            lieferdatum: String, fahrgestellnummer: String, homepage: String,
            schlagwoerter: [String], version: Int): Auto
        deleteAuto(id: ID!): Boolean
    }
`;
