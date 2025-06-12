import { getPostSlugs, getPostBySlug } from '../../lib/posts';

export async function getStaticPaths() {
    const slugs = getPostSlugs().map(slug => ({
        params: { slug: slug.replace(/\.mdx$/, '') }
    }));
    return { paths: slugs, fallback: false };
}

export async function getStaticProps({ params }) {
    const post = getPostBySlug(params.slug);
    return { props: { post } };
}

export default function PostPage({ post }) {
    // Render the MDX content (using next-mdx-remote or similar)
    return (
        <article>
            <h1>{post.meta.title}</h1>
            {/* MDX rendering here */}
        </article>
    );
}