package no.hvl.schemalab.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
public class ChallengeVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "challenge_id")
    private Challenge challenge;

    private String language;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String harnessTemplate;
}
