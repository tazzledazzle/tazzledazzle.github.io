// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';
// Next.js (TypeScript)
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}
// this is still placeholder data, replace with real data fetching logic
// or a database query in a real application.
const projects: Record<'1' | '2', { title: string; description: string }> = {
  '1': {
    title: 'TazzleBlog',
    description: 'A blazing fast personal blog built with Next.js and Tailwind CSS.',
  },
  '2': {
    title: 'BuildBuddy Tracker',
    description: 'A tool to monitor Gradle builds and CI/CD pipelines.',
  },
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects[params.id as keyof typeof projects];

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 text-lg">{project.description}</p>
    </div>
  );
}