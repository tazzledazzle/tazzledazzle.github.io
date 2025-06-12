import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from "remark-html";

export async function fetchPost(id: string) {
    const filePath = path.join(process.cwd(), 'app/_posts', `${id}.md`);
    var fileContents = '';
    try {
        fileContents = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
    const {data, content} = matter(fileContents != '' ? fileContents : '');

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
        title: data.title,
        content: contentHtml,
    };
}