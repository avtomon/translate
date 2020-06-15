export declare class Translate {
    static TRANSLATES_WINDOW_PROPERTY: string;
    static TRANSLATES_PATH: string;
    /**
     * @param {string} section
     *
     * @returns {Promise<void>}
     */
    static import(section: string): Promise<void>;
    /**
     * @param {string} name
     *
     * @returns {Promise<string>}
     */
    static translate(name: string): Promise<string>;
}
