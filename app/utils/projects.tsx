import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function fetchProjectData(id: string) {
    const filePath = path.join(process.cwd(), 'app', '_projects', `${id}.md`);
    let fileContents = '';
    try {
         fileContents = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
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