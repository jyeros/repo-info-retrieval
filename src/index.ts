import { getGithubRepo } from './github';

getGithubRepo('octokit', 'octokit.js').then((data) => console.log(data));
