package com.test.geo.geoProyect.entidades;

import javax.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Entity
public class Coordenada {

    @Id
    @SequenceGenerator(
            name = "coordenada_sequence",
            sequenceName = "coordenada_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "coordenada_sequence"
    )

    @Column(
            name = "Id",
            updatable = false
    )
    private Long Id;
    private Double latitud;
    private Double longitud;

    public Coordenada(Double latitud, Double longitud) {
        this.latitud = latitud;
        this.longitud = longitud;
    }
}
