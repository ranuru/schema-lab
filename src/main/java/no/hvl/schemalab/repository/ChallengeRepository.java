package no.hvl.schemalab.repository;

import no.hvl.schemalab.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
}
