package net.mgmtp.wiki12;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Spring Boot auto-configuration that registers the wiki12 Data Service extensions
 * (the content-envelope lifecycle listener + custom operations) into the STOCK A12
 * Data Service application.
 *
 * <p>The deployed data-service runs the stock {@code dataservices-server-app} fat jar,
 * whose {@code @SpringBootApplication} only component-scans {@code com.mgmtp.a12.*}.
 * Auto-configurations, however, are loaded by {@code @EnableAutoConfiguration} from
 * every jar's {@code META-INF/spring/...AutoConfiguration.imports} regardless of base
 * package — so this class is how our {@code net.mgmtp.wiki12} beans get registered
 * without modifying the stock app (autonomous decision D2/D5).
 */
@AutoConfiguration
@ComponentScan({"net.mgmtp.wiki12.slug", "net.mgmtp.wiki12.operation"})
public class WikiExtAutoConfiguration {
}
