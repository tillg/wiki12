package net.mgmtp.wiki12;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Spring Boot entrypoint for the wiki12 A12 Data Service.
 *
 * <p>The A12 Data Services platform supplies the bulk of the server (JSON-RPC endpoint,
 * query layer, persistence, model loading); this application boots it and contributes
 * the wiki12 custom beans — the slug lifecycle listener and the {@code ResolveBySlug} /
 * {@code UnifiedSearch} operations — by component-scanning {@code net.mgmtp.wiki12}.
 */
// VERIFY against the A12 Project Template's server/app main class: the platform may
// require importing its auto-configuration explicitly (e.g. a @Import of a
// DataServices configuration, or extending a provided application base) rather than
// relying solely on @SpringBootApplication auto-config. It may also need the A12 base
// packages added to the component scan. Confirm against the template's server app.
@SpringBootApplication
@ComponentScan(basePackages = {
        "net.mgmtp.wiki12",
        // VERIFY: the A12 platform base package(s) that must be scanned for the Data
        // Services beans (QueryService, IDocumentRepository, the RPC dispatcher, the
        // CommonDataServices event publisher). Likely "com.mgmtp.a12.dataservices".
        "com.mgmtp.a12.dataservices"
})
public class Wiki12DataServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(Wiki12DataServiceApplication.class, args);
    }
}
