package com.test.geo.geoProyect;

import com.test.geo.geoProyect.entidades.Coordenada;
import com.test.geo.geoProyect.repos.CoordenadasRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class GeoProyectApplication {

	@Autowired
	private CoordenadasRepo coordenadasRepo;

	public static void main(String[] args) {
		SpringApplication.run(GeoProyectApplication.class, args);
	}

	@PostConstruct
	protected void init() {
		Coordenada c = new Coordenada(-34.55348255233574, -56.61497145312501);
		coordenadasRepo.save(c);
	}
}
