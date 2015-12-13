var socket = io();
      var login = false;
      $(document).ready(function(){
        if(login == false){
          $("#messages").hide();
          $("body").append('<h1>Introduzca nombre de usuario: </h1><input id=nick></input><button id=b_nick type=submit>Enviar</button>');
          $("#b_nick").click(function(){
            if($('#nick').val()!='')
              socket.emit('add user', $('#nick').val());
              socket.on('login',function(numero){
              $("#messages").show();
              $("#num_users").append(numero);  
              });
          });
        }
     
      });
      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
      socket.on('welcome', function(data){
        $('#messages').append($('<li>').text('Hola '+data));
      });
      socket.on('bye', function(data){
        $('#messages').append($('<li>').text(data));
      });