package no.hvl.schemalab.controller;

import no.hvl.schemalab.model.Challenge;
import no.hvl.schemalab.model.SchemaDoc;
import no.hvl.schemalab.model.TestCase;
import no.hvl.schemalab.repository.ChallengeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeRepository challengeRepository;

    public ChallengeController(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listChallenges() {
        return challengeRepository.findAll().stream().map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", c.getId());
            m.put("title", c.getTitle());
            m.put("difficulty", c.getDifficulty());
            m.put("type", c.getType());
            return m;
        }).toList();
    }

    record SchemaDocRequest(String label, String format, String content) {}

    record TestCaseRequest(String description, String inputJson, String expectedJson, boolean hidden) {}

    record ChallengeCreateRequest(
            String title,
            String description,
            String difficulty,
            String type,
            String starterCode,
            String harnessCode,
            List<SchemaDocRequest> schemas,
            List<TestCaseRequest> testCases
    ) {}

    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody ChallengeCreateRequest req) {
        Challenge c = new Challenge();
        c.setTitle(req.title());
        c.setDescription(req.description());
        c.setDifficulty(req.difficulty());
        c.setType(req.type());
        c.setStarterCode(req.starterCode());
        c.setHarnessCode(req.harnessCode());

        if (req.schemas() != null) {
            for (var s : req.schemas()) {
                SchemaDoc doc = new SchemaDoc();
                doc.setLabel(s.label());
                doc.setFormat(s.format());
                doc.setContent(s.content());
                doc.setChallenge(c);
                c.getSchemas().add(doc);
            }
        }

        if (req.testCases() != null) {
            for (var t : req.testCases()) {
                TestCase tc = new TestCase();
                tc.setDescription(t.description());
                tc.setInputJson(t.inputJson());
                tc.setExpectedJson(t.expectedJson());
                tc.setHidden(t.hidden());
                tc.setChallenge(c);
                c.getTestCases().add(tc);
            }
        }

        Challenge saved = challengeRepository.save(c);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallenge(@PathVariable Long id) {
        return challengeRepository.findById(id).map(challenge -> {
            // Strip inputJson/expectedJson from hidden test cases
            for (TestCase tc : challenge.getTestCases()) {
                if (tc.isHidden()) {
                    tc.setInputJson(null);
                    tc.setExpectedJson(null);
                }
            }
            return ResponseEntity.ok(challenge);
        }).orElse(ResponseEntity.notFound().build());
    }
}
