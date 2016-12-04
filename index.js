var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var num_usuarios = 0;
var bye = "Hasta pronto!";
var usuarios = {};
var snake_x,snake_y,food_x,food_y;

function think(snake_x,snake_y,food_x,food_y,ult,ult2){
    var movimiento=ult;
    var direccion=ult2;
    console.log("movimiento..."+movimiento+" direccion "+direccion);
    /*
     if(direccion!="norte" && direccion!="sur" && direccion!="este" && direccion!="oeste" ){
     direccion="sur";
     movimiento="down";
     }
     */
    if(snake_x < food_x && direccion=="este" ){
        movimiento="right";
        direccion="este";

    }
    else if(snake_x < food_x && direccion=="norte" ){
        movimiento="right";
        direccion="este";
;
    }
    else if(snake_x < food_x && direccion=="oeste" ){
        movimiento="up";
        direccion="norte";

    }
    else if(snake_x < food_x && direccion=="sur" ){
        movimiento="right";
        direccion="este";

    }
    else if(snake_x > food_x && direccion=="este" ){
        movimiento="up";
        direccion="norte";

    }
    else if(snake_x > food_x && direccion=="sur" ){
        movimiento="left";
        direccion="oeste";

    }
    else if(snake_x > food_x && direccion=="oeste" ){
        movimiento="left";
        direccion="oeste";

    }
    else if(snake_x > food_x && direccion=="norte" ){
        movimiento="left";
        direccion="oeste";

    }
    else if(snake_y > food_y && direccion=="norte" ){
        movimiento="up";
        direccion="norte";
    }
    else if(snake_y > food_y && direccion=="este" ){
        movimiento="up";
        direccion="norte";
    }
    else if(snake_y > food_y && direccion=="oeste" ){
        movimiento="up";
        direccion="norte";
    }
    else if(snake_y > food_y && direccion=="sur" ){
        movimiento="left";
        direccion="oeste";
    }
    else if(snake_y < food_y && direccion=="norte" ){
        movimiento="right";
        direccion="este";
    }
    else if(snake_y < food_y && direccion=="oeste" ){
        movimiento="down";
        direccion="sur";
    }
    else if(snake_y < food_y && direccion=="este" ){
        movimiento="down";
        direccion="sur";
    }
    else if(snake_y < food_y && direccion=="sur" ){
        movimiento="down";
        direccion="sur";
    }


    ultdir=direccion;
    console.log(direccion);
    ultmov=movimiento;
    return {movimiento:movimiento, direccion:direccion};

}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    var ultdir="este";
    var ultmov="right";
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        io.emit('bye', "el usuario se desconectó");
        num_usuarios--;
    });

    socket.on('food_coords', function (data) {

        food_x=data.x;
        food_y=data.y;
        //   console.log("comida: ",food_x,food_y);
        // socket.emit('next_move',"down")
    });

    socket.on('snake_coords', function (data) {
        var data;
        snake_x=data.snake_x;
        snake_y=data.snake_y;
        //console.log("serpiente: ",snake_x,snake_y);
        data = think(snake_x,snake_y,food_x,food_y,ultmov,ultdir);
        ultmov=data.movimiento;
        ultdir=data.direccion;
        socket.emit('next_move',data.movimiento);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});