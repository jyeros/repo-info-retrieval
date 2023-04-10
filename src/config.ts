import dotenv from 'dotenv';

import { getEnvs } from './utils/env';

dotenv.config();

const { GITHUB_TOKEN } = getEnvs(['GITHUB_TOKEN']);

const config = {
	githubToken: GITHUB_TOKEN,
};

export { config };
