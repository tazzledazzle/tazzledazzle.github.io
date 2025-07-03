import {notFound} from "next/navigation";
import {fetchPost} from "../../utils/posts";
import fs from "fs";
import path from "path";

export function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app', '_posts'));
  return files.map(file => ({ id: file.replace(/\.md/, '') }));
}

//@ts-ignore
export default async function PostPage({ params }) {
  let post;
  const { id } = await params;
  try {
    post = await fetchPost(id);
  } catch (e) {
    console.error(`Error fetching project with id ${id}:`, e);
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div
        className="text-gray-700 text-lg prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
