import {notFound} from "next/navigation";
import {fetchPost} from "../../utils/posts";
import fs from "fs";
import path from "path";

export function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app', '_posts'));
  const markdownFiles = files.filter((file) => file.endsWith('.md'));
  return markdownFiles.map((file) => ({ id: file.replace(/\.md$/, '') }));
}

async function fetchPost(id: string) {
  // Blog posts are stored under the `app/_posts` directory. The previous path
  // mistakenly looked for the files at the repository root which resulted in a
  // runtime error when navigating to a blog post.
  const filePath = path.join(process.cwd(), 'app', '_posts', `${id}.md`);
  var fileContents = '';
  try {
  fileContents = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
  const { data, content } = matter(fileContents != '' ? fileContents : '');

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    title: data.title,
    content: contentHtml,
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
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
