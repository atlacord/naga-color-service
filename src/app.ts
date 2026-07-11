import express from 'express';
import sha1 from 'sha1';
import color from './color';
import { Config } from './structures/interfaces';

export class WebApp {
    constructor(config: Config) {
        const checkHash = (req: any, res: any, next: any) => {
            if (!req.query || !req.query.key || !req.query.hash) {
                return res.status(403).send('Forbidden');
            };
        
            const hash = sha1(`${config.secret}.${req.query.key}`);
            if (hash !== req.query.hash) {
                return res.status(403).send('Forbidden');
            };
        
            return next();
        };
        const app = express();
        console.log('[ColorService] Color service online')

        app.use('/ping', (req, res) => res.send('Ok'));
        app.use('/color', color);
    };
};