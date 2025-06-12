import Link from 'next/link';

export default function LatestPosts() {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
            <div className="space-y-6">
                {[1, 2].map((post) => (
                    <article key={post} className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-2">Blog Post {post}</h3>
                        <p className="text-gray-600 mb-4">
                            A preview of this interesting blog post that will make you want to read more...
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