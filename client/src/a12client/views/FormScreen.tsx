// FormScreen — the custom "FormEngine" view that wraps FormEngineViews.FormEngine
// with wiki12's own action bar and read-only handling. Registered AFTER
// withFormEngineView so it overrides the default "FormEngine" view.
//
// Why a wrapper: the generated form model renders a Save/Cancel button panel, but
// the form engine does NOT auto-translate those into a Client save — so we suppress
// the model's button panel (formModelMap) and drive persistence ourselves:
//   - Create/Edit → Save dispatches ActivityActions.save (our data provider does the
//     ADD/MODIFY), then navigates to the saved item's View; Cancel goes back.
//   - View → read-only (Commands.setReadonly), with Edit + Delete actions.
import type { ReactElement } from "react";
import { useStore } from "react-redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

import { deleteDocument } from "../../api/content";
import { markdownButtonlessFormModelMap, markdownWidgetMap } from "../../widgets/markdownWidgetMap";
import { editUrl, navigate, viewUrl, type Store } from "../routing";
import { splitDocRef } from "../docRefParts";

interface ViewProps {
  readonly activityId: string;
}

// The connected FormEngine view; cast to a loose props type so we can spread the
// full (untyped-here) View props plus our Config overrides.
const FormEngine = FormEngineViews.FormEngine as unknown as (
  props: Record<string, unknown>,
) => ReactElement;

function descriptorOf(store: Store, activityId: string): Record<string, string> {
  const s = store.getState() as { activities?: Record<string, { descriptor?: Record<string, string> }> };
  return s.activities?.[activityId]?.descriptor ?? {};
}

function documentIdOf(store: Store, activityId: string): string | undefined {
  const s = store.getState() as {
    activities?: Record<string, { dataHolders?: { data?: { document?: { id?: string } } }[] }>;
  };
  return s.activities?.[activityId]?.dataHolders?.[0]?.data?.document?.id;
}

/** Dispatch save and navigate to the saved item's View once persisted. */
function saveAndView(store: Store, activityId: string): void {
  const unsubscribe = store.subscribe(() => {
    const s = store.getState() as {
      activities?: Record<string, { dataHolders?: { savingState?: string }[] }>;
    };
    const savingState = s.activities?.[activityId]?.dataHolders?.[0]?.savingState;
    if (savingState === "saved") {
      unsubscribe();
      const id = documentIdOf(store, activityId);
      if (id) navigate(store, viewUrl(id));
    }
  });
  store.dispatch(ActivityActions.save.started({ activityId }));
}

async function confirmDelete(store: Store, instance: string): Promise<void> {
  if (!window.confirm(`Delete ${instance}? This cannot be undone.`)) return;
  const { model, id } = splitDocRef(instance);
  await deleteDocument(model, id);
  navigate(store, "/");
}

export function FormScreen(props: ViewProps): ReactElement {
  const store = useStore() as unknown as Store;
  const { activityId } = props;
  const descriptor = descriptorOf(store, activityId);
  const mode = descriptor.mode;
  const instance = descriptor.instance ?? "";
  // Read-only for View is requested via the activity-creation UI slice (routing.ts).

  return (
    <div className="wiki12-formscreen" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Hide the form engine's built-in Save/Cancel footer: wiki12 drives
          persistence via its own action bar below. (The footer is part of the
          connected FormEngine ContentBox, not the form model, so CSS is the seam.) */}
      <style>{`.wiki12-formscreen [data-role="contentbox-footer"] { display: none !important; }`}</style>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <FormEngine
          {...(props as unknown as Record<string, unknown>)}
          cardView
          disabled={mode === "view"}
          widgetMap={markdownWidgetMap}
          formModelMap={markdownButtonlessFormModelMap}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #e0e0e0",
          justifyContent: "flex-end",
        }}
      >
        {mode === "view" ? (
          <>
            <Button label="Edit" primary onClick={() => navigate(store, editUrl(instance))} />
            <Button
              label="Delete"
              destructive
              onClick={() => void confirmDelete(store, instance)}
            />
          </>
        ) : (
          <>
            <Button label="Cancel" secondary onClick={() => navigate(store, "/")} />
            {mode === "edit" && (
              <Button
                label="Delete"
                destructive
                onClick={() => void confirmDelete(store, instance)}
              />
            )}
            <Button label="Save" primary onClick={() => saveAndView(store, activityId)} />
          </>
        )}
      </div>
    </div>
  );
}
