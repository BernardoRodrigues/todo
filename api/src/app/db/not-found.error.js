/**
 *
 *
 * @class NotFoundError
 * @extends {Error}
 * 
 */
export class NotFoundError extends Error {

    /**
     *Creates an instance of NotFoundError.
     * @param {string} message
     * @param {any} value
     * @param {string} valueName
     * @memberof NotFoundError
     */
    constructor(message, value, valueName) {
        super(message);
        this.value = value
        this.valueName = valueName
        this.name = 'NotFoundError'
    }
}