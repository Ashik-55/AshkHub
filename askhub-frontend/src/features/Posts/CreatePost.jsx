import { useState } from "react";
import EditorWorkspace from "../../components/common/EditorWorkspace"; // Import the child workspace component

function CreatePost() {
  const [postTitle, setPostTitle] = useState("");
  const [postTags, setPostTags] = useState("");
  const [postContent, setPostContent] = useState(""); // Dynamic parsed string sync

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: postTitle,
      tags: postTags,
      content: postContent,
    };
    console.log("Submitting Post Data:", payload);
    // Add form logic / API calls here
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 antialiased">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button type="button" className="rounded-full border border-gray-200 bg-white p-2.5 shadow-sm transition hover:bg-gray-50">
            ←
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Post</h1>
        </div>

        {/* Main Content Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form className="space-y-7" onSubmit={handlePostSubmit}>
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Give your post a title..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Cover Image Upload Area */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Cover Image</label>
              <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/30 transition hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-700">📷 Upload Image</p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                placeholder="react, javascript, webdev..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Decoupled Isolated Editor Canvas Block */}
            <EditorWorkspace onChange={setPostContent} size="520px" />

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition-all shadow-sm hover:bg-black hover:shadow"
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