interface RepoInfo {
	size: number;
	createdAt: string;
	description: string | null | undefined;
	committers: number;
	numberCommits: number;
	dependencies: string[];
}

export { RepoInfo };
