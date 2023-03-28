package edu.eci.arsw.collabpaint.controllers;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class STOMPMessagesHandler {
    ConcurrentHashMap<String, ArrayList<Point>> arrays = new ConcurrentHashMap<>();

    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        int max = 4;
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
        ArrayList<Point> arrayList = getArray(numdibujo);
        arrayList.add(pt);
        if (arrayList.size() % max == 0) {
            System.out.println("Draw polygon");
            msgt.convertAndSend("/topic/newpolygon." + numdibujo,
                    arrayList.subList(arrayList.size() - max, arrayList.size()));
        }
    }

    @MessageMapping("/updatedraw.{numdibujo}")
    public void handleUpdateEvent(@DestinationVariable String numdibujo) throws Exception {
        System.out.println("New connection to draw: " + numdibujo);
        ArrayList<Point> arrayList = getArray(numdibujo);
        msgt.convertAndSend("/topic/updatedraw." + numdibujo, arrayList);
    }

    public ArrayList<Point> getArray(String numdibujo) {
        String name = "array" + numdibujo;
        ArrayList<Point> array = arrays.get(name);
        if (array != null)
            return array;
        else {
            arrays.put(name, new ArrayList<>());
            return arrays.get(name);
        }
    }
}
