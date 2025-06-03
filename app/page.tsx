import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
          <Image
            src="https://gravatar.com/avatar/10056dfd9bd277610a657d2aee28089b?size=256"
            alt="Terence Schumacher"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Terence Schumacher (tazzledazzle)</h1>
          <p className="text-xl text-gray-600">Full Stack Developer, Gradle Enthusiast & Technical Writer</p>
        </div>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          I build modern web applications and write about technology, development, and best practices.
          Currently focused on React, Next.js, and TypeScript.
        </p>
      </section>

      {/* Featured Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((project) => (
            <div key={project} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
              <p className="text-gray-600 mb-4">
                A brief description of this amazing project and the technologies used to build it.
              </p>
              <Link href={`/projects/${project}`} className="text-primary-600 hover:text-primary-700">
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((post) => (
            <article key={post} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Blog Post {post}</h3>
              <p className="text-gray-600 mb-4">
                A preview of this interesting blog post that will make you want to read more...
              </p>
              <Link href={`/blog/post-${post}`} className="text-primary-600 hover:text-primary-700">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-primary-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
        <p className="text-gray-600 mb-6">
          I'm always interested in hearing about new projects and opportunities.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  )
}