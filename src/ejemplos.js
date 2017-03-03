var express = require('express')
var app = express()
var path = require('path');
var router = express.Router()
var cookieParser = require('cookie-parser')
var logger = require('morgan');


app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs');

app.use(express.static('./'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
})

app.get('/hi', function (req,res) {
  res.send('Hello World')
})

app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })

app.get('/example/b', function(req, res) {
  res.send('hello from B')
  next
})

app.get('/hello', function (req, res) {
  res.send('Hello!!!')
  })

app.post('/hey', function (req, res) {
  res.send('hey')
})

app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section...')
  next()
}, function (req, res) {
  res.send('Secreto')
})

app.get('/a*', function (req, res) {
  res.send('Buenos Días!!')
})

app.get('/chic[oa]', function (req, res) {
  res.send('Buenos Días!')
})

app.get('/nombre/:nombre/apellido/:apellido', function (req, res) {
  res.send(req.params)
})

app.get('/t/:min-:max', function (req, res) {
  res.send(req.params)
})

app.get('/prueba/1', function(req, res, next) {
  console.log('Ahora se dirigirá a la función con el seguiente mensaje')
  next()
}, function (req, res) {
  res.send('Prueba 1 correcta')
})

var ejemplo1 = function (req, res, next) {
  console.log('primer elemento')
  next()
}

var ejemplo2 = function (req, res, next) {
  console.log('segundo elemento')
  next()
}

var ejemplo3 = function (req, res) {
  res.send('Se han registrado los 2 elementos')
}

app.get('/prueba/2', [ejemplo1, ejemplo2, ejemplo3])

app.get('/prueba/3', [ejemplo1, ejemplo2], function(req, res, next){
  console.log('Añadido otro elemento')
  next()
}, function(req, res) {
  res.send('Se han registrado 3 elementos')
})

app.get('/ejemplo/1', [ejemplo1, ejemplo2], function(req, res, next){
  res.send('ejemplo 1')
  next()
})

//Middleware
//Application-level middleware

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

app.use('/ejemplo/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

//Router-level middleware

router.use(function (req, res, next) {
  console.log('Times:', Date.now())
  next()
})

router.get('/ejemplos/:id', function (req, res, next) {
  if (req.params.id === '0')  {
    next('route') 
  }
  else next()
})

app.use('/', router)

//Error-handling middleware

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//Built-in middleware

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('_book', options))

//Third-party middleware

app.use(cookieParser())

//Router

router.use(function timeLog (req, res, next) {
  console.log('Timeee: ', Date.now())
  next()
})
// define the home page route
router.get('/pajaro', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/pajaro2', function (req, res) {
  res.send('About birds')
})

module.exports = router

//Métodos
//router.METHOD(path, [callback, ...] callback)

router.get('/method', function(req, res){
  res.send('hello world');
});

router.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
  var from = req.params[0];
  var to = req.params[1] || 'HEAD';
  res.send('commit range ' + from + '..' + to);
});

//router.param(name, callback)

router.param('user', function(req, res, next, id) {
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});

router.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

router.get('/user/:id', function (req, res, next) {
  console.log('although this matches');
  next();
});

router.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});

//router.route(path)

var router = express.Router();

router.param('user_id', function(req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
  req.user = {
    id: id,
    name: 'TJ'
  };
  next();
});

router.route('/users/:user_id')
.all(function(req, res, next) {
  next();
})
.get(function(req, res, next) {
  res.json(req.user);
})
.put(function(req, res, next) {
  req.user.name = req.params.name;
  res.json(req.user);
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
});

//router.use([path], [function, ...] function)

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.use('/bar', function(req, res, next) {
  next();
});

router.use(function(req, res, next) {
  res.send('Hello World');
});

app.use('/foo', router);

app.listen(3000);


router.use(logger());
router.use(express.static(__dirname + '/public'));
router.use(function(req, res){
  res.send('Hello');
});

//router.all(path, [callback, ...] callback)

router.all('*', function(req, res){
  res.send('hello world');
});