"use strict";
import { eval as yaml } from '../../../bower-asset/yaml/lib/browser.js';
export class Translate {
    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    static async import(section) {
        await fetch(`${Translate.TRANSLATES_PATH}/${section}`).then(async function (response) {
            const translates = await response.text();
            window[Translate.TRANSLATES_WINDOW_PROPERTY][section] = yaml(translates);
        });
    }
    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    static async translate(name) {
        const parts = name.split('.');
        if (parts.length < 2) {
            throw new Error('Имя записи перевода должно быть задано в формате <раздел>.<имя записи>');
        }
        const [section, recordName] = parts;
        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY]) {
            window[Translate.TRANSLATES_WINDOW_PROPERTY] = [];
        }
        if (!window[Translate.TRANSLATES_WINDOW_PROPERTY][section]) {
            await Translate.import(section);
        }
        return window[Translate.TRANSLATES_WINDOW_PROPERTY][section][recordName] || '';
    }
}
Translate.TRANSLATES_WINDOW_PROPERTY = 'translates';
Translate.TRANSLATES_PATH = '/public/translates';
