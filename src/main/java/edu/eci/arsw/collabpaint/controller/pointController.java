package edu.eci.arsw.collabpaint.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class pointController {

    @Autowired
    SimpMessagingTemplate msgt;



    @MessageMapping("/points.{number}")
    
    public void getPoints(Point point, @DestinationVariable String number ){
        msgt.convertAndSend("/topic/newpoint." + number, point);
            
    }
    
}
