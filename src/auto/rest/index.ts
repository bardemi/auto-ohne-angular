import type { Request, Response } from 'express';
import { AutoFileRequestHandler } from './auto-file.request-handler';
import { AutoRequestHandler } from './auto.request-handler';

const handler = new AutoRequestHandler();
const fileHandler = new AutoFileRequestHandler();

export const findById = (req: Request, res: Response) =>
    handler.findById(req, res);
export const find = (req: Request, res: Response) => handler.find(req, res);
export const create = (req: Request, res: Response) => handler.create(req, res);
export const update = (req: Request, res: Response) => handler.update(req, res);
export const deleteFn = (req: Request, res: Response) =>
    handler.delete(req, res);
export const upload = (req: Request, res: Response) =>
    fileHandler.upload(req, res);
export const download = (req: Request, res: Response) =>
    fileHandler.download(req, res);
