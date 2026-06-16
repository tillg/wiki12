package net.mgmtp.wiki12.slug;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Before-write lifecycle listener that derives the wiki12 standard content envelope
 * (slug, searchText, CreatedOn, Title, Changes) for every content document inside the
 * write transaction (ADR-0001 / ADR-0006). The derivation lives in
 * {@link ContentDerivationService}; this class is the A12 event wiring.
 */
@Component
public class WikiContentLifecycleListener {

    private static final Logger log = LoggerFactory.getLogger(WikiContentLifecycleListener.class);

    private final ContentDerivationService contentDerivationService;

    public WikiContentLifecycleListener(ContentDerivationService contentDerivationService) {
        this.contentDerivationService = contentDerivationService;
        log.info("wiki12: WikiContentLifecycleListener registered");
    }

    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        DocumentV2 created = event.getCreatedDocument();
        ContentDerivationService.Result result = contentDerivationService.deriveForCreate(created);
        if (result.changed()) {
            event.setCreatedDocument(result.document());
            log.info("wiki12: create — derived slug={}", result.newSlug());
        }
    }

    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        DocumentV2 updated = event.getUpdatedDocument();
        DocumentV2 persisted = event.getPersistedDocument();
        ContentDerivationService.Result result = contentDerivationService.deriveForUpdate(updated, persisted);
        if (result.changed()) {
            event.setUpdatedDocument(result.document());
        }
        if (result.slugChanged()) {
            log.info("wiki12: slug renamed {} -> {}", result.oldSlug(), result.newSlug());
        }
    }
}
