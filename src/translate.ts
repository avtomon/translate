"use strict";

import {Utils} from "../../good-funcs.js/dist/js/GoodFuncs.js";

export class Translate {

    public static TRANSLATES_WINDOW_PROPERTY = 'translates';
    public static TRANSLATES_PATH = '/public/translates';

    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    public static async import(section : string) : Promise<void> {
        await Promise.all(Utils.GoodFuncs.getScripts(['/vendor/bower-asset/yaml.js/dist/yaml.js']));
        await fetch(`${Translate.TRANSLATES_PATH}/${section}.yml`).then(async function (response : Response) {
            const translates : string = await response.text();
            window[Translate.TRANSLATES_WINDOW_PROPERTY][section] = YAML.parse(translates);
        });
    }

    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    public static async translate(name : string) : Promise<string> {
        const parts = name.split('.');
        if (parts.length < 2) {
            throw new Error('Имя записи перевода должно быть задано в формате <раздел>.<имя записи>');
        }

        const [section, recordName] : string[] = parts;

        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY]) {
            window[Translate.TRANSLATES_WINDOW_PROPERTY] = [];
        }

        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY][section]) {
            await Translate.import(section);
        }

        return window[Translate.TRANSLATES_WINDOW_PROPERTY][section][recordName] || '';
    }
}
