package no.hvl.schemalab.controller;

import no.hvl.schemalab.model.AppUser;
import no.hvl.schemalab.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody Map<String, String> body) {
        AppUser user = new AppUser();
        user.setUsername(body.get("username"));
        user.setPasswordHash(passwordEncoder.encode(body.get("password")));
        user.setRole("USER");
        return ResponseEntity.ok(appUserRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AppUser> login() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return appUserRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
