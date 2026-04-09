package no.hvl.schemalab.controller;

import no.hvl.schemalab.model.Challenge;
import no.hvl.schemalab.model.TestCase;
import no.hvl.schemalab.repository.ChallengeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
