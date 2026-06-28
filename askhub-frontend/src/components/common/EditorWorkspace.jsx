import { useState } from "react";
import { useEditor, EditorContent, Mark } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown as TiptapMarkdown } from "tiptap-markdown";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import AttachIcon from "../../assets/post-icons/attach-icon.svg";
import BulletIcon from "../../assets/post-icons/bullet-icon.svg";
import ImageIcon from "../../assets/post-icons/img-icon.svg";
import NumListIcon from "../../assets/post-icons/numlist-icon.svg";
import QuoteIcon from "../../assets/post-icons/quotes-icon.svg";
import SpoilerIcon from "../../assets/post-icons/spoiler-icon.svg";
import TableIcon from "../../assets/post-icons/table-icon.svg";

const CustomSpoiler = Mark.create({
  name: "spoiler",
  parseHTML() {
    return [{ tag: "span.spoiler" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", { ...HTMLAttributes, class: "spoiler bg-black text-black select-none cursor-pointer transition rounded px-1 hover:bg-gray-800" }, 0];
  },
});

function EditorWorkspace({ onChange }, size= "320px") {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [, setSelectionTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      TiptapMarkdown.configure({
        markdown: {
          extensions: [
            {
              name: "spoiler",
              type: "inline",
              parse: { match: /^>!([\s\S]+?) Lel/, mark: "spoiler" },
              serialize(state, mark) {
                state.write(">!");
                state.renderInline(mark);
                state.write("!<");
              },
            },
          ],
        },
      }),
      Superscript,
      CustomSpoiler,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-50 border border-gray-200 text-gray-800 font-mono p-4 rounded-xl my-4 block whitespace-pre max-h-[300px] overflow-y-auto text-sm",
        },
      }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Write your content here...",
        showOnlyCurrent: false,
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.storage.markdown.getMarkdown());
      }
    },
    onTransaction() {
      setSelectionTick((tick) => tick + 1);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[320px] max-h-[450px] overflow-y-auto max-w-none space-y-4 pr-1 relative [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&.is-editor-empty_p:first-child::before]:content-[attr(data-placeholder)] [&.is-editor-empty_p:first-child::before]:text-gray-400 [&.is-editor-empty_p:first-child::before]:absolute [&.is-editor-empty_p:first-child::before]:pointer-events-none",
      },
    },
  });

  const setViewMode = (targetIsMarkdown) => {
    if (!editor || isMarkdownMode === targetIsMarkdown) return;
    if (targetIsMarkdown) {
      const currentMarkdown = editor.storage.markdown.getMarkdown();
      setRawMarkdown(currentMarkdown);
    } else {
      editor.commands.setContent(rawMarkdown);
    }
    setIsMarkdownMode(targetIsMarkdown);
  };

  const handleRawMarkdownChange = (e) => {
    const value = e.target.value;
    setRawMarkdown(value);
    if (onChange) onChange(value);
  };

  if (!editor) return null;

  const getButtonClass = (name, attributes = {}) => {
    const isActive = editor.isActive(name, attributes);
    const base = "rounded-lg w-7 h-7 transition-all duration-200 text-sm font-medium flex items-center justify-center ";
    return isActive 
      ? `${base} bg-gray-600 text-white shadow-sm ring-1 ring-white-500 scale-[0.95] invert-icons`
      : `${base} text-gray-500 hover:bg-gray-100 hover:text-gray-900`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Content</label>
        
        {/* Segmented Controller */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 ring-1 ring-gray-200/50">
          <button
            type="button"
            onClick={() => setViewMode(false)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${!isMarkdownMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Rich Text
          </button>
          <button
            type="button"
            onClick={() => setViewMode(true)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${isMarkdownMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Editor Main Surface Frame */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-gray-300">
        <div className={`flex flex-wrap items-center gap-1.5 border-b border-gray-100 bg-gray-50/50 px-3 py-2.5 transition-opacity ${isMarkdownMode ? "opacity-30 pointer-events-none" : ""}`}>
          <button
            type="button"
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={getButtonClass("bold")}
          >
            <span className="font-bold">B</span>
          </button>

          <button
            type="button"
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={getButtonClass("italic")}
          >
            <span className="italic">I</span>
          </button>

          <button
            type="button"
            title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={getButtonClass("strike")}
          >
            <span className="line-through">S</span>
          </button>

          <button
            type="button"
            title="Heading"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={getButtonClass("heading", { level: 3 })}
          >
            <span>H</span>
          </button>
          
          <button 
            type="button" 
            title="Superscript"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={getButtonClass("superscript")}
          >
            <span>X²</span>
          </button>

          <div className="mx-1 h-4 w-px bg-gray-200" />

          <button
            type="button"
            title="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={getButtonClass("blockquote")}
          >
            <img src={QuoteIcon} alt="Quote" className={`h-3.5 w-3.5 ${editor.isActive("blockquote") ? "invert" : "opacity-70"}`} />
          </button>

          <button
            type="button"
            title="Code Block"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={getButtonClass("codeBlock")}
          >
            <span className="text-xs font-mono">{"</>"}</span>
          </button>

          <div className="mx-1 h-4 w-px bg-gray-200" />

          <button
            type="button"
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={getButtonClass("bulletList")}
          >
            <img src={BulletIcon} alt="Bullet List" className={`h-3.5 w-3.5 ${editor.isActive("bulletList") ? "invert" : "opacity-70"}`} />
          </button>

          <button
            type="button"
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={getButtonClass("orderedList")}
          >
            <img src={NumListIcon} alt="Numbered List" className={`h-3.5 w-3.5 ${editor.isActive("orderedList") ? "invert" : "opacity-70"}`} />
          </button>

          <div className="mx-1 h-4 w-px bg-gray-200" />
          
          <button 
            type="button" 
            title="Spoiler"
            onClick={() => editor.chain().focus().toggleMark("spoiler").run()}
            className={getButtonClass("spoiler")}
          >
            <img src={SpoilerIcon} alt="Spoiler" className={`h-3.5 w-3.5 ${editor.isActive("spoiler") ? "invert" : "opacity-70"}`} />
          </button>

          <button 
            type="button" 
            title="Link"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              } else if (url === "") {
                editor.chain().focus().unsetLink().run();
              }
            }}
            className={getButtonClass("link")}
          >
            <img src={AttachIcon} alt="Link" className={`h-3.5 w-3.5 ${editor.isActive("link") ? "invert" : "opacity-70"}`} />
          </button>

          <button 
            type="button" 
            title="Image"
            onClick={() => {
              const url = window.prompt("Enter Image URL:");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <img src={ImageIcon} alt="Image" className="h-3.5 w-3.5 opacity-70" />
          </button>

          <button 
            type="button" 
            title="Table"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className={getButtonClass("table")}
          >
            <img src={TableIcon} alt="Table" className={`h-3.5 w-3.5 ${editor.isActive("table") ? "invert" : "opacity-70"}`} />
          </button>

          <button
            type="button"
            title="Horizontal Line"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 text-xs"
          >
            ―
          </button>
        </div>

        {/* Input Windows */}
        <div className={`p-4 h-[${size}]`}>
          {isMarkdownMode ? (
            <textarea
              value={rawMarkdown}
              onChange={handleRawMarkdownChange}
              className={`w-full font-mono text-sm h-full overflow-y-auto resize-none bg-transparent outline-none text-gray-800 placeholder:text-gray-400`}
              placeholder="Write your content here..."
            />
          ) : (
            <div className="w-full bg-transparent text-gray-800">
              <EditorContent editor={editor} placeholder="Write your content here"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EditorWorkspace.defaultProps = {
    size: "320px",
};

export default EditorWorkspace;