"use strict";
import { Utils } from "../../good-funcs.js/dist/js/GoodFuncs.js";
export class Translate {
    /**
     * @param {string | null} _translatesPath
     */
    constructor(_translatesPath = null) {
        this._translatesPath = _translatesPath;
    }
    /**
     * @returns {string}
     */
    static getLocale() {
        const regExp = new RegExp(`${Translate.COOKIE_LOCALE_FIELD_NAME}=([\\w-_]+)`), cookieLocaleArray = document.cookie.match(regExp), cookieLocale = cookieLocaleArray && (cookieLocaleArray.length > 1) ? cookieLocaleArray[1] : null;
        return (cookieLocale
            || navigator['userLanguage']
            || navigator['language']
            || navigator['browserLanguage']
            || navigator['systemLanguage']
            || 'en_US').replace('-', '_');
    }
    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    async import(section) {
        await Promise.all(Utils.GoodFuncs.getScripts(['/vendor/bower-asset/yaml.js/dist/yaml.js']));
        await fetch(`${this._translatesPath || Translate.TRANSLATES_PATH}/${Translate.getLocale()}/${section}.yml`)
            .then(async function (response) {
            const translates = await response.text();
            window[Translate.TRANSLATES_WINDOW_PROPERTY][section] = YAML.parse(translates);
        });
    }
    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    async translate(name) {
        const parts = name.split('.');
        let recordName, section;
        if (parts.length < 2) {
            recordName = parts[0];
            section = Translate.DEFAULT_SECTION;
        }
        else {
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
Translate.TRANSLATES_WINDOW_PROPERTY = 'translates';
Translate.TRANSLATES_PATH = '/public/translates';
Translate.COOKIE_LOCALE_FIELD_NAME = 'locale';
Translate.DEFAULT_SECTION = 'main';
