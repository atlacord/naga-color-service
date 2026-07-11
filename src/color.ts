import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import express from 'express';

const router = express.Router();

const file = require('./Preview.svg');
let svg: any;

function getOrLoadSvg(file: any) {
    if (svg) {
        return Promise.resolve(svg);
    };
    return new Promise((res, rej) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                return rej(err);
            };
            svg = data.toString('utf-8');
            return res(svg);
        });
    });
};

async function getSvg(c: string, w: string, h: string) {
    let svg = await getOrLoadSvg(file);
    let vars = { c, w, h };
    let s = svg;
    for (let [key, val] of Object.entries(vars)) {
        s = s.replace(`{{${key}}}`, val)
    }

    return s;
};

router.get('/:color{/:size}.png', async (req, res) => {
    const color: string = req.params.color;
    const size: string = req.params.size || '80x80';
    let [width, height]: any = size.split('x');

    width = parseInt(width, 10) > 2048 ? 2048 : parseInt(width, 10);
		
    if (!height) {
        height = width;
    }

    height = parseInt(height, 10) > 2048 ? 2048 : parseInt(height, 10);

    if (width > height) {
        width = height;
    } else if (height > width) {
        height = width;
    }

    try {
        const svg = await getSvg(color, width, height);
        const img = await sharp(Buffer.from(svg)).png().toBuffer();
        res.setHeader('Content-Type', 'image/png');
        res.end(img);
    } catch (err) {
        console.error(err);
        throw err;
    }
});

export = router;