var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var num_usuarios = 0;
var bye = "Hasta pronto!";
var usuarios = {};
var snake_x,snake_y,food_x,food_y,alto = 300,ancho = 300;

function think(snake_x,snake_y,food_x,food_y,ult,ult2){
    console.time("bench");
    var movimiento=ult;
    var direccion=ult2;
    if(snake_x < food_x && direccion=="este" ){
        movimiento="right";
        direccion="este";

    }
    else if(snake_x < food_x && direccion=="norte" ){
        movimiento="right";
        direccion="este";
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
    ultmov=movimiento;
    console.timeEnd("bench");
    return {movimiento:movimiento, direccion:direccion};

}

function thinkprofundidad(snake_x,snake_y,food_x,food_y){
    // console.time("bench");
    var camino = [];
    if(snake_x == food_x && snake_y == food_y) return [{ x:snake_x, y:snake_y}];
    if(snake_x == alto || snake_y == ancho) return [];
    if(snake_x-1 > 0 && snake_x-1 < 300 && snake_y > 0 && snake_y > 300){
        camino = thinkprofundidad(snake_x-1,snake_y,food_x,food_y);
        if(camino.length > 0){
            camino.push({x:snake_x,y:snake_y});
            return camino;
        }
    }

    if(snake_y > 299 && snake_y+1 > 300){
        camino = thinkprofundidad(snake_x-1,snake_y,food_x,food_y);
        if(camino.length > 0){
            camino.push({x:snake_x,y:snake_y});
            return camino;
        }
    }
    ultdir=direccion;
    ultmov=movimiento;
    // console.timeEnd("bench");
    return {movimiento:movimiento, direccion:direccion};

}


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    var ultdir="este";
    var ultmov="right";

    socket.on('tam', function(msg){
        alto = msg.alto;
        ancho=msg.ancho;
        console.log("alto ",alto);
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
        console.time("coords");
        var data;
        snake_x=data.snake_x;
        snake_y=data.snake_y;
        //console.log("serpiente: ",snake_x,snake_y);
        data = think(snake_x,snake_y,food_x,food_y,ultmov,ultdir);
        ultmov=data.movimiento;
        ultdir=data.direccion;
        socket.emit('next_move',data.movimiento);
        console.timeEnd("coords");
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});