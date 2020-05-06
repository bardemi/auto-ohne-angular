import type {
    IResolverObject,
    IResolvers,
} from 'graphql-tools/dist/Interfaces';
import type { Auto } from '../entity/types';
import { AutoService } from '../service/auto.service';
import { logger } from '../../shared';

const autoService = new AutoService();

const findAutos = (marke: string) => {
    const suchkriterium = marke === undefined ? {} : { marke };
    return autoService.find(suchkriterium);
};

interface MarkeCriteria {
    marke: string;
}

interface IdCriteria {
    id: string;
}

const createAuto = (auto: Auto) => {
    auto.lieferdatum = new Date(auto.lieferdatum as string);
    return autoService.create(auto);
};

const updateAuto = async (auto: Auto) => {
    const version = auto.__v ?? 0;
    auto.lieferdatum = new Date(auto.lieferdatum as string);
    const autoUpdated = await autoService.update(auto, version.toString());
    logger.debug(`resolvers updateAuto(): Versionsnummer: ${auto.__v}`);
    return autoUpdated;
};

const deleteAuto = async (id: string) => {
    await autoService.delete(id);
};

// Queries passend zu "type Query" in typeDefs.ts
const query: IResolverObject = {
    // Autos suchen, ggf. mit Marke als Suchkriterium
    autos: (_: unknown, { marke }: MarkeCriteria) => findAutos(marke),
    // Ein Auto mit einer bestimmten ID suchen
    auto: (_: unknown, { id }: IdCriteria) => autoService.findById(id),
};

const mutation: IResolverObject = {
    createAuto: (_: unknown, auto: Auto) => createAuto(auto),
    updateAuto: (_: unknown, auto: Auto) => updateAuto(auto),
    deleteAuto: (_: unknown, { id }: IdCriteria) => deleteAuto(id),
};

export const resolvers: IResolvers = {
    Query: query,
    Mutation: mutation,
};
