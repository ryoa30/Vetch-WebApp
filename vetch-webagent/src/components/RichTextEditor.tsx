"use client";

import { useEffect, useMemo, useState } from "react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {TextStyle} from "@tiptap/extension-text-style"; // base for font-size
import DOMPurify from "isomorphic-dompurify";

/** Keyboard Tab/Shift+Tab indent for lists */
const TabIndent = Extension.create({
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.sinkListItem("listItem"),
      "Shift-Tab": () => this.editor.commands.liftListItem("listItem"),
    };
  },
});

/** Enable font-size via TextStyle mark */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(), // keep other textStyle attrs working
      fontSize: {
        default: null,
        parseHTML: (el: HTMLElement) => el.style.fontSize || null,
        renderHTML: (attrs: any) =>
          attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
      },
    };
  },
});

type Props = {
  value?: string;                         // initial HTML
  onChange?: (html: string) => void;      // returns HTML
  className?: string;
};

export default function RichTextEditor({ value = "", onChange, className }: Props) {
  const [size, setSize] = useState("16px"); // current font size for the button UI

  const extensions = useMemo(
    () => [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ autolink: true, openOnClick: false, linkOnPaste: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TabIndent,
      FontSize, // our TextStyle+font-size
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        // .tiptap class is for the list CSS above. Add prose if you want typography styling.
        class: "tiptap prose max-w-none p-3 min-h-[200px] focus:outline-none bg-white rounded-b-md",
      },
    },
    /** Avoid SSR hydration mismatches */
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setFontSize = (px: string) => {
    setSize(px);
    editor.chain().focus().setMark("textStyle", { fontSize: px }).run();
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 rounded-t-md border border-b-0 bg-white p-2 text-black">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></Btn>
        <Btn on={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><u>U</u></Btn>

        <Sep />
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>H1</Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>

        <Sep />
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</Btn>

        <Sep />
        <Btn on={() => editor.chain().focus().sinkListItem("listItem").run()} disabled={!editor.can().sinkListItem("listItem")}>Indent ▶</Btn>
        <Btn on={() => editor.chain().focus().liftListItem("listItem").run()} disabled={!editor.can().liftListItem("listItem")}>◀ Outdent</Btn>

        <Sep />
        <Btn on={() => editor.chain().focus().setTextAlign("left").run()}  active={editor.isActive({ textAlign: "left" })}>⟸</Btn>
        <Btn on={() => editor.chain().focus().setTextAlign("center").run()}active={editor.isActive({ textAlign: "center" })}>≡</Btn>
        <Btn on={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>⟹</Btn>
        <Btn on={() => editor.chain().focus().setTextAlign("justify").run()}active={editor.isActive({ textAlign: "justify" })}>↔</Btn>

        <Sep />
        {/* Font size dropdown */}
        <select
          value={size}
          onChange={(e) => setFontSize(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {["12px","14px","16px","18px","20px","24px","32px"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <Btn on={() => editor.chain().focus().unsetMark("textStyle").run()} disabled={!editor.isActive("textStyle")}>
          Clear size
        </Btn>

        <Sep />
        <Btn on={() => editor.chain().focus().undo().run()}>Undo</Btn>
        <Btn on={() => editor.chain().focus().redo().run()}>Redo</Btn>
      </div>

      {/* Surface */}
      <EditorContent editor={editor} className="text-black"/>
    </div>
  );
}

function Btn({
  on, children, active, disabled,
}: { on: () => void; children: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={on}
      disabled={disabled}
      className={[
        "px-2 py-1 text-sm rounded border",
        active ? "bg-black text-white" : "bg-white hover:bg-black/5",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
function Sep() { return <div className="w-px self-stretch bg-black/10 mx-1" />; }
