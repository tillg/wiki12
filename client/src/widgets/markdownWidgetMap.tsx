// Register MilkdownEditor in the form engine's WidgetMap so that controls bound
// to the markdown body field render Milkdown instead of the default text widget.
//
// Mechanism (formengine docs "Customizing Specific Elements" / "WidgetMap"):
//   - spread DefaultWidgetMap (mandatory)
//   - override the TextAreaStateless widget; inspect the bound FormModel.Control
//     via a context wrapped by a custom FormModelMap.Control entry
//   - when the control is the markdown body, render the Milkdown widget; otherwise
//     fall back to the default text-area widget.
//
// API confirmed against the installed @com.mgmtp.a12.formengine 38.x .d.ts:
//   - WidgetMap key for the multi-line text input is "TextAreaStateless"
//     (view/internal/configuration/widget-map.d.ts), props = TextAreaStatelessProps
//     (widgets-core .../text-area.tpl.api): { value?: string;
//     onChange?(ev: ChangeEvent<HTMLTextAreaElement>): void; readonly?: boolean;
//     disabled?: boolean; id?: string; label?: ReactNode; ... } — note it is the
//     A12-widget `readonly`/`onChange(event)`/`id` contract, NOT value-callback/uiID.
//   - FormModelMap.Control.component receives `props.modelElement` (the
//     FormModel.Control). A *generated* control carries no field name, only
//     `elementRef` + the runtime `elementPath` whose leaf elementName is the bound
//     DM field's NAME — see lib/modelFields.boundFieldName.

import { createContext, useContext } from "react";
import type { ChangeEvent, ReactElement, ReactNode } from "react";
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

// Loosely-typed view of the props the form engine passes to the TextAreaStateless
// widget (a subset of TextAreaStatelessProps — see file header).
interface TextWidgetProps {
  value?: string;
  // A12 widget contract: onChange receives a DOM ChangeEvent, not a bare string.
  onChange?: (ev: ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  readonly?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  [key: string]: unknown;
}

function MarkdownOrDefault(props: TextWidgetProps): ReactElement {
  const { element } = useContext(MarkdownControlContext);
  // Pass the raw Control through; isMarkdownBodyControl/boundFieldName reads its
  // elementPath leaf (generated controls have no fieldName).
  const control =
    element && FormModel.Control.isInstance(element)
      ? (element as unknown as Parameters<typeof isMarkdownBodyControl>[0])
      : undefined;

  if (!isMarkdownBodyControl(control)) {
    return <DefaultWidgetMap.TextAreaStateless {...(props as object)} />;
  }

  // Bridge Milkdown's string-callback to the widget's DOM-event onChange: the
  // BufferedInput adapter that wraps this widget reads the new value off
  // event.target.value, so we hand it a minimal synthetic event.
  const emit = (markdown: string): void => {
    props.onChange?.({
      target: { value: markdown },
      currentTarget: { value: markdown },
    } as unknown as ChangeEvent<HTMLTextAreaElement>);
  };

  const ariaLabel = typeof props.label === "string" ? props.label : undefined;
  return (
    <MilkdownEditor
      value={props.value ?? ""}
      onChange={emit}
      uiID={props.id}
      readOnly={props.readonly || props.disabled}
      ariaLabel={ariaLabel}
    />
  );
}

export const markdownWidgetMap: WidgetMap = {
  ...DefaultWidgetMap,
  // The multi-line text input the form engine renders for a StringType field with
  // lineBreaksPermitted (the markdown body). Confirmed key, see file header.
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

// Same as markdownFormModelMap but suppresses the form model's own button panel
// (Save/Cancel action section): the A12 Client app drives persistence via its own
// action bar (see a12client/views/FormScreen.tsx), so the model buttons would be
// redundant and non-functional.
export const markdownButtonlessFormModelMap: FormModelMap = {
  ...markdownFormModelMap,
  ButtonPanel: {
    ...DefaultFormModelMap.ButtonPanel,
    component: () => null,
  },
  // The engine's default footer Save/Cancel are NavigationButtons; suppress them too.
  NavigationButton: {
    ...DefaultFormModelMap.NavigationButton,
    component: () => null,
  },
};
