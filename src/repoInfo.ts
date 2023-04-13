interface RepoInfo {
	size: number;
	createdAt: string;
	description: string | null | undefined;
	committers: number;
	numberCommits: number;
	dependencies: string[];
	forks: number;
	watchers: number;
	stars: number;
	totalIssues: number;
	openIssues: number;
	totalPulls: number;
	openPulls: number;
	branches: number;
	releases: number;
}

export { RepoInfo };
