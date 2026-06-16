# wiki12 Data Service.
#
# Runs the **stock A12 Data Service fat jar** (`dataservices-server-app`, public/no-auth
# on a12-community-maven) with the **wiki12 extension** compiled in: the content-envelope
# lifecycle listener (slug / searchText / CreatedOn / Title / Changes) and the custom
# `ResolveBySlug` + `UnifiedSearch` JSON-RPC operations.
#
# Build approach (ADR-0005; AUTONOMOUS-DECISIONS.md D2/D5): rather than re-bootstrap a
# custom Spring Boot app, the extension is compiled against the fat jar's OWN bundled A12
# jars (guaranteeing binary compatibility) and its classes + a Spring Boot
# AutoConfiguration are merged into the fat jar's BOOT-INF/classes. The stock
# ServerApplication then registers the wiki12 beans via @EnableAutoConfiguration.

# ---- builder: compile the extension and merge it into the fat jar --------------------
FROM eclipse-temurin:21-jdk AS builder

ARG A12_DS_VERSION=38.4.2
ARG A12_MAVEN=https://artifacts.geta12.com/artifactory/a12-community-maven/com/mgmtp/a12/dataservices/dataservices-server-app

# `zip` is used to merge into the fat jar WITHOUT recompressing its nested BOOT-INF/lib
# jars (which must stay STORED for the Spring Boot loader); `jar uf` would corrupt them.
RUN apt-get update && apt-get install -y --no-install-recommends zip && rm -rf /var/lib/apt/lists/*

WORKDIR /build
ADD ${A12_MAVEN}/${A12_DS_VERSION}/dataservices-server-app-${A12_DS_VERSION}-fatjar.jar /build/app.jar

# Extract the fat jar's bundled libraries to use as the compile classpath.
RUN mkdir -p libs && (cd libs && jar xf /build/app.jar BOOT-INF/lib)

# Compile the wiki12 extension sources (no Lombok; plain Java) against those libs.
COPY src/main/java /build/src
RUN mkdir -p classes \
 && javac --release 21 -cp "libs/BOOT-INF/lib/*" -d classes \
      src/net/mgmtp/wiki12/slug/Slugifier.java \
      src/net/mgmtp/wiki12/slug/WikiAnnotations.java \
      src/net/mgmtp/wiki12/slug/EditableField.java \
      src/net/mgmtp/wiki12/slug/ModelDerivationConfig.java \
      src/net/mgmtp/wiki12/slug/ModelConfigRegistry.java \
      src/net/mgmtp/wiki12/slug/ContentDerivationService.java \
      src/net/mgmtp/wiki12/slug/WikiContentLifecycleListener.java \
      src/net/mgmtp/wiki12/operation/ResolveBySlugOperation.java \
      src/net/mgmtp/wiki12/operation/UnifiedSearchOperation.java \
      src/net/mgmtp/wiki12/WikiExtAutoConfiguration.java

# Bundle the AutoConfiguration.imports alongside the classes, then merge everything into
# the fat jar under BOOT-INF/classes (implicitly first on the JarLauncher classpath).
COPY src/main/resources /build/resources
RUN mkdir -p stage/BOOT-INF/classes \
 && cp -r classes/. stage/BOOT-INF/classes/ \
 && mkdir -p stage/BOOT-INF/classes/META-INF/spring \
 && cp resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports \
       stage/BOOT-INF/classes/META-INF/spring/ \
 && (cd stage && zip -q -r /build/app.jar BOOT-INF)

# ---- runtime -------------------------------------------------------------------------
FROM eclipse-temurin:21-jre AS runtime

ARG A12_DS_VERSION=38.4.2
ARG WIKI12_VERSION=0.1.0

LABEL org.opencontainers.image.title="wiki12-data-service" \
      org.opencontainers.image.version="${WIKI12_VERSION}" \
      net.mgmtp.wiki12.a12-data-service-version="${A12_DS_VERSION}"

WORKDIR /app
COPY --from=builder /build/app.jar /app/app.jar

# Models are mounted read-only at /opt/wiki12/models by docker-compose; the server
# imports them on init (see application config / compose env).
RUN mkdir -p /opt/wiki12/models

# wiki12 server config bundle (the `shared` + `wiki12` profiles, auth resources) that the
# stock fatjar does NOT ship — includes the custom-op allow-list (ResolveBySlug,
# UnifiedSearch).
COPY config /opt/wiki12/config

ENV SPRING_CONFIG_ADDITIONAL_LOCATION=file:/opt/wiki12/config/ \
    SPRING_PROFILES_ACTIVE=dataservices-uaa,dataservices-rpc,dataservices-actuators,dataservices-embedded_contentstore,dataservices-external_postgres,shared,wiki12

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
