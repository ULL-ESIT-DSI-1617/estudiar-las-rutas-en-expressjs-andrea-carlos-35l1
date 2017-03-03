# EXPRESSS

## Routing basico

El routing se encarga de controlar como una aplicación responderá a una petición de un cliente.
Cada route tendra una o más respuestas y un path del server.

Cada route estará compuesto por una instancia de express, generalmente lo llamaremos *app*, un método http de respuesta, como put, post, get... y una o más funciones de respuesta.

Algunos ejemplos de routing pueden ser:
~~~
  app.post('/hello', function (req, res) {  
    res.send('Hello!!!')  
  })  

  app.get('/hello', function (req, res) {  
    res.send('Hello!!!')  
    })  
~~~

Tambien tenemos algún método no derivado de los metodos http, que nos permite cargar funciones middleware con métodos request, como el método all.

Por ejemplo:
~~~
app.all('/secret', function (req, res, next) {  
  console.log('Accessing the secret section...')  
  next()  
})  
~~~
En este caso, no tenemos definida una función para next, y tampoco hemos definido un contenido que mostrar por el servidor, pero si un mensaje que mostrar en la consola cuando es llamado '/secret'.

  ![foto](secret-nosalida.png)

Si además le definimos una función next:
~~~
app.all('/secret', function (req, res, next) {  
  console.log('Accessing the secret section...')  
}, function (req, res) {  
  res.send('Secreto')  
})  
~~~
Podremos obtener ambas salidas. En caso

  ![foto](secret-salida.png)
  

## Multiple Handler

Haciendo uso de los http request methods también podemos definir estructuras un poco más complejas, con varias funciones de respuesta.
Por ejemplo podemos utilizar una función next para definir dos salidas.
~~~
app.get('/prueba/1', function(req, res, next) {  
  console.log('Ahora se dirigirá a la función con el seguiente mensaje')  
  next()  
}, function (req, res) {  
  res.send('Prueba 1 correcta')  
})  
~~~
![foto](prueba-1.png)

o haciendo uso de variables, definir más de 2 salidas.
~~~
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
~~~
 ![foto](prueba-2.png)

O como forma alternativa.
~~~
 app.get('/prueba/3', [ejemplo1, ejemplo2], function(req, res, next){  
   console.log('Añadido otro elemento')  
   next()  
 }, function(req, res) {  
   res.send('Se han registrado 3 elementos')  
 })  
~~~

## Route Path.

Para las route Path, podemos utilizar expresiones regulares, de forma que podemos definir más de una ruta para una misma función.
Por ejemplo:

Si queremos que al escribir cualquier cadena que empiece por 'a', responda Buenos Dias!!.
~~~
app.get('/a*', function (req, res) {  
  res.send('Buenos Días!!')  
})  
~~~

![foto](abc.png)
![foto](aspirina.png)

O si queremos que responda lo mismo para 'chico' y 'chica'.
~~~
app.get('/chic[oa]', function (req, res) {  
  res.send('Buenos Días!')  
})  
~~~
![foto](chico.png)
![foto](chica.png)
Otra forma de manipular la route path es usando parámetros, y 'req.param':

Ejemplos:
~~~
app.get('/nombre/:nombre/apellido/:apellido', function (req, res) {  
  res.send(req.params)  
})  
~~~
![foto](nombre-apellido.png)
~~~
app.get('/t/:min-:max', function (req, res) {  
  res.send(req.params)  
})  
~~~
![foto](min-max.png)

# Middleware.

Una aplicación en express es básicamente una secuencia de middleware. Un middleware es una función que tiene acceso a una solicitud (request object), a una respuesta (response object) y al siguiente middleware, que es communmente denominado next.
El middleware toma el control, y en caso de no finalizar el ciclo de solicitudes, pasa el control al siguiente middleware, y asi sucesivamente hasta que logra su objetivo.

## Application-level middleware.

Este tipo de middleware hace uso de instancias de express. Puede ser usado sin hacer uso de Path; en este caso, se ejecutaría cada vez que se realiza una request.

~~~
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
~~~

y con el route definido:

~~~
app.post('/hey', function (req, res, next) {
  res.render('hey')
  next()
})
~~~

obtendremos por consola:

![foto](hora.png)

Al ser usando incluyendo route path, se ejecutará en los middleware en los que coincida. Por ejemplos:

~~~
app.get('/ejemplo/1', [ejemplo1, ejemplo2], function(req, res, next){
  res.send('ejemplo 1')
  next()
})
~~~

![foto](ejemplo1.png)
