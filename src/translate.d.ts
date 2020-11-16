export declare class Translate {
    protected readonly _translatesPath: string | null;
    static TRANSLATES_WINDOW_PROPERTY: string;
    static TRANSLATES_PATH: string;
    static COOKIE_LOCALE_FIELD_NAME: string;
    static DEFAULT_SECTION: string;
    /**
     * @param {string | null} _translatesPath
     */
    constructor(_translatesPath?: string | null);
    /**
     * @returns {string}
     */
    static getLocale(): string;
    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    import(section: string): Promise<void>;
    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    translate(name: string): Promise<string>;
}
