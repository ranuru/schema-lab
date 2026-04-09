FROM gradle:9.4.1-jdk25 AS build
WORKDIR /app
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/build/libs/schemalab-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
