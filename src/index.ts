import { writeFile } from 'fs/promises';

import { getGithubRepo } from './github';
import { type Project, getProjects } from './projects';
import { type RepoInfo } from './repoInfo';

type GithubProject = Project & RepoInfo;

const main = async () => {
	const projects = await getProjects('projects.json');
	const result: GithubProject[] = [];

	for (const project of projects) {
		const repoInfo = await getGithubRepo(project.repoOwner, project.repoName);
		result.push({
			...project,
			...repoInfo,
		});
	}

	await writeFile('result.json', JSON.stringify(result, null, 2));
};

main();
