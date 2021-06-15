package com.baverage.backend.repo;

//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
//import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Date;

import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
//import org.springframework.web.servlet.tags.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.CrudRepository;
//import org.springframework.data.repository.repository.Repository;

import com.baverage.backend.dto.OffeneBestellung;
import com.baverage.backend.DatabaseConnection.Bestellungen;
import com.baverage.backend.DatabaseConnection.Stati.Status;

/**
 * Erlaubt angepasste Export Mappings des Repositories
 */
//@RepositoryRestResource
@org.springframework.stereotype.Repository
public interface BestellungRepo extends CrudRepository<Bestellungen, Integer>{
    @Query("SELECT NEW com.baverage.backend.dto.OffeneBestellung(b.id, platz.tisch.id, get.name, get.groesse) FROM Bestellungen b INNER JOIN b.getraenk get ON b.getraenk = get.id INNER JOIN b.platz platz ON b.platz = platz.id WHERE b.status = 1 ") 
    Collection<OffeneBestellung> getOffeneBestellungen();

    @Query("SELECT b FROM Bestellungen b")
    Collection<Bestellungen> getAlleBestellungen();

    @Query("SELECT b FROM Bestellungen b WHERE b.id = 1")
    Collection<Bestellungen> getID();

    @Modifying
    @Transactional
    @Query("UPDATE Bestellungen b set b.status.id = :status_id, b.zeitpunkt_vorbereitet = :dateNow WHERE b.id = :bestellungs_id")
    int setBestellungsStatusVorbereitet(@Param("bestellungs_id") int bestellungs_id, @Param("dateNow") Date dateNow, @Param("status_id") int status_id);

    @Query("SELECT b.status.id FROM Bestellungen b WHERE b.id =:id ")
	int getStatusForBestellung(@Param("id") int id);
}
