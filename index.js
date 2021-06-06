const express = require('express');
const routes = require ('./routes');
const path = require ('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');


//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');



//Crear la conexion a la BD
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
//db.authenticate()
.then(() => {
    console.log('Conexión a la BD exitosa!!!.');
  })
  .catch(err => {
    console.error('Error de conexión a la BD!!', err);
  });
    //.then(()=> console.log('Conectado al Servidor'))
   //.catch(error => console.log(error));
//crear una app de express

const app = express();

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');



//Añadir la carpeta de las vistas
app.set('views',path.join(__dirname,'./views'));

app.use(flash());


app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
  //secret: "keyboard cat", 
  secret: "supersecreto", 
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req,res,next)=>{
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = {...req.user} || null;
  next();
});



app.use('/',routes() );
/*const productos = [
{

    producto: 'Libro',
    precio: 30

},
{

   producto: 'Computadora',
   precio: 1000

}];*/

//ruta para el home

//Servidor y Puerto 
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host,() =>{
  console.log('El Servidor se encuentra funcionando');

})
