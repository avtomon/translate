"use strict";

import {Utils} from "../../good-funcs.js/dist/js/GoodFuncs.js";

export class Translate {

    public static TRANSLATES_WINDOW_PROPERTY = 'translates';
    public static TRANSLATES_PATH = '/public/translates';
    public static COOKIE_LOCALE_FIELD_NAME = 'locale';
    public static DEFAULT_SECTION = 'main';

    /**
     * @param {string | null} _translatesPath
     */
    public constructor(protected readonly _translatesPath : string | null = null) {
    }

    /**
     * @returns {string}
     */
    public static getLocale() : string {
        const
            regExp = new RegExp(`${Translate.COOKIE_LOCALE_FIELD_NAME}=([\\w-_]+)`),
            cookieLocaleArray = document.cookie.match(regExp),
            cookieLocale = cookieLocaleArray && (cookieLocaleArray.length > 1) ? cookieLocaleArray[1] : null;

        let locale =  (cookieLocale
            || navigator['userLanguage']
            || navigator['language']
            || navigator['browserLanguage']
            || navigator['systemLanguage']
            || 'en_US'
        ).replace('-', '_');

        if (!locale.includes('_')) {
            locale = `${locale}_${locale.toUpperCase()}`;
        }

        return locale;
    }

    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    public async import(section : string) : Promise<void> {
        await Promise.all(Utils.GoodFuncs.getScripts(['/vendor/bower-asset/yaml.js/dist/yaml.js']));
        await fetch(`${this._translatesPath || Translate.TRANSLATES_PATH}/${Translate.getLocale()}/${section}.yml`)
            .then(async function (response : Response) {
                const translates : string = await response.text();
                window[Translate.TRANSLATES_WINDOW_PROPERTY][section] = YAML.parse(translates);
            });
    }

    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    public async translate(name : string) : Promise<string> {
        const parts = name.split('.');
        let recordName,
            section;
        if (parts.length < 2) {
            recordName = parts[0];
            section = Translate.DEFAULT_SECTION;
        } else {
            [section, recordName] = parts;
        }

        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY]) {
            window[Translate.TRANSLATES_WINDOW_PROPERTY] = [];
        }

        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY][section]) {
            await this.import(section);
        }

        return window[Translate.TRANSLATES_WINDOW_PROPERTY][section][recordName] || '';
    }
}
