var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

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


    function sendPoint(point){
        var newPoint = {
            "x" : point.x,
            "y" : point.y
        }
        stompClient.send("/app/points",{},JSON.stringify(newPoint));

    }


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var point = JSON.parse(eventbody.body);
                addPointToCanvas(point); 
            });
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
            connectAndSubscribe();
            
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
        }
    };

})();