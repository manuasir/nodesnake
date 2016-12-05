var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var num_usuarios = 0;
var bye = "Hasta pronto!";
var usuarios = {};
var snake_x,snake_y,food_x,food_y,alto = 10,ancho = 10;

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
    console.log("calculando");
    console.log(snake_x,snake_y,food_x,food_y);
    var camino = [];
    if(snake_x == food_x && snake_y == food_y){ console.log("1 if"); camino.push("fin"); return camino; }
    if(snake_x == alto || snake_y == ancho) { console.log("2 if"); return []; }
    if(snake_x-1 >= 0 ){
        console.log("3 if");
        camino.push(thinkprofundidad(snake_x-1,snake_y,food_x,food_y));
        if(camino && camino.length > 0 && camino[camino.length] != []){
            camino.push("norte");
            console.log("pusheando norte");
            return "norte";
        }
    }

    if(snake_y+1 <= ancho){
        console.log("4 if");
        camino.push(thinkprofundidad(snake_x,snake_y+1,food_x,food_y));
        if(camino && camino.length > 0 && camino[camino.length] != []){
            camino.push("este");
            console.log("pusheando este");
            return "este";
        }
    }

    if(snake_x+1 <= alto){
        console.log("5 if");
        camino.push(thinkprofundidad(snake_x+1,snake_y,food_x,food_y));
        if(camino && camino.length > 0 && camino[camino.length] != []){
            camino.push("sur");
            console.log("pusheando sur");
            return "sur";
        }
    }

    if(snake_y-1 >= 0){
        console.log("6 if");
        camino.push(thinkprofundidad(snake_x,snake_y-1,food_x,food_y));
        if(camino && camino.length > 0 && camino[camino.length]!= []){
            camino.push("oeste");
            console.log("pusheando oeste");
            return "oeste";
        }
    }
    console.log("salgo...f");
    // console.timeEnd("bench");
    return [];

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
          console.log("comida: ",food_x,food_y);
        // socket.emit('next_move',"down")
    });

    socket.on('snake_coords', function (data) {
        // console.time("coords");
        var data;
        snake_x=data.snake_x;
        snake_y=data.snake_y;
        // console.log("serpiente: ",snake_x,snake_y);
        data = thinkprofundidad(snake_x,snake_y,food_x,food_y,ultmov,ultdir);
        console.log(data);
        ultmov=data.movimiento;
        ultdir=data.direccion;
        socket.emit('next_move',data.movimiento);
        // console.timeEnd("coords");
    });

});

function emular(x,y,fx,fy){
    var res = [];
    res = thinkprofundidad(x,y,fx,fy);
    if(res.length > 0){
        for(var i=0;i<res.length;i++){
            console.log(res[i]);
        }
    }else{
        console.log("ELSE-----------------");
        console.log(res);
    }
}

http.listen(3000, function(){
    console.log('listening on *:3000');
    emular(0,4,5,5);
});