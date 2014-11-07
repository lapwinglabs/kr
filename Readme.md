# kr

 Simple express-like router for koa and roo.

```
var kr = require('kr');
app.use(kr.get('/pets', authenticate, pets.list));
app.use(kr.get('/pets/:name', authenticate, pets.show));
```

## Features

This repo is essentially a fork of [koa-route](https://github.com/koajs/koa-route), with two API differences:

  - support for route middleware
  - populates `this.params`

## Installation

```js
$ npm install kr
```

## Example

  Contrived resource-oriented example:

```js
var koa = require('koa');
var kr = require('kr');
var app = koa();

var db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};

function *authenticate(next) {
  // authenticate or redirect
  yield next;
}

var pets = {
  list: function *(){
    var names = Object.keys(db);
    this.body = 'pets: ' + names.join(', ');
  },

  show: function *(){
    var name = this.params.name;
    var pet = db[name];
    if (!pet) return this.throw('cannot find that pet', 404);
    this.body = pet.name + ' is a ' + pet.species;
  }
};

app.use(kr.get('/pets', authenticate, pets.list));
app.use(kr.get('/pets/:name', authenticate, pets.show));

app.listen(3000);
console.log('listening on port 3000');
```

## License

  MIT
