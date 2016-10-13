# Configuring Autorelease for GitHub and Travis CI

### Easy Method

The easiest way to configure autorelease for GitHub and Travis CI is to use the autorelease setup CLI. This will take you through a series of prompts and then properly configure your project. This automated setup more or less follows the same steps as the manual process.

Run the following command in your shell:

```bash
npm i autorelease -g
autorelease setup -i github,travis
```

### Manual Method

If you are curious how Autorelease is setup or do not trust entering your NPM and GitHub credentials in the setup prompt, you can follow these steps to configure your package.

#### Step 1: Configure Your Package Locally

To begin, install some NPM dependencies needed for autorelease:

```bash
npm i autorelease autorelease-plugin-github autorelease-plugin-travis -D
```

Next, create an `.autoreleaserc` file in the root of your package with the following contents:

```json
{
  "branch": [ "master" ],
  "plugins": [
    "github",
    "travis"
  ]
}
```

The `branch` option will be verified in Travis CI before releasing. Set this value to the git branch you want to run autorelease from. All other branches will be denied.

Now, add an `autorelease` NPM script to your `package.json`:

```json
"scripts": {
  "autorelease": "autorelease pre && npm publish && autorelease post"
}
```

Also, make sure that the `package.json` contains the GitHub repository information:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/ghusername/my-autorelease-project.git"
}
```

Lastly, modify your `.travis.yml` file to run the `autorelease` script on `after_success`.

```yml
after_success:
  - npm run autorelease
```

Commit and push these changes to your remote GitHub repository.

#### Step 2: Configure Travis CI

Since Autorelease is run in the Travis CI environment, the CI must be configured to securely publish to NPM and GitHub on your behalf.

##### Obtain an NPM Auth Token

There are several ways to obtain an NPM auth token, probably the easiest being [`get-npm-token`](https://www.npmjs.com/package/get-npm-token). You can also get tokens from `npm login` and your `.npmrc` file. All of you auth tokens are listed on your [NPM token page](https://www.npmjs.com/settings/tokens).

##### Obtain a GitHub Personal Access Token

Autorelease will create GitHub releases with the changelog which requires access to the GitHub API. Create a GitHub Personal Access Token for the CI to use by going to your [GitHub settings](https://github.com/settings/tokens). We recommend giving the token a description specific for this project.

##### Add the NPM and GitHub Tokens to Travis CI

Add the NPM auth token and GitHub personal access token as secure Travis environment variables. You can do this through the Travis web interface under the project's settings.

```bash
NPM_TOKEN=XXXXXX
GH_TOKEN=XXXXXX
```
