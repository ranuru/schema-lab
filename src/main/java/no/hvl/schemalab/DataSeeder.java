package no.hvl.schemalab;

import no.hvl.schemalab.model.*;
import no.hvl.schemalab.repository.AppUserRepository;
import no.hvl.schemalab.repository.ChallengeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

  private final ChallengeRepository challengeRepository;
  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;

  public DataSeeder(ChallengeRepository challengeRepository,
      AppUserRepository appUserRepository,
      PasswordEncoder passwordEncoder) {
    this.challengeRepository = challengeRepository;
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    seedDevUser();
    if (challengeRepository.count() == 0) {
      seedChallenge1();
      seedChallenge2();
    }
  }

  private void seedDevUser() {
    if (appUserRepository.findByUsername("dev").isEmpty()) {
      AppUser dev = new AppUser();
      dev.setUsername("dev");
      dev.setPasswordHash(passwordEncoder.encode("dev"));
      dev.setRole("USER");
      appUserRepository.save(dev);
    }
  }

  private void seedChallenge1() {
    Challenge c = new Challenge();
    c.setTitle("Customer vs Person");
    c.setDescription("Schema A models a customer. Schema B models a person. " +
        "Both represent the same entity with different field names. Write a function " +
        "that returns an array of mappings from Schema A fields to Schema B fields.");
    c.setDifficulty("EASY");
    c.setType("SCHEMA_MATCHING");

    c.setStarterCode("""
        /**
         * Match fields from schemaA to schemaB.
         * @param {Object} schemaA - JSON Schema object
         * @param {Object} schemaB - JSON Schema object
         * @returns {Array<{source: string, target: string}>}
         */
        function matchSchemas(schemaA, schemaB) {
          return [];
        }
        """);

    c.setHarnessCode("""
        self.onmessage = function(e) {
          const { userCode, input } = e.data;
          try {
            eval(userCode);
            const result = matchSchemas(input.schemaA, input.schemaB);
            self.postMessage({ ok: true, result });
          } catch(err) {
            self.postMessage({ ok: false, error: err.message });
          }
        };
        """);

    String schemaAContent = """
        {
          "type": "object",
          "properties": {
            "customerId": { "type": "string" },
            "firstName":  { "type": "string" },
            "lastName":   { "type": "string" },
            "emailAddr":  { "type": "string" },
            "dob":        { "type": "string", "format": "date" }
          }
        }""";

    String schemaBContent = """
        {
          "type": "object",
          "properties": {
            "personId":    { "type": "string" },
            "given_name":  { "type": "string" },
            "family_name": { "type": "string" },
            "email":       { "type": "string" },
            "birth_date":  { "type": "string", "format": "date" }
          }
        }""";

    SchemaDoc schemaA = new SchemaDoc();
    schemaA.setLabel("Schema A");
    schemaA.setFormat("JSON_SCHEMA");
    schemaA.setContent(schemaAContent);
    schemaA.setChallenge(c);

    SchemaDoc schemaB = new SchemaDoc();
    schemaB.setLabel("Schema B");
    schemaB.setFormat("JSON_SCHEMA");
    schemaB.setContent(schemaBContent);
    schemaB.setChallenge(c);

    c.setSchemas(List.of(schemaA, schemaB));

    String inputJson = """
        {
          "schemaA": {
            "type": "object",
            "properties": {
              "customerId": { "type": "string" },
              "firstName":  { "type": "string" },
              "lastName":   { "type": "string" },
              "emailAddr":  { "type": "string" },
              "dob":        { "type": "string", "format": "date" }
            }
          },
          "schemaB": {
            "type": "object",
            "properties": {
              "personId":    { "type": "string" },
              "given_name":  { "type": "string" },
              "family_name": { "type": "string" },
              "email":       { "type": "string" },
              "birth_date":  { "type": "string", "format": "date" }
            }
          }
        }""";

    String expectedJson = """
        [
          { "source": "customerId", "target": "personId" },
          { "source": "firstName",  "target": "given_name" },
          { "source": "lastName",   "target": "family_name" },
          { "source": "emailAddr",  "target": "email" },
          { "source": "dob",        "target": "birth_date" }
        ]""";

    TestCase visible = new TestCase();
    visible.setDescription("Match all fields");
    visible.setInputJson(inputJson);
    visible.setExpectedJson(expectedJson);
    visible.setHidden(false);
    visible.setChallenge(c);

    TestCase hidden = new TestCase();
    hidden.setDescription("Order-independent match");
    hidden.setInputJson(inputJson);
    hidden.setExpectedJson(expectedJson);
    hidden.setHidden(true);
    hidden.setChallenge(c);

    c.setTestCases(List.of(visible, hidden));

    challengeRepository.save(c);
  }

  private void seedChallenge2() {
    Challenge c = new Challenge();
    c.setTitle("Name Field Split");
    c.setDescription("Version 1 of this schema stores a person's full name in a " +
        "single 'fullName' field. Version 2 splits this into 'firstName' and " +
        "'lastName'. Write a migration function that transforms a v1 instance " +
        "into a valid v2 instance.");
    c.setDifficulty("EASY");
    c.setType("SCHEMA_VERSIONING");

    c.setStarterCode("""
        /**
         * Migrate a record from schema v1 to schema v2.
         * @param {Object} record - A v1 record instance
         * @returns {Object} - A v2 record instance
         */
        function migrate(record) {
          return {};
        }
        """);

    c.setHarnessCode("""
        self.onmessage = function(e) {
          const { userCode, input } = e.data;
          try {
            eval(userCode);
            const result = migrate(input.record);
            self.postMessage({ ok: true, result });
          } catch(err) {
            self.postMessage({ ok: false, error: err.message });
          }
        };
        """);

    String v1Content = """
        {
          "type": "object",
          "properties": {
            "id":       { "type": "string" },
            "fullName": { "type": "string" },
            "email":    { "type": "string" }
          }
        }""";

    String v2Content = """
        {
          "type": "object",
          "properties": {
            "id":        { "type": "string" },
            "firstName": { "type": "string" },
            "lastName":  { "type": "string" },
            "email":     { "type": "string" }
          }
        }""";

    SchemaDoc v1 = new SchemaDoc();
    v1.setLabel("Version 1");
    v1.setFormat("JSON_SCHEMA");
    v1.setContent(v1Content);
    v1.setChallenge(c);

    SchemaDoc v2 = new SchemaDoc();
    v2.setLabel("Version 2");
    v2.setFormat("JSON_SCHEMA");
    v2.setContent(v2Content);
    v2.setChallenge(c);

    c.setSchemas(List.of(v1, v2));

    record TestData(String fullName, String firstName, String lastName, String id, String email) {
    }
    var tests = List.of(
        new TestData("Ada Lovelace", "Ada", "Lovelace", "1", "ada@example.com"),
        new TestData("Alan Turing", "Alan", "Turing", "2", "alan@example.com"),
        new TestData("Grace Hopper", "Grace", "Hopper", "3", "grace@example.com"));

    List<TestCase> testCases = tests.stream().map(t -> {
      TestCase tc = new TestCase();
      tc.setDescription("Migrate " + t.fullName());
      tc.setInputJson(String.format(
          "{\"record\":{\"id\":\"%s\",\"fullName\":\"%s\",\"email\":\"%s\"}}",
          t.id(), t.fullName(), t.email()));
      tc.setExpectedJson(String.format(
          "{\"id\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"email\":\"%s\"}",
          t.id(), t.firstName(), t.lastName(), t.email()));
      tc.setHidden(false);
      tc.setChallenge(c);
      return tc;
    }).toList();

    c.setTestCases(testCases);

    challengeRepository.save(c);
  }
}
