
  /**
   * Module dependencies.
   */

  var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , $ = require('jquery');

  var io = require('socket.io');
  var fs = require('fs');
  var app = express();

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  app.get('/', routes.index);
  app.get('/users', user.list);

  var server = http.createServer(app);

  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

  var fileName;
  var socketFileQueue = [];
  var socketInProcess = [];

  var path = "c:\\inetpub\\wwwroot\\nodeload\\files\\";
  io.listen(server).on('connection', function (socket) {
    console.log(socket.id);
    socket.on('startFile', function (data) {
      fileName = data;
      console.log(fileName);
      fs.unlink(path + fileName);
    });

  socket.on('sendChunk', function (data) {
    console.log(this.id);
    fs.appendFile(path + fileName, data.data, function (err) {
      if (err) 
        throw err;
      console.log(data.sequence + ' - The data was appended to file ' + fileName);
    });
  });

    socket.on('endFile', function (data) {
      console.log(data);
      socket.disconnect();
    });

  });
