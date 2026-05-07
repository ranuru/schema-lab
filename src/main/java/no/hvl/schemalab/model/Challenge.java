package no.hvl.schemalab.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String difficulty;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String harnessCode;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<SchemaDoc> schemas = new ArrayList<>();

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<TestCase> testCases = new ArrayList<>();

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ChallengeVariant> variants = new ArrayList<>();
}
