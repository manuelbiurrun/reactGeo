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
        List coordenadas = coordenadasRepo.findAll();
        return new ResponseEntity<>(coordenadas, HttpStatus.OK);
    }

    @GetMapping(path = "/todasMobile")
    public ResponseEntity<List<Coordenada>> getAllCoordenadasMobile(@RequestBody String Lat, @RequestBody String Lng) {
        List coordenadas = coordenadasRepo.findAll();
        //falta filtrar las coordenadas dependiendo de la longitud y la latitud del cliente
        return new ResponseEntity<>(coordenadas, HttpStatus.OK);
    }

    @PostMapping(path = "/agregar")
    public ResponseEntity<Coordenada> agregarCoordenadas(@RequestBody Coordenada coordenada) {
        Coordenada coo = new Coordenada(coordenada.getLatitud(), coordenada.getLongitud());
        coordenadasRepo.save(coo);
        return new ResponseEntity<>(coo, HttpStatus.CREATED);
    }
}
