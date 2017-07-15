## Quick Examples

```javascript
const Ya = require('yandex-translate-api');

var app = new Ya(API_TOKEN);

app.translate('Hello world!', 'ru', 'plain', (data) => {
    console.log(data); // object { code: 200, lang: 'en-ru', text: ['Привет мир!'] }
});

app.getLangList('en', (data) => {
    console.log(data); // object { en, ru, tt ..}
});

app.determination('Hello world', (data)=>{
    console.log(data); // object { code: 200, lang; 'en' }
});

```

License

MIT.

Yandex.Translate terms of service: http://legal.yandex.com/translate_api/