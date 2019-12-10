var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var api=require('./routes/api');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', api);

app.use((req, res, next)=>{
    console.log("path:"+req.path);
    console.log(req.cookies);
    next();

}
    );

// socket server set up
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4001);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  //io.emit('new member', socket.handshake.query['name'] + ' is connect now.');
  socket.on('text', function (data) {
    console.log("get text: "+data['content']);
    var room = data['room'];
    io.to(room).emit('new message', data);
      console.log("sent to room: " + room);
  });
  socket.on('create', function(room) {
    console.log("join room:"+room);
    socket.join(room);
    io.to(room).emit('new member', socket.handshake.query['name'])
  });
  socket.on('disconnect', function () {
    console.log(socket.handshake.query['name'] + ' is disconnected.');
    io.emit('user disconnected', socket.handshake.query['name']);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
