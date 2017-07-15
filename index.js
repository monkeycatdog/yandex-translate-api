const request = require('request');

/**
 * Создает экземпляр YT.
 * @constructor
 * @this { YT }
 */
class YT {
    /**
     * @param {string} __api_key - ключ для работы с яндекс.переводчиком 
     * @param {string} __link - основная ссылка для запросов
     */
    constructor(api_key) {
        /** @private */
        this.__api_key = api_key;
        this.__link = 'https://translate.yandex.net/api/v1.5/tr.json/';
        this.getLangList = this.getLangList.bind(this);
        this.determination = this.determination.bind(this);
        this.translate = this.translate.bind(this);

        this.langs = {};
    }

    /**
     * Осуществляет запрос на получение списка поддерживаемых языков 
     * @param {string} ui - код языка
     * @this {YT}
     * @param {function} callback - функция обратного вызова, получает в аргумнеты результат
     * @return {object} Объект со списком поддерживаемых язков
     */

    getLangList(ui = 'en', callback) {
        var self = this;
        if (!self.langs[ui]) {
            request.post({
                url: `${self.__link}getLangs`,
                qs: {
                    key: self.__api_key,
                    ui: ui
                }
            }, (error, response, body) => {
                if (error) return new Error('Error in request: ', error);
                body = JSON.parse(body);
                self.langs[ui] = body.langs;

                if (callback) callback(self.langs[ui]);

                return self.langs[ui];
            });
        } else {
            if (callback) callback(self.langs[ui]);
            return this.langs[ui];
        }
    }
    

    /**
     * Осущестляет опредление введеного языка
     * @param {string} text - текс запроса
     * @this {YT}
     * @param {function} callback - функция обратного вызова, получает в аргумнеты результат
     * @return {object} Объект с кодом ответа и определенным языком
     */
    determination(text, callback) {
        var self = this;
        if (typeof text !== 'string') throw new Error('Text is not a string');

        request.post({
            url: `${self.__link}detect`,
            qs: {
                key: self.__api_key,
                text: text
            }
        }, (error, response, body) => {
            if (error) return new Error('Error in request: ', error);
            body = JSON.parse(body);

            if (callback) callback(body);

            return body;
        });
    }


    // TODO увеличить гибкость параметров
    /**
     * Функция переводит полученный текст в другой - указанный в параметрах
     * @param {string} text - текст необходимый перевести
     * @param {string} toLang - язык в который нужно перевести (en,ru)
     * @param {string} format - формат введенного текст (plain/html)
     * @param {function} callback - функция обратного вызова, получает в аргумнеты результат
     * @return {object} - объект с результатом 
     */


    translate(text, toLang, format, callback) {
        var self = this;
        if (typeof text !== 'string') throw new Error('Text is not a string');
        if (!toLang) throw new Error('No selected lang');

        request.post({
            url: `${self.__link}translate`,
            qs: {
                key: self.__api_key,
                text: text,
                lang: toLang,
                format: format
            }
        }, (error, response, body) => {
            if (error) return new Error('Error in request: ', error);
            body = JSON.parse(body);

            if (callback) callback(body);

            return body;
        });
    }
}

module.exports = YT
