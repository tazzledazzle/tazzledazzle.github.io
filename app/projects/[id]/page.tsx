// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getProjectData(id: string) {
  const filePath = path.join(process.cwd(), 'app', '_projects', `${id}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    title: data.title,
    description: data.description,
    image: data.image,
    github: data.github,
    live: data.live,
    content: contentHtml,
  };
}
// Next.js (TypeScript)
export function generateStaticParams() {
    const files = fs.readdirSync(path.join(process.cwd(), 'app', '_projects'));

  return files.map(file => ({ id: file.replace(/\.md/, '') }));
}
// this is still placeholder data, replace with real data fetching logic
// or a database query in a real application.
const projects: Record<'1' | '2', { title: string; description: string; image: string; content: string; github: string; live: string }> = {
  '1': {
    title: 'TazzleBlog',
    description: 'A blazing fast personal blog built with Next.js and Tailwind CSS.',
    image: '/images/tazzleblog.png',
    content: `<p>This is a sample blog post content. You can write about anything you like here.</p>`,
    github: '',
    live: 'https://tazzleblog.vercel.app',
  },
  '2': {
    title: 'BuildBuddy Tracker',
    description: 'A tool to monitor Gradle builds and CI/CD pipelines.',
    image: '/images/tazzleblog.png',
    content: `<p>This is a sample blog post content. You can write about anything you like here.</p>`,
    github: '',
    live: 'https://tazzleblog.vercel.app',
  },
};

export default async function ProjectPage({ params }: { params: { id: string } }) {
  let project;
  try {
    project = await getProjectData(params.id);
  } catch (e) {
    console.error(`Error fetching project with id ${params.id}:`, e);
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