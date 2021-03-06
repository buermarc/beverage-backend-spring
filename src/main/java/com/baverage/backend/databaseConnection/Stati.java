package com.baverage.backend.databaseConnection;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;
import javax.persistence.GenerationType;
import javax.persistence.GeneratedValue;
import com.fasterxml.jackson.annotation.JsonBackReference;

/*
 * This class contains all the necessary information about the measuring points.
 * To use Getters and Setters, you have to have Lombok installed. 
 * This class is a database table.
 * 
 * The status is definend in an enum.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
public class Stati implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String bezeichnung = "";

    @OneToMany(mappedBy = "status")
    @JsonBackReference
    List<Bestellungen> bestellungen;

    public enum Status {

        BESTELLT(1), VORBEREITET(2), GELIEFERT(3), AUFGETRUNKEN(4), ABGERBROCHEN(5);

        private final int id;

        private Status(int id) {
            this.id = id;
        }

        public int getId() {
            return this.id;
        }
    }

}
