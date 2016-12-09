var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var num_usuarios = 0;
var bye = "Hasta pronto!";
var usuarios = {};
var snake_x,snake_y,food_x,food_y,alto = 3,ancho = 3;

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

var camino = [];
var solucion=[[0,0],[0,0],[0,0]];
function thinkprofundidad(snake_x,snake_y,food_x,food_y,callback){
    console.log("Entrando,siendo si colision en ...",snake_x,snake_y,food_x,food_y);
    if(snake_x == food_x && snake_y == food_y){
        camino.push("fin");
        console.log("fin...");
        return callback(camino);
    }else{
        console.log(solucion[snake_x][snake_y]);
    }
    if(snake_x > ancho || snake_y > alto || snake_x < 0 || snake_y < 0 || solucion[snake_x][snake_y] == -1){
        console.log("ME HE CHOCAO EN ...",snake_x,snake_y,food_x,food_y);
        camino.push("");
        return callback(camino);
    }
    //ir al norte
    //else if(snake_x-1 >= 0){
    thinkprofundidad(snake_x-1,snake_y,food_x,food_y,function(datos) {
        datos.push("norte");
        console.log("colision yendo al norte, voy al oeste");
        return datos;
        //return callback;
    });
    thinkprofundidad(snake_x,snake_y-1,food_x,food_y,function(datos) {
        datos.push("oeste");
        console.log("colision yendo al oeste,voy al sur");
        return datos;
        //return callback;
    });
    thinkprofundidad(snake_x+1,snake_y,food_x,food_y,function(datos) {
        datos.push("sur");
        console.log("colision yendo al sur,soy al este");
        return datos;
        // return callback;
    });
    thinkprofundidad(snake_x,snake_y+1,food_x,food_y,function(datos) {
        datos.push("este");
        console.log("colision yendo al este, voy al norte");
        return datos;
        // return callback;
    });
    return "";


    //  }
    //   else if(snake_x+1 <= alto){

    // }
    // else if(snake_y-1 >= 0){

    // }
    // else if(snake_y+1 <= alto){

    // }
    //return callback(camino);
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
    // var res = [];
    res = thinkprofundidad(x,y,fx,fy,function(res){
        console.log("saliendo de funcion");
        if(res.length > 0){
            for(var i=0;i<res.length;i++){
                console.log(res[i]);
            }
        }else{
            console.log("ELSE-----------------");
            console.log(res);
        }
    });

}



http.listen(3000, function(){
    console.log('listening on *:3000');
    emular(1,1,2,2);
});