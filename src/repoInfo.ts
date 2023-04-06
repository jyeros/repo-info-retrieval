interface RepoInfo {
	size: number;
	createdAt: string;
	description: string | null | undefined;
	committers: number;
	dependencies: string[];
}

export { RepoInfo };
