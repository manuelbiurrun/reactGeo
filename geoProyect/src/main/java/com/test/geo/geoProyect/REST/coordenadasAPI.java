package com.test.geo.geoProyect.REST;


import com.test.geo.geoProyect.entidades.Coordenada;
import com.test.geo.geoProyect.repos.CoordenadasRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class coordenadasAPI {


    private final CoordenadasRepo coordenadasRepo;

    @Autowired
    public coordenadasAPI(CoordenadasRepo coordenadasRepo) {
        this.coordenadasRepo = coordenadasRepo;
    }

    @GetMapping(path = "/todas")
    public ResponseEntity<List<Coordenada>> getAllCoordenadas() {
        List<Coordenada> coordenadas = coordenadasRepo.findAll();
        for (Coordenada coordenada : coordenadas) {
            System.out.println(coordenada.getLatitud() + ", " + coordenada.getLongitud());
        }
        return new ResponseEntity<>(coordenadas, HttpStatus.OK);
    }
/*
    @GetMapping(path = "/todasMobile")
    public ResponseEntity<List<Coordenada>> getAllCoordenadasMobile(@RequestBody String coordenada) {
        List coordenadas = coordenadasRepo.findAll();
        //falta filtrar las coordenadas dependiendo de la longitud y la latitud del cliente
        return new ResponseEntity<>(coordenadas, HttpStatus.OK);
    }
*/
    @PostMapping(path = "/agregar")
    public ResponseEntity<Coordenada> agregarCoordenadas(@RequestBody String coordenada) {
        String[] latLng = coordenada.split(",");
        String[] latitud = latLng[0].split(":");
        String[] longitud = latLng[1].split(":");
        System.out.println(latitud[2] + ", " + longitud[1].replaceAll("}", ""));
        Coordenada coo = new Coordenada(Double.parseDouble(latitud[2]), Double.parseDouble(longitud[1].replaceAll("}", "")));
        coordenadasRepo.save(coo);
        return new ResponseEntity<>(coo, HttpStatus.CREATED);
    }
}
