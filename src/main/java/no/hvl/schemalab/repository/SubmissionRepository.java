package no.hvl.schemalab.repository;

import no.hvl.schemalab.model.AppUser;
import no.hvl.schemalab.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser(AppUser user);
}
