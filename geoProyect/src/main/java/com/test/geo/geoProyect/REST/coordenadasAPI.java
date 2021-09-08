package com.test.geo.geoProyect.REST;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class coordenadasAPI {//comunicacion: Coordenada deberia tener lat, lng e id(autogenerada) -> repo(extiende a JpaRepository) -> api(rest)

    @Autowired
    private final coordenadasRepo coordenadasRepo;

    @GetMapping(path = "/todas")
    public List<Coordenada> getAllCoordenadas() {

    }

    @PostMapping(path = "/agregar")
    public Coordenada agregarCoordenadas(@RequestBody Coordenada coordenada) {

    }
}
