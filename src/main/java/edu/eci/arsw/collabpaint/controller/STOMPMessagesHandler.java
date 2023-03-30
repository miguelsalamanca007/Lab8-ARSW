package edu.eci.arsw.collabpaint.controller;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class STOMPMessagesHandler {
    ConcurrentHashMap<String, ArrayList<Point>> arrays = new ConcurrentHashMap<>();

    
	@Autowired
	SimpMessagingTemplate msgt;
    
	@MessageMapping("/newpoint.{numdibujo}")    
	public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
		System.out.println("Nuevo punto recibido en el servidor!:"+pt);
		msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
        ArrayList<Point> points = getPointsByName(numdibujo);
        points.add(pt);
        if(points.size() >= 4){
            msgt.convertAndSend("/topic/newpolygon."+numdibujo, points);
        }
        

	}

    public ArrayList<Point> getPointsByName(String name){
        String nameFind = "array" + name;
        ArrayList<Point> array = arrays.get(nameFind);
        if (array != null){ 
            return array;
        }
        else {
            arrays.put(nameFind, new ArrayList<>());
            return arrays.get(nameFind);
        }

    }

    
}
