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

// Native inline Spoiler mark definition
const CustomSpoiler = Mark.create({
  name: "spoiler",
  parseHTML() {
    return [{ tag: "span.spoiler" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", { ...HTMLAttributes, class: "spoiler bg-black text-black select-none cursor-pointer transition rounded px-1 hover:bg-gray-800" }, 0];
  },
});

function CreatePost() {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState("");
  // Lightweight dummy state tracker to force React re-renders on selection changes
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
              parse: {
                match: /^>!([\s\S]+?)!</,
                mark: "spoiler",
              },
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
          class: "bg-gray-900 text-gray-100 font-mono p-4 rounded-xl my-4 block whitespace-pre max-h-[300px] overflow-y-auto",
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
    // CRITICAL FIX: Forces the toolbar to evaluate state on typing, click, and formatting toggles
    onTransaction() {
      setSelectionTick((tick) => tick + 1);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[288px] max-h-[400px] overflow-y-auto max-w-none space-y-4 pr-1 relative [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-100 [&.is-editor-empty_p:first-child::before]:content-[attr(data-placeholder)] [&.is-editor-empty_p:first-child::before]:text-gray-400 [&.is-editor-empty_p:first-child::before]:absolute [&.is-editor-empty_p:first-child::before]:pointer-events-none",
      },
    },
  });

  const setViewMode = (targetIsMarkdown) => {
    if (!editor || isMarkdownMode === targetIsMarkdown) return;

    if (targetIsMarkdown) {
      const markdownOutput = editor.storage.markdown.getMarkdown();
      setRawMarkdown(markdownOutput);
    } else {
      editor.commands.setContent(rawMarkdown);
    }
    setIsMarkdownMode(targetIsMarkdown);
  };

  if (!editor) return null;

  // Evaluated instantly on every forced re-render loop
  const getButtonClass = (name, attributes = {}) => {
    const isActive = editor.isActive(name, attributes);
    const base = "rounded p-2 transition font-medium text-sm flex items-center justify-center min-w-[36px] min-h-[36px] ";
    return isActive 
      ? `${base} bg-black text-white outline outline-2 outline-offset-2 outline-black shadow-md`
      : `${base} bg-transparent text-gray-600 hover:bg-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button type="button" className="rounded-full p-2 transition hover:bg-gray-200">
            ←
          </button>
          <h1 className="text-3xl font-bold">Create Post</h1>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Give your post a title..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Cover Image</label>
              <label className="flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-black hover:bg-gray-50">
                <div className="text-center">
                  <p className="font-medium">📷 Upload Image</p>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, WEBP</p>
                </div>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Tags</label>
              <input
                type="text"
                placeholder="react, javascript, webdev..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Editor Container */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Content</h3>
                
                {/* Switch view toggle buttons */}
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode(false)}
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${!isMarkdownMode ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                  >
                    Rich Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode(true)}
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${isMarkdownMode ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                  >
                    Markdown
                  </button>
                </div>
              </div>

              {/* Toolbar */}
              <div className={`flex flex-wrap items-center gap-2 rounded-t-xl border border-b-0 border-gray-300 bg-gray-50 p-3 transition-opacity ${isMarkdownMode ? "opacity-40 pointer-events-none" : ""}`}>
                <button
                  type="button"
                  title="Bold"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={getButtonClass("bold")}
                >
                  <b>B</b>
                </button>

                <button
                  type="button"
                  title="Italic"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={getButtonClass("italic")}
                >
                  <i>I</i>
                </button>

                <button
                  type="button"
                  title="Strikethrough"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={getButtonClass("strike")}
                >
                  <s>S</s>
                </button>

                <button
                  type="button"
                  title="Heading"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={getButtonClass("heading", { level: 3 })}
                >
                  H
                </button>
                
                <button 
                  type="button" 
                  title="Superscript"
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  className={getButtonClass("superscript")}
                >
                  X<sup>2</sup>
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                <button
                  type="button"
                  title="Quote"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={getButtonClass("blockquote")}
                >
                  <img src={QuoteIcon} alt="Quote" className={`h-4 w-4 ${editor.isActive("blockquote") ? "invert" : ""}`} />
                </button>

                <button
                  type="button"
                  title="Code Block"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={getButtonClass("codeBlock")}
                >
                  {"</>"}
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={getButtonClass("bulletList")}
                >
                  <img src={BulletIcon} alt="Bullet List" className={`h-4 w-4 ${editor.isActive("bulletList") ? "invert" : ""}`} />
                </button>

                <button
                  type="button"
                  title="Numbered List"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={getButtonClass("orderedList")}
                >
                  <img src={NumListIcon} alt="Numbered List" className={`h-4 w-4 ${editor.isActive("orderedList") ? "invert" : ""}`} />
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />
                
                <button 
                  type="button" 
                  title="Spoiler"
                  onClick={() => editor.chain().focus().toggleMark("spoiler").run()}
                  className={getButtonClass("spoiler")}
                >
                  <img src={SpoilerIcon} alt="Spoiler" className={`h-4 w-4 ${editor.isActive("spoiler") ? "invert" : ""}`} />
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
                  <img src={AttachIcon} alt="Link" className={`h-4 w-4 ${editor.isActive("link") ? "invert" : ""}`} />
                </button>

                <button 
                  type="button" 
                  title="Image"
                  onClick={() => {
                    const url = window.prompt("Enter Image URL:");
                    if (url) editor.chain().focus().setImage({ src: url }).run();
                  }}
                  className="rounded p-2 text-gray-600 hover:bg-gray-200"
                >
                  <img src={ImageIcon} alt="Image" className="h-4 w-4" />
                </button>

                <button 
                  type="button" 
                  title="Table"
                  onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                  className={getButtonClass("table")}
                >
                  <img src={TableIcon} alt="Table" className={`h-4 w-4 ${editor.isActive("table") ? "invert" : ""}`} />
                </button>

                <button
                  type="button"
                  title="Horizontal Line"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="rounded p-2 text-gray-600 hover:bg-gray-200"
                >
                  ―
                </button>
              </div>

              {/* Workspaces */}
              {isMarkdownMode ? (
                <textarea
                  value={rawMarkdown}
                  onChange={(e) => setRawMarkdown(e.target.value)}
                  className="w-full font-mono text-sm h-[320px] overflow-y-auto resize-none rounded-b-xl border border-gray-300 p-4 outline-none transition focus:border-black bg-white"
                  placeholder="Write your content here..."
                />
              ) : (
                <div className="w-full rounded-b-xl border border-gray-300 p-4 outline-none transition focus-within:border-black bg-white">
                  <EditorContent editor={editor} />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;