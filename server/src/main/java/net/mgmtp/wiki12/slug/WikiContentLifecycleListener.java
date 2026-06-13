package net.mgmtp.wiki12.slug;

import com.mgmtp.a12.dataservices.event.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.event.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.event.DocumentBeforeUpdateEvent;
import com.mgmtp.a12.kernel.md.document.v2.DocumentV2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Before-write lifecycle listener that derives the read-only {@code slug} and the
 * {@code searchText} blob for every wiki12 content document, inside the write
 * transaction (ADR-0001, findings §1a/§3).
 *
 * <p>This class is the A12 wiring; the actual derivation, the advisory lock, and the
 * collision query live in {@link SlugDerivationService} so they can be reasoned about
 * (and, where the A12 API is stubbed, swapped) independently of the event plumbing.
 *
 * <p>Listener registration follows the documented idiom from
 * {@code docs/a12/overall/dev_tutorial_backend_document_manipulation.md}: a Spring
 * {@code @Component} with {@code @CommonDataServicesEventListener}-annotated methods
 * taking the {@code DocumentBefore*Event}; the mutated document is handed back to the
 * event via its setter so Data Services persists it.
 */
// VERIFY against docs/a12/overall/dev_tutorial_backend_document_manipulation.md:
//   the import paths for CommonDataServicesEventListener and the
//   DocumentBefore{Create,Update}Event classes are inferred. The tutorial shows the
//   simple names but not their fully-qualified package. Confirm the package
//   (likely com.mgmtp.a12.dataservices.event or .common.event) against a live build.
@Slf4j
@Component
@RequiredArgsConstructor
public class WikiContentLifecycleListener {

    private final SlugDerivationService slugDerivationService;

    /**
     * Before a content document is created: take the advisory lock on the slug text
     * part, derive the namespaced slug (with sticky {@code _N} on collision) and the
     * {@code searchText} blob, then write both back onto the new document.
     */
    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        // VERIFY against the tutorial: getCreatedDocument()/setCreatedDocument(...) are
        // the documented accessors on DocumentBeforeCreateEvent.
        DocumentV2 created = event.getCreatedDocument();
        SlugDerivationService.Result result = slugDerivationService.deriveForCreate(created);
        if (result.changed()) {
            event.setCreatedDocument(result.document());
        }
        // On create there is no "old" slug, so no rename notification is attached.
    }

    /**
     * Before a content document is updated: re-derive slug + searchText. If the
     * derived slug differs from the persisted one, attach an old→new rename diff so
     * the client can surface it (ADR-0001). The sticky suffix is preserved when the
     * name part is unchanged.
     */
    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        // VERIFY against the tutorial: getUpdatedDocument()/getPersistedDocument()/
        // setUpdatedDocument(...) are the documented accessors on
        // DocumentBeforeUpdateEvent.
        DocumentV2 updated = event.getUpdatedDocument();
        DocumentV2 persisted = event.getPersistedDocument();
        SlugDerivationService.Result result = slugDerivationService.deriveForUpdate(updated, persisted);
        if (result.changed()) {
            event.setUpdatedDocument(result.document());
        }
        if (result.slugChanged()) {
            // VERIFY: the mechanism for returning a non-document payload (the old→new
            // rename diff) to the client from a before-update listener is inferred.
            // A12 may expose this via event metadata, a per-request "notifications"
            // collector bean, or an interceptor on the RPC response. The architecture
            // requires the response to carry old→new (ADR-0001). For now we log it and
            // expose it via SlugDerivationService.Result so a wiring point exists.
            log.info("Slug renamed for {}: {} -> {}",
                    safeModelId(updated), result.oldSlug(), result.newSlug());
        }
    }

    private static String safeModelId(DocumentV2 document) {
        // VERIFY: getDocumentModelId() is the documented DocumentV2 accessor used in
        // the tutorial (e.g. CONTACT_MODEL_NAME.equals(document.getDocumentModelId())).
        try {
            return document.getDocumentModelId();
        } catch (RuntimeException e) {
            return "<unknown>";
        }
    }
}
