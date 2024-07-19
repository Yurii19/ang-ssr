import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  
  private token = '';

  ghConfig = {
    owner: 'Yurii19',
    repo: 'static',
    path: '',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  constructor() {}

  async createFolder(folderName: string) {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
      auth: this.token,
    });

    return await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: this.ghConfig.owner,
      repo: this.ghConfig.repo,
      path: folderName+ '/index.txt',
      message: `Folder ${folderName} have created.`,
      committer: {
        name: 'Yurii19',
        email: 'YuriiKolecyurikolechkin@gmail.com',
      },
      content: 'bXkgbmV3IGZpbGUgY29udGVudHM=',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  async getRepo() {
    const octokit = new Octokit({
      auth: this.token,
    });

    return await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      this.ghConfig
    );
  }

  async getFolder(folder: string) {
    const octokit = new Octokit({
      auth: this.token,
    });

    return await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      ...this.ghConfig,
      path: folder,
    });
  }
}
