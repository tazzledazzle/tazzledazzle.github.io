// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { fetchProjectData } from '../../utils/projects';

// Next.js (TypeScript)
export function generateStaticParams() {
    const files = fs.readdirSync(path.join(process.cwd(), 'app', '_projects'));

  return files.map(file => ({ id: file.replace(/\.md/, '') }));
}

// @ts-ignore
export default async function ProjectPage({ params }) {
  let project;
  const { id } = await params;
  try {
    project = await fetchProjectData(id);
  } catch (e) {
    console.error(`Error fetching project with id ${id}:`, e);
    notFound();
  }

  return (
    <div className="prose max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="rounded-md border mb-4"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: project.content }} />
      <div className="mt-4">
        {project.github && (
          <a href={project.github} className="text-blue-600 hover:underline mr-4">GitHub</a>
        )}
        {project.live && (
          <a href={project.live} className="text-green-600 hover:underline">Live Site</a>
        )}
      </div>
    </div>
  );
}