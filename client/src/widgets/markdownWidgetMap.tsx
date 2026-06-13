// Register MilkdownEditor in the form engine's WidgetMap so that controls bound
// to the markdown body field render Milkdown instead of the default text widget.
//
// Mechanism (formengine docs "Customizing Specific Elements" / "WidgetMap"):
//   - spread DefaultWidgetMap (mandatory)
//   - override the text widget; inspect the FormModel element via a context
//     wrapped by a custom FormModelMap entry
//   - when the control is the markdown body (annotation / field name), render the
//     Milkdown widget; otherwise fall back to the default.
//
// VERIFY against the live form engine: the exact widget key for the String/
// TextArea control (assumed "TextAreaStateless"), the props carrying value +
// onChange + uiID, and how the bound field name is exposed on the control. The
// shapes below follow the documented CustomInputContext pattern but the precise
// prop names depend on the installed @com.mgmtp.a12.formengine version.

import { createContext, useContext } from "react";
import type { ReactElement } from "react";
import {
  DefaultFormModelMap,
  DefaultWidgetMap,
  FormModel,
  type FormModelMap,
  type WidgetMap,
} from "@com.mgmtp.a12.formengine/formengine-core";
import { MilkdownEditor } from "./MilkdownEditor";
import { isMarkdownBodyControl } from "../lib/modelFields";

const MarkdownControlContext = createContext<{
  element?: FormModel.Control | FormModel.BasicScreenElement;
}>({});

// Loosely-typed view of the props the form engine passes to a text widget.
interface TextWidgetProps {
  value?: string;
  onValueChange?: (v: string) => void;
  onChange?: (v: string) => void;
  uiID?: string;
  id?: string;
  readOnly?: boolean;
  label?: string;
  [key: string]: unknown;
}

function MarkdownOrDefault(props: TextWidgetProps): ReactElement {
  const { element } = useContext(MarkdownControlContext);
  const control = element && FormModel.Control.isInstance(element)
    ? (element as unknown as { annotations?: { name?: string }[]; fieldName?: string })
    : undefined;

  if (!isMarkdownBodyControl(control)) {
    // VERIFY widget key — see file header.
    return <DefaultWidgetMap.TextAreaStateless {...(props as object)} />;
  }

  const emit = props.onValueChange ?? props.onChange ?? (() => {});
  return (
    <MilkdownEditor
      value={props.value ?? ""}
      onChange={emit}
      uiID={props.uiID ?? props.id}
      readOnly={props.readOnly}
      ariaLabel={props.label}
    />
  );
}

export const markdownWidgetMap: WidgetMap = {
  ...DefaultWidgetMap,
  // VERIFY: the default String/TextArea widget key in this engine version.
  TextAreaStateless: MarkdownOrDefault as unknown as typeof DefaultWidgetMap.TextAreaStateless,
};

export const markdownFormModelMap: FormModelMap = {
  ...DefaultFormModelMap,
  Control: {
    ...DefaultFormModelMap.Control,
    component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => (
      <MarkdownControlContext.Provider value={{ element: props.modelElement }}>
        <DefaultFormModelMap.Control.component {...props} />
      </MarkdownControlContext.Provider>
    ),
  },
};
