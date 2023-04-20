import { writeFile } from 'fs/promises';

import { getGithubRepo } from './github';
import { type BaseProject, getProjects } from './projects';
import { type RepoInfo } from './repoInfo';

type GithubProject = BaseProject & RepoInfo;

const main = async () => {
	const projects = await getProjects('projects.json');
	const result: GithubProject[] = [];

	for (const project of projects) {
		const { repoOwner, repoName, ...restProject } = project;
		const repoInfo = await getGithubRepo(repoOwner, repoName);
		result.push({
			...restProject,
			...repoInfo,
		});
	}

	await writeFile('result.json', JSON.stringify(result, null, 2));
};

main();
