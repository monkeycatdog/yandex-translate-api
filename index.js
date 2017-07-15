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
        this.get_lang_list = this.get_lang_list.bind(this);
        this.langs = {};
    }
    /**
     * Осуществляет запрос на получение списка поддерживаемых языков 
     * @param {string} ui - код языка
     * @this {YT}
     * @return {object} Объект со списком поддерживаемых язков
     */
    get_lang_list(ui='en') {
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

                return self.langs[ui];
            });
        } else {
            return this.langs[ui];
        }
    }
    // TODO - добавить параметры возможных языков
    // Добавить колбэк функцию 
    /**
     * Осущестляет опредление введеного языка
     * @param {string} text - текс запроса
     * @this {YT}
     * @return {object} Объект с кодом ответа и определенным языком
     */
    determination(text) {
        var self = this;
        if (typeof text !== 'string') throw new Error('Text is not a string');
        // text = querystring.stringify({text: text});
        // text = text.replace('text=','');

        request.post({
            url: `${self.__link}detect`,
            qs: {
                key: self.__api_key,
                text: text
            }
        }, (error, response, body) => {
            if (error) return new Error('Error in request: ', error);
            body = JSON.parse(body);
            return body
        });
    }

    // TODO увеличить гибкость параметров
    /**
     * Функция переводит полученный текст в другой - указанный в параметрах
     * @param {string} text - текст необходимый перевести
     * @param {string} toLang - язык в который нужно перевести (en,ru)
     * @param {string} format - формат введенного текст (plain/html)
     */
    translate(text, toLang, format='plain') {
        var self = this;
        if (typeof text !== 'string') throw new Error('Text is not a string');

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
            return body.text[0]
        });
    }
}

module.exports = YT