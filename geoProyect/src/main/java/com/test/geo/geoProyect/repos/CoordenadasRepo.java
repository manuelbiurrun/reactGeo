package com.test.geo.geoProyect.repos;

import com.test.geo.geoProyect.entidades.Coordenada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordenadasRepo extends JpaRepository<Coordenada, Long> {

}
