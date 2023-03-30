var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var SERVER = "";
    var TOPIC = "";
    var TOPICPOLYGON = "";

    var newPoint = {
        "x": 0,
        "y" : 0
    }

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("Canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("Canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    function drawPolygon(points) {
        var canvas = document.getElementById("Canvas");
        var ctx = canvas.getContext("2d");
        if(points.length > 4){
            ctx.clearRect(0, 0, canvas.width, canvas.height);  
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[0].x,points[0].y);
        ctx.closePath();
        ctx.stroke();
      }


    function sendPoint(point){
        var newPoint = {
            "x" : point.x,
            "y" : point.y
        }
        stompClient.send(SERVER,{},JSON.stringify(newPoint));

    }


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(TOPIC, function (eventbody) {
                var point = JSON.parse(eventbody.body);
                addPointToCanvas(point); 
            });

            stompClient.subscribe(TOPICPOLYGON,function (eventbody){
                var points = JSON.parse(eventbody.body);
                drawPolygon(points);
            })
        });

    };

    
    
    

    return {

        init: function () {
            var canvas = $("#Canvas");
            canvas = $("#Canvas")[0];
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", function(event){
                    newPoint = getMousePosition(event);
                    sendPoint(newPoint);
                })
            }
            else {
                canvas.addEventListener("mousedown", function (event) {
                    alert('mousedown at ' + event.clientX + ',' + event.clientY);
    
                });
            }
            //websocket connection
      
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            //agregar la linea que envia el punto
            sendPoint(pt);
            addPointToCanvas(pt);
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },

        connect: function(){
            var number = ($("#num").val());
            SERVER = "/app/newpoint." + number; 
            TOPIC = "/topic/newpoint." + number;
            TOPICPOLYGON = "/topic/newpolygon."+ number;
            connectAndSubscribe();

        }
    };

})();