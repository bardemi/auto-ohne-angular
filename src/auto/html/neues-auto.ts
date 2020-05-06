import type { Request, Response } from 'express';

export const neuesAuto = (_: Request, res: Response) => {
    res.render('neues-auto', { title: 'Neues Auto' });
};
