import { Octokit } from 'octokit';
import { RepoInfo } from './repoInfo';

const githubClient = new Octokit();

const getGithubRepo = async (owner: string, repo: string): Promise<RepoInfo> => {
	console.log(`Getting repo info for, ${owner}/${repo}`)
	const repoInfo = await githubClient.rest.repos.get({ repo, owner });

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

	return {
		size: repoInfo.data.size,
		createdAt: repoInfo.data.created_at,
		description: repoInfo.data.description,
		committers: committers.size,
	};
};

getGithubRepo('octokit', 'octokit.js').then((data) => console.log(data));
