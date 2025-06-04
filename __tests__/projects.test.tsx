import { getProjectData, generateStaticParams, default as ProjectPage } from '../app/projects/[id]/page';
import { render, screen } from '@testing-library/react';
import fs from 'fs';

jest.mock('fs');
const mockedRead = fs.readFileSync as jest.Mock;
const mockedReaddir = fs.readdirSync as jest.Mock;

describe('projects utilities', () => {
  beforeEach(() => {
    mockedRead.mockReset();
    mockedReaddir.mockReset();
  });

  test('generateStaticParams reads project files', () => {
    mockedReaddir.mockReturnValue(['1.md', '2.md']);
    expect(generateStaticParams()).toEqual([{ id: '1' }, { id: '2' }]);
  });

  test('getProjectData parses markdown', async () => {
    mockedRead.mockReturnValue(`---\ntitle: T\ndescription: D\nimage: i.jpg\ngithub: g\nlive: l\n---\ncontent`);
    const result = await getProjectData('1');
    expect(result.title).toBe('T');
    expect(result.description).toBe('D');
    expect(result.image).toBe('i.jpg');
    expect(result.github).toBe('g');
    expect(result.live).toBe('l');
    expect(result.content).toContain('<p>content');
  });
});

describe('ProjectPage component', () => {
  test('renders project content', async () => {
    mockedRead.mockReturnValue(`---\ntitle: Test\n---\nhello`);
    const element = await ProjectPage({ params: { id: '1' } });
    render(element);
    expect(screen.getByRole('heading', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
