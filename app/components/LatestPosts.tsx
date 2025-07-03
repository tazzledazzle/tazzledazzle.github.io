import Link from 'next/link';
import path from "path";
import fs from "fs";
import matter from "gray-matter";

//@ts-ignore
export default async function LatestPosts() {
    // 1. Get all post files in _posts
    const files = fs.readdirSync(path.join(process.cwd(), 'app', '_posts'));

    // 2. Parse each file to get front matter (title, summary, etc.)
    const posts = files.map(filename => {
        const filePath = path.join(process.cwd(), 'app/_posts', filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
            id: filename.replace(/\.md$/, ''),
            title: data.title || 'Untitled',
            summary: data.summary || content.substring(0, 160) + '...', // fallback to first 160 chars
        };
    });

    // 3. Render the posts
    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
            <div className="space-y-6">
                {[1,2].map((post) => (
                    <article key={post} className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-2">{post}</h3>
                        <p className="text-gray-600 mb-4">
                            {post}
                        </p>
                        <Link href={`/blog/${post}`} className="text-primary-600 hover:text-primary-700">
                            Read more →
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}