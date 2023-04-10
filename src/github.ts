import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Octokit } from 'octokit';

import { config } from './config';
import { type RepoInfo } from './repoInfo';

const githubClient = new Octokit({ auth: config.githubToken });

const getGithubCommitters = async (owner: string, repo: string) => {
	const committers = new Set<string>();

	let response: Awaited<ReturnType<typeof githubClient.rest.repos.listCommits>>;
	let page = 1;
	do {
		// max page size is 100
		response = await githubClient.rest.repos.listCommits({ repo, owner, per_page: 100, page });
		response.data.forEach((commit) => {
			if (commit?.author?.login) committers.add(commit.author.login);
		});
		page++;
	} while (response.data.length > 0);

	return committers;
};

const getGithubDependencies = async (owner: string, repo: string) => {
	const dependencies = new Set<string>();

	let currentDependencies: ReturnType<typeof parse>[] = [];
	let page = 1;
	do {
		const response = await fetch(`https://github.com/${owner}/${repo}/network/dependencies?page=${page}`, {
			method: 'GET',
		});
		const body = await response.text();
		const html = parse(body);
		currentDependencies = html.querySelectorAll('li.Box-row');
		for (const container of currentDependencies) {
			const dependencyElement = container.querySelector('a[data-hovercard-type="dependendency_graph_package"]');
			const dependencyVersionElement = dependencyElement?.parentNode.querySelector('span');
			const dependency = `${dependencyElement?.text.trim()} ${dependencyVersionElement?.text.trim()}`;
			dependencies.add(dependency);
		}
		page += 1;
	} while (currentDependencies.length > 0);

	return dependencies;
};

const getGithubRepo = async (owner: string, repo: string): Promise<RepoInfo> => {
	console.log(`Getting repo info for, ${owner}/${repo}`);

	const repoInfo = await githubClient.rest.repos.get({ repo, owner });
	const committers = await getGithubCommitters(owner, repo);
	const dependencies = await getGithubDependencies(owner, repo);

	return {
		size: repoInfo.data.size,
		createdAt: repoInfo.data.created_at,
		description: repoInfo.data.description,
		committers: committers.size,
		dependencies: [...dependencies],
	};
};

export { getGithubRepo };
