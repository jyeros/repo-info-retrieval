import { readFile } from 'fs/promises';

interface BaseProject {
	name: string;
	organization: string;
	url: string;
	language: string;
	libraries: string;
}

interface Project extends BaseProject {
	repoOwner: string;
	repoName: string;
}

const getProjects = async (path: string): Promise<Project[]> => {
	const projects = await readFile(path, 'utf-8');

	const projectsObj: BaseProject[] = JSON.parse(projects);

	return projectsObj.map((project) => {
		const url = new URL(project.url);
		const [repoOwner, repoName] = url.pathname.split('/').slice(1);
		return { ...project, repoOwner, repoName };
	});
};

export { Project, getProjects };
