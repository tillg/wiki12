# wiki12 Data Service.
#
# QA-bring-up approach (B4): run the **stock A12 Data Service fat jar**
# (`dataservices-server-app`, published on a12-community-maven, public/no-auth)
# rather than compiling a custom Spring Boot embed. This gives a real, working A12
# Data Service out of the box — stock CRUD (ADD_DOCUMENT/GET_DOCUMENT/QUERY),
# model import, Liquibase schema on Postgres.
#
# The wiki12 custom server logic (slug derivation listener, searchText, the
# ResolveBySlug / UnifiedSearch @RemoteOperations) is NOT in this stock jar — it
# needs to be compiled against the A12 artifacts and added as an extension jar
# (the old Gradle build stage, kept in git history / server/*.gradle + src/). That
# is the documented Tier-2 follow-on (see server/README.md + QA-LOG.md B4). The
# stock server is enough to exercise content CRUD end-to-end for QA.

FROM eclipse-temurin:21-jre AS runtime

# A12 Data Service version (independent of the wiki12 stack version).
ARG A12_DS_VERSION=38.4.2
ARG WIKI12_VERSION=0.1.0
ARG A12_MAVEN=https://artifacts.geta12.com/artifactory/a12-community-maven/com/mgmtp/a12/dataservices/dataservices-server-app

LABEL org.opencontainers.image.title="wiki12-data-service" \
      org.opencontainers.image.version="${WIKI12_VERSION}" \
      net.mgmtp.wiki12.a12-data-service-version="${A12_DS_VERSION}"

WORKDIR /app

# Pull the prebuilt fat jar (public, no auth — findings §6).
ADD ${A12_MAVEN}/${A12_DS_VERSION}/dataservices-server-app-${A12_DS_VERSION}-fatjar.jar /app/app.jar

# Models are mounted read-only at /opt/wiki12/models by docker-compose; the server
# imports them on init (see application config / compose env).
RUN mkdir -p /opt/wiki12/models

# wiki12 server config bundle (the `shared` + `wiki12` profiles, auth resources)
# that the stock fatjar does NOT ship — derived from the A12 Project Template
# (QA-LOG B5/B6). Added to the Spring config search path at runtime.
COPY config /opt/wiki12/config

# Sensible defaults (overridable by docker-compose).
ENV SPRING_CONFIG_ADDITIONAL_LOCATION=file:/opt/wiki12/config/ \
    SPRING_PROFILES_ACTIVE=dataservices-uaa,dataservices-rpc,dataservices-actuators,dataservices-embedded_contentstore,dataservices-external_postgres,shared,wiki12

EXPOSE 8080

# Config (external Postgres, model import, the wiki12 custom ops allow-list) comes
# from environment variables set by docker-compose (Spring relaxed binding).
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
