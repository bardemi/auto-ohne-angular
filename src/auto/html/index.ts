import type { Request, Response } from 'express';

export const index = (_: Request, res: Response) => {
    res.render('index', { title: 'Beispiel' });
};

export * from './neues-auto';
export * from './suche';
