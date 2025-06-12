import Link from 'next/link';

export default async function FeaturedProjects() {
    const projects = await import('../utils/projects').then(module => module.fetchProjectData);
    return (
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
    );
}