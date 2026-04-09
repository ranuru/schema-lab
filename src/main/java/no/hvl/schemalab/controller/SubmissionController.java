package no.hvl.schemalab.controller;

import no.hvl.schemalab.model.AppUser;
import no.hvl.schemalab.model.Challenge;
import no.hvl.schemalab.model.Submission;
import no.hvl.schemalab.repository.AppUserRepository;
import no.hvl.schemalab.repository.ChallengeRepository;
import no.hvl.schemalab.repository.SubmissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final AppUserRepository appUserRepository;
    private final ChallengeRepository challengeRepository;

    public SubmissionController(SubmissionRepository submissionRepository,
            AppUserRepository appUserRepository,
            ChallengeRepository challengeRepository) {
        this.submissionRepository = submissionRepository;
        this.appUserRepository = appUserRepository;
        this.challengeRepository = challengeRepository;
    }

    @PostMapping
    public ResponseEntity<Submission> createSubmission(@RequestBody Map<String, Object> body) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long challengeId = Long.valueOf(body.get("challengeId").toString());
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        Submission submission = new Submission();
        submission.setCode((String) body.get("code"));
        submission.setStatus((String) body.get("status"));
        submission.setTestResults(body.get("testResults").toString());
        submission.setSubmittedAt(Instant.now());
        submission.setUser(user);
        submission.setChallenge(challenge);

        return ResponseEntity.ok(submissionRepository.save(submission));
    }

    @GetMapping("/me")
    public List<Submission> mySubmissions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return submissionRepository.findByUser(user);
    }
}
