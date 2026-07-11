import { WebApp } from "./app";
import { Config } from './structures/interfaces';

export default class ColorService {
    constructor (config: Config) {
        new WebApp(config);
    };
};