import {notFound} from "next/navigation";
import {fetchPost} from "../../utils/posts";

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
];
}

export default async function PostPage({ params }: { params: { id: string } }) {
  let post;
  try {
    post = await fetchPost(params.id);
  } catch (e) {
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
