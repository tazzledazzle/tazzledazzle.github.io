import { generateStaticParams, default as PostPage } from '../app/blog/[id]/page';
import { render, screen } from '@testing-library/react';
import fs from 'fs';
import {fetchPost} from "../app/utils/posts";

jest.mock('fs');
const mockedRead = fs.readFileSync as jest.Mock;
const mockedReaddirSync = fs.readdirSync as jest.Mock;

describe('blog page utilities', () => {
  beforeEach(() => {
    mockedRead.mockReset();
    mockedReaddirSync.mockReset();
  });

  test('generateStaticParams returns ids', () => {
    mockedReaddirSync.mockReturnValue(['1.md', '2.md', '3.md']);
    expect(generateStaticParams()).toEqual([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);
  });

  test('fetchPost parses markdown', async () => {
    mockedRead.mockReturnValue('---\ntitle: Test\n---\ncontent');
    const result = await fetchPost('1');
    expect(result.title).toBe('Test');
    expect(result.content).toContain('<p>content');
  });

  test('fetchPost throws on error', async () => {
    mockedRead.mockImplementation(() => { throw new Error('fail'); });
    await expect(fetchPost('missing')).rejects.toThrow('fail');
  });
});

describe('PostPage component', () => {
  test('renders fetched post', async () => {
    mockedRead.mockReturnValue('---\ntitle: Hello\n---\nworld');
    const element = await PostPage({ params: { id: '1' } });
    render(element);
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });
});
