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
      seedChallenge3();
      seedChallenge4();
      seedChallenge5();
      seedChallenge6();
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

  private void seedChallenge3() {
    Challenge c = new Challenge();
    c.setTitle("Product vs Item");
    c.setDescription("Schema A models a product in an e-commerce system. " +
        "Schema B models an item in an inventory system. Both represent the same " +
        "concept with different field names. Write a function that returns an array " +
        "of mappings from Schema A fields to Schema B fields.");
    c.setDifficulty("MEDIUM");
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

    SchemaDoc schemaA = new SchemaDoc();
    schemaA.setLabel("Schema A");
    schemaA.setFormat("JSON_SCHEMA");
    schemaA.setContent("""
        {
          "type": "object",
          "properties": {
            "productCode": { "type": "string" },
            "productName": { "type": "string" },
            "unitPrice":   { "type": "number" },
            "stockQty":    { "type": "integer" },
            "categoryTag": { "type": "string" }
          }
        }""");
    schemaA.setChallenge(c);

    SchemaDoc schemaB = new SchemaDoc();
    schemaB.setLabel("Schema B");
    schemaB.setFormat("JSON_SCHEMA");
    schemaB.setContent("""
        {
          "type": "object",
          "properties": {
            "sku":      { "type": "string" },
            "title":    { "type": "string" },
            "price":    { "type": "number" },
            "quantity": { "type": "integer" },
            "category": { "type": "string" }
          }
        }""");
    schemaB.setChallenge(c);

    c.setSchemas(List.of(schemaA, schemaB));

    String inputJson = """
        {
          "schemaA": {
            "type": "object",
            "properties": {
              "productCode": { "type": "string" },
              "productName": { "type": "string" },
              "unitPrice":   { "type": "number" },
              "stockQty":    { "type": "integer" },
              "categoryTag": { "type": "string" }
            }
          },
          "schemaB": {
            "type": "object",
            "properties": {
              "sku":      { "type": "string" },
              "title":    { "type": "string" },
              "price":    { "type": "number" },
              "quantity": { "type": "integer" },
              "category": { "type": "string" }
            }
          }
        }""";

    String expectedJson = """
        [
          { "source": "productCode", "target": "sku" },
          { "source": "productName", "target": "title" },
          { "source": "unitPrice",   "target": "price" },
          { "source": "stockQty",    "target": "quantity" },
          { "source": "categoryTag", "target": "category" }
        ]""";

    TestCase visible = new TestCase();
    visible.setDescription("Match all product fields to item fields");
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

  private void seedChallenge4() {
    Challenge c = new Challenge();
    c.setTitle("Address Normalization");
    c.setDescription("Version 1 stores address fields (street, city, postalCode, country) " +
        "as flat top-level fields on the record. Version 2 nests them inside an 'address' object. " +
        "Write a migration function that transforms a v1 record into a valid v2 record.");
    c.setDifficulty("MEDIUM");
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

    SchemaDoc v1 = new SchemaDoc();
    v1.setLabel("Version 1");
    v1.setFormat("JSON_SCHEMA");
    v1.setContent("""
        {
          "type": "object",
          "properties": {
            "id":         { "type": "string" },
            "name":       { "type": "string" },
            "street":     { "type": "string" },
            "city":       { "type": "string" },
            "postalCode": { "type": "string" },
            "country":    { "type": "string" }
          }
        }""");
    v1.setChallenge(c);

    SchemaDoc v2 = new SchemaDoc();
    v2.setLabel("Version 2");
    v2.setFormat("JSON_SCHEMA");
    v2.setContent("""
        {
          "type": "object",
          "properties": {
            "id":   { "type": "string" },
            "name": { "type": "string" },
            "address": {
              "type": "object",
              "properties": {
                "street":     { "type": "string" },
                "city":       { "type": "string" },
                "postalCode": { "type": "string" },
                "country":    { "type": "string" }
              }
            }
          }
        }""");
    v2.setChallenge(c);

    c.setSchemas(List.of(v1, v2));

    record TestData(String id, String name, String street, String city, String postalCode, String country) {
    }
    var tests = List.of(
        new TestData("1", "Alice", "123 Main St", "Oslo", "0150", "Norway"),
        new TestData("2", "Bob", "456 Oak Ave", "Bergen", "5003", "Norway"),
        new TestData("3", "Carol", "789 Pine Rd", "Trondheim", "7011", "Norway"));

    List<TestCase> testCases = tests.stream().map(t -> {
      TestCase tc = new TestCase();
      tc.setDescription("Migrate " + t.name() + "'s record");
      tc.setInputJson(String.format(
          "{\"record\":{\"id\":\"%s\",\"name\":\"%s\",\"street\":\"%s\",\"city\":\"%s\",\"postalCode\":\"%s\",\"country\":\"%s\"}}",
          t.id(), t.name(), t.street(), t.city(), t.postalCode(), t.country()));
      tc.setExpectedJson(String.format(
          "{\"id\":\"%s\",\"name\":\"%s\",\"address\":{\"street\":\"%s\",\"city\":\"%s\",\"postalCode\":\"%s\",\"country\":\"%s\"}}",
          t.id(), t.name(), t.street(), t.city(), t.postalCode(), t.country()));
      tc.setHidden(false);
      tc.setChallenge(c);
      return tc;
    }).toList();

    c.setTestCases(testCases);

    challengeRepository.save(c);
  }

  private void seedChallenge5() {
    Challenge c = new Challenge();
    c.setTitle("Order vs Transaction");
    c.setDescription("Schema A models an order in an order management system. " +
        "Schema B models a transaction in a payment processing system. " +
        "Both represent the same business event but use completely different terminology. " +
        "Write a function that returns an array of mappings from Schema A fields to Schema B fields.");
    c.setDifficulty("HARD");
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

    SchemaDoc schemaA = new SchemaDoc();
    schemaA.setLabel("Schema A (Order)");
    schemaA.setFormat("JSON_SCHEMA");
    schemaA.setContent("""
        {
          "type": "object",
          "properties": {
            "orderId":           { "type": "string" },
            "placedAt":          { "type": "string", "format": "date-time" },
            "buyerId":           { "type": "string" },
            "itemCount":         { "type": "integer" },
            "subtotal":          { "type": "number" },
            "discountAmt":       { "type": "number" },
            "taxAmt":            { "type": "number" },
            "grandTotal":        { "type": "number" },
            "shippingMethod":    { "type": "string" },
            "fulfillmentStatus": { "type": "string" }
          }
        }""");
    schemaA.setChallenge(c);

    SchemaDoc schemaB = new SchemaDoc();
    schemaB.setLabel("Schema B (Transaction)");
    schemaB.setFormat("JSON_SCHEMA");
    schemaB.setContent("""
        {
          "type": "object",
          "properties": {
            "txnId":          { "type": "string" },
            "createdAt":      { "type": "string", "format": "date-time" },
            "accountId":      { "type": "string" },
            "lineItemCount":  { "type": "integer" },
            "baseAmount":     { "type": "number" },
            "discount":       { "type": "number" },
            "tax":            { "type": "number" },
            "totalAmount":    { "type": "number" },
            "deliveryMethod": { "type": "string" },
            "txnState":       { "type": "string" }
          }
        }""");
    schemaB.setChallenge(c);

    c.setSchemas(List.of(schemaA, schemaB));

    String inputJson = """
        {
          "schemaA": {
            "type": "object",
            "properties": {
              "orderId":           { "type": "string" },
              "placedAt":          { "type": "string", "format": "date-time" },
              "buyerId":           { "type": "string" },
              "itemCount":         { "type": "integer" },
              "subtotal":          { "type": "number" },
              "discountAmt":       { "type": "number" },
              "taxAmt":            { "type": "number" },
              "grandTotal":        { "type": "number" },
              "shippingMethod":    { "type": "string" },
              "fulfillmentStatus": { "type": "string" }
            }
          },
          "schemaB": {
            "type": "object",
            "properties": {
              "txnId":          { "type": "string" },
              "createdAt":      { "type": "string", "format": "date-time" },
              "accountId":      { "type": "string" },
              "lineItemCount":  { "type": "integer" },
              "baseAmount":     { "type": "number" },
              "discount":       { "type": "number" },
              "tax":            { "type": "number" },
              "totalAmount":    { "type": "number" },
              "deliveryMethod": { "type": "string" },
              "txnState":       { "type": "string" }
            }
          }
        }""";

    String expectedJson = """
        [
          { "source": "orderId",           "target": "txnId" },
          { "source": "placedAt",          "target": "createdAt" },
          { "source": "buyerId",           "target": "accountId" },
          { "source": "itemCount",         "target": "lineItemCount" },
          { "source": "subtotal",          "target": "baseAmount" },
          { "source": "discountAmt",       "target": "discount" },
          { "source": "taxAmt",            "target": "tax" },
          { "source": "grandTotal",        "target": "totalAmount" },
          { "source": "shippingMethod",    "target": "deliveryMethod" },
          { "source": "fulfillmentStatus", "target": "txnState" }
        ]""";

    TestCase visible = new TestCase();
    visible.setDescription("Match all order fields to transaction fields");
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

  private void seedChallenge6() {
    Challenge c = new Challenge();
    c.setTitle("Employee Record Overhaul");
    c.setDescription("Version 1 of this schema stores employee data with abbreviated field names " +
        "and a single 'fullName' field. Version 2 renames most fields, splits fullName into " +
        "firstName and lastName, and adds a new 'isActive' field that should default to true. " +
        "Write a migration function that transforms a v1 record into a valid v2 record.");
    c.setDifficulty("HARD");
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

    SchemaDoc v1 = new SchemaDoc();
    v1.setLabel("Version 1");
    v1.setFormat("JSON_SCHEMA");
    v1.setContent("""
        {
          "type": "object",
          "properties": {
            "empId":     { "type": "string" },
            "fullName":  { "type": "string" },
            "salary":    { "type": "number" },
            "managerId": { "type": "string" },
            "deptCode":  { "type": "string" },
            "hireDate":  { "type": "string", "format": "date" }
          }
        }""");
    v1.setChallenge(c);

    SchemaDoc v2 = new SchemaDoc();
    v2.setLabel("Version 2");
    v2.setFormat("JSON_SCHEMA");
    v2.setContent("""
        {
          "type": "object",
          "properties": {
            "id":           { "type": "string" },
            "firstName":    { "type": "string" },
            "lastName":     { "type": "string" },
            "annualSalary": { "type": "number" },
            "reportsTo":    { "type": "string" },
            "departmentId": { "type": "string" },
            "startDate":    { "type": "string", "format": "date" },
            "isActive":     { "type": "boolean" }
          }
        }""");
    v2.setChallenge(c);

    c.setSchemas(List.of(v1, v2));

    record TestData(String empId, String fullName, String firstName, String lastName,
        double salary, String managerId, String deptCode, String hireDate) {
    }
    var tests = List.of(
        new TestData("E001", "Marie Curie", "Marie", "Curie", 90000, "E010", "PHYS", "2019-03-15"),
        new TestData("E002", "Albert Einstein", "Albert", "Einstein", 95000, "E010", "PHYS", "2020-06-01"),
        new TestData("E003", "Lise Meitner", "Lise", "Meitner", 88000, "E011", "CHEM", "2021-09-10"));

    List<TestCase> testCases = tests.stream().map(t -> {
      TestCase tc = new TestCase();
      tc.setDescription("Migrate " + t.fullName());
      tc.setInputJson(String.format(
          "{\"record\":{\"empId\":\"%s\",\"fullName\":\"%s\",\"salary\":%.1f,\"managerId\":\"%s\",\"deptCode\":\"%s\",\"hireDate\":\"%s\"}}",
          t.empId(), t.fullName(), t.salary(), t.managerId(), t.deptCode(), t.hireDate()));
      tc.setExpectedJson(String.format(
          "{\"id\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"annualSalary\":%.1f,\"reportsTo\":\"%s\",\"departmentId\":\"%s\",\"startDate\":\"%s\",\"isActive\":true}",
          t.empId(), t.firstName(), t.lastName(), t.salary(), t.managerId(), t.deptCode(), t.hireDate()));
      tc.setHidden(false);
      tc.setChallenge(c);
      return tc;
    }).toList();

    c.setTestCases(testCases);

    challengeRepository.save(c);
  }
}
