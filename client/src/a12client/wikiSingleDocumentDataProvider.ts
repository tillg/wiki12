// Custom single-document DataProvider for wiki12.
//
// WHY a custom provider (not the platform `createPlatformSingleDocumentDataProvider`):
// the platform provider's LOAD hardcodes a `QUERY exact_match on /__meta/docRef`
// PLUS a batched `LOAD_THUMBNAIL_URLS_INTERNAL` RPC and parses `result.entries[0]`
// — none of which wiki12's Data Service serves (it reads single docs with
// GET_DOCUMENT). Its MODIFY/DELETE also add a `locale` param wiki12 rejects (B21).
// So we mirror the platform provider's form-engine recipe but route persistence
// through wiki12's PROVEN `api/content.ts` ops. (architecture.md §4.)
//
// The form-engine pieces are unchanged: createEmptyDocumentDataProvider still
// handles the __NEW__ load; this provider handles load-existing, save (ADD/MODIFY)
// and delete, applying parseDates/preProcessDocument on load and
// filterDataByRelevance + formatDates on save — exactly as the platform provider.
import { call, put, select } from "typed-redux-saga";
import {
  Activity,
  ActivityActions,
  ActivitySelectors,
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { ModelSagas } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import {
  FormActivity,
  isFormModel,
  preProcessDocument,
} from "@com.mgmtp.a12.formengine/formengine-core";

import {
  createDocument,
  deleteDocument,
  getDocument,
  updateDocument,
} from "../api/content";
import type { ContentDocument } from "../api/content";
import { splitDocRef } from "./docRefParts";

// Resolve the form model + its referenced document model (carrying the
// generated validation code accessor) for the activity's scene.
function* resolveModels(activityId: string) {
  const models = yield* call(() => ModelSagas.waitForModelsLoaded(activityId));
  const formModel = models.find(isFormModel);
  if (!formModel) throw new Error("No form model in scene");
  const dmRef = (formModel as { header: { modelReferences?: { modelType: string; reference: string }[] } })
    .header.modelReferences?.find((r) => r.modelType === "document")?.reference;
  const documentModel = models.find((m) => (m as { header: { id: string } }).header.id === dmRef);
  if (!documentModel) throw new Error("No document model in scene");
  return { formModel, documentModel } as {
    formModel: object;
    documentModel: { header: { id: string }; generatedCodeAccessor?: unknown };
  };
}

export function createWikiSingleDocumentDataProvider(): DataProvider {
  const documentService = new DocumentServiceFactory().getDocumentService();

  return {
    name: "WikiSingleDocumentDataProvider",
    canHandle({ activityId, activities, operation }) {
      const instance = activities[activityId]?.descriptor.instance;
      if (instance === undefined) return false;
      // __NEW__ load is handled by createEmptyDocumentDataProvider; we take
      // load-existing, plus all saves and deletes.
      if (operation === "load") return instance !== NEW_INSTANCE_IDENTIFIER;
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    *provideData(config: any): any {
      const activity = yield* select(ActivitySelectors.activityById(config.activityId));
      if (!activity) throw new Error(`No activity for id ${config.activityId}`);
      const instance: string = activity.descriptor.instance ?? NEW_INSTANCE_IDENTIFIER;
      const defaultDataHolder = config.dataHolders.find(
        Activity.DataHolder.hasDescriptor(activity.descriptor),
      );

      switch (config.operation) {
        case "load": {
          const { model, id } = splitDocRef(instance);
          const item = yield* call(() => getDocument(model, id));
          const { formModel, documentModel } = yield* resolveModels(config.activityId);
          const { generatedCodeAccessor: validatorProvider, ...dmNoCode } =
            documentModel as { generatedCodeAccessor?: unknown };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsed = documentService.parseDates(item.document, dmNoCode as any);
          const document = { ...parsed, id: instance, modelId: documentModel.header.id };
          const result = preProcessDocument({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            document: document as any,
            isNewInstance: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            models: { formModel, documentModel: dmNoCode, validatorProvider } as any,
          });
          yield* put(
            ActivityActions.setData({
              activityId: config.activityId,
              data: { document: result.document },
            }),
          );
          break;
        }
        case "save": {
          const oldData = defaultDataHolder?.data;
          if (!FormActivity.Data.SingleDocumentData.isInstance(oldData)) {
            throw new Error("Activity data is not a single document");
          }
          const { formModel, documentModel } = yield* resolveModels(config.activityId);
          const relevant = FormActivity.Data.filterDataByRelevance(oldData.document, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            documentModel: documentModel as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formModel: formModel as any,
          });
          // Drop engine-only metadata, then serialise Date objects to the kernel
          // string representation (e.g. 1967-09-29) before sending.
          const { id: _id, modelId: _modelId, ...body } = relevant as Record<string, unknown>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = documentService.formatDates(body, documentModel as any) as ContentDocument;

          let savedInstance = instance;
          if (instance === NEW_INSTANCE_IDENTIFIER) {
            const res = yield* call(() => createDocument(documentModel.header.id, formatted));
            savedInstance = `${res.item.type}/${res.item.id}`;
          } else {
            const { model, id } = splitDocRef(instance);
            yield* call(() => updateDocument(model, id, formatted, ""));
          }

          const newData =
            instance === NEW_INSTANCE_IDENTIFIER
              ? { document: { ...oldData.document, id: savedInstance } }
              : oldData;
          if (config.details.updateActivityData) {
            yield* put(ActivityActions.setData({ activityId: config.activityId, data: newData }));
          }
          yield* put(config.details.saving.done({ instance: savedInstance }));
          break;
        }
        case "delete": {
          const { model, id } = splitDocRef(config.details.instanceId ?? instance);
          yield* call(() => deleteDocument(model, id));
          yield* put(ActivityActions.reloadData({ activityId: config.activityId }));
          break;
        }
      }
    },
  };
}
