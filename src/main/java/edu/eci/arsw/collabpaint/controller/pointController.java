package edu.eci.arsw.collabpaint.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class pointController {



    @MessageMapping("/points")
    @SendTo("/topic/newpoint")
    public Point getPoints(Point point){
        System.out.println("a");
        return point;
    }
    
}
