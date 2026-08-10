import "@/assets/css/vendors/ckeditor.css";
import { useEffect, useRef } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { init, CkeditorProps, CkeditorElement } from "../ckeditor";

function Ckeditor<C extends React.ElementType = "div">({
  disabled = false,
  config = {},
  value = "",
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onReady = () => {},
  getRef = () => {},
  className,
  as,
  ...computedProps
}: CkeditorProps<C>) {
  const runtimeProps = {
    disabled,
    config,
    value,
    onChange,
    onFocus,
    onBlur,
    onReady,
    getRef,
  };

  const editorRef = useRef<CkeditorElement | null>(null);
  const editorInstanceRef = useRef<any>(null);
  const latestPropsRef = useRef(runtimeProps);
  const cacheData = useRef("");

  latestPropsRef.current = runtimeProps;

  useEffect(() => {
    const element = editorRef.current;
    if (!element) return;

    let disposed = false;
    const initialProps = latestPropsRef.current;
    const lifecycleProps = {
      ...initialProps,
      config: { ...initialProps.config },
      onChange: (data: any) => latestPropsRef.current.onChange(data),
      onFocus: (event: any, editor: any) =>
        latestPropsRef.current.onFocus?.(event, editor),
      onBlur: (event: any, editor: any) =>
        latestPropsRef.current.onBlur?.(event, editor),
      onReady: (editor: any) => {
        if (!disposed) latestPropsRef.current.onReady?.(editor);
      },
    };

    initialProps.getRef?.(element);

    void init(element, ClassicEditor, {
      props: lifecycleProps,
      cacheData,
    }).then((editor) => {
      if (disposed) {
        if (element.CKEditor === editor) {
          if (editorInstanceRef.current) {
            element.CKEditor = editorInstanceRef.current;
          } else {
            Reflect.deleteProperty(element, "CKEditor");
          }
        }
        void editor.destroy();
        return;
      }

      editorInstanceRef.current = editor;
      element.CKEditor = editor;

      if (latestPropsRef.current.disabled) {
        editor.enableReadOnlyMode("ckeditor");
      } else {
        editor.disableReadOnlyMode("ckeditor");
      }

      if (cacheData.current !== latestPropsRef.current.value) {
        editor.setData(latestPropsRef.current.value);
      }
    });

    return () => {
      disposed = true;
      const editor = editorInstanceRef.current;
      if (!editor) return;

      editorInstanceRef.current = null;
      if (element.CKEditor === editor) {
        Reflect.deleteProperty(element, "CKEditor");
      }
      void editor.destroy();
    };
  }, [as]);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor || cacheData.current === value) return;
    editor.setData(value);
  }, [value]);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor) return;

    if (disabled) {
      editor.enableReadOnlyMode("ckeditor");
    } else {
      editor.disableReadOnlyMode("ckeditor");
    }
  }, [disabled]);

  const Component = as || "div";

  return (
    <Component
      {...computedProps}
      ref={editorRef}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

export default Ckeditor;
