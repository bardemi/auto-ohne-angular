import type { Request, Response } from 'express';
import { AutoService } from '../service/auto.service';

const autoService = new AutoService();

export const suche = async (_: Request, res: Response) => {
    const autos = await autoService.find();
    res.render('suche', { title: 'Suche', autos });
};
