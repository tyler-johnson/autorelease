# Configuring Autorelease for GitHub and Travis CI

This is a guide to help you set up Autorelease to automatically publish your Node.js projects using Travis CI and Github. This guide assumes a couple of things:

- You are using Github and Travis CI.
- You want to publish to a NPM registry and you have an account.
- You use [semantic commit message conventions](../semantic-commit-messages.md)

## Easy Method

The easiest way to configure Autorelease for GitHub and Travis CI is to use the Autorelease setup CLI. This will take you through a series of prompts and then properly configure your project. This automated setup more or less follows the same steps as the manual process.

> Note: this process will obtain access tokens for Github and NPM, which requires that you enter your credentials. If you don't trust giving your credentials to the CLI tool, you can always install Autorelease using the manual method below.

Run the following command in your shell:

```bash
npm i autorelease -g
autorelease setup -i pre,github,travis
```

After, you can commit and push to GitHub so Travis CI will take over with the release. Make sure to follow semantic commit message conventions and add a commit type of `fix` or `feat` so the version can be bumped.

```bash
git add --all
git diff HEAD # review changes before committing!
git commit -m "fix: publish with autorelease"
```

## Manual Method

If you are curious how Autorelease is setup or do not trust entering your NPM and GitHub credentials in the setup prompt, you can follow these steps to configure your package.

### Step 1: Configure Your Project Locally

1. *To begin, install some NPM dependencies needed for autorelease*

  ```bash
  npm i autorelease autorelease-plugin-pre autorelease-plugin-github autorelease-plugin-travis -D
  ```

2. *Create an `.autoreleaserc` file in the root of your package with the following contents*

  ```json
  {
    "branch": [ "master" ],
    "plugins": [
      "pre",
      "github",
      "travis"
    ]
  }
  ```

  The `branch` option will be verified in Travis CI before releasing. Set this value to the git branch you want to run autorelease from. All other branches will be denied.

3. *Add an `autorelease` NPM script to your `package.json`*

  ```json
  "scripts": {
    "autorelease": "autorelease pre && npm publish && autorelease post"
  }
  ```

4. *Ensure the `package.json` contains your GitHub repository information*

  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/ghusername/my-autorelease-project.git"
  }
  ```

5. *Modify your `.travis.yml` file to run the `autorelease` script on `after_success`*

  ```yml
  after_success:
    - npm run autorelease
  ```

6. *Commit and push these changes to your GitHub repository.*

  Make sure to follow semantic commit message conventions and add a commit type of `fix` or `feat` so the version can be bumped.

  ```bash
  git add --all
  git diff HEAD # review changes before committing!
  git commit -m "fix: publish with autorelease"
  ```

### Step 2: Configure Travis CI

Since Autorelease is run in the Travis CI environment, the CI must be configured to securely publish to NPM and GitHub on your behalf.

1. *Obtain an NPM Auth Token*

  There are several ways to obtain an NPM auth token, probably the easiest being [`get-npm-token`](https://www.npmjs.com/package/get-npm-token). You can also get tokens from `npm login` and your `.npmrc` file. All of you auth tokens are listed on your [NPM token page](https://www.npmjs.com/settings/tokens).

2. *Obtain a GitHub Personal Access Token*

  Autorelease will create GitHub releases with the changelog which requires access to the GitHub API. Create a GitHub Personal Access Token for the CI to use by going to your [GitHub settings](https://github.com/settings/tokens). We recommend giving the token a description specific for this project. The token needs to have the minimum scopes of `repo`, `read:org`, `user:email`, and `write:repo_hook`.

3. *Add the NPM and GitHub Tokens to Travis CI*

  Add the NPM auth token and GitHub personal access token as secure Travis environment variables. You can do this through the Travis web interface under the project's settings.

  ```
  NPM_TOKEN=XXXXXX
  GH_TOKEN=XXXXXX
  ```
