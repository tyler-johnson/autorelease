# CI Release Flow

## Why?
- release very often, even after a single change
- releases are very consistent, regardless of who is making the release
- published version is always up-to-date with master branch
- very straight forward, even for new contributors
- *downside*, everyone must stick to semantic commit message convention

## Typical Flow
- designate a single git branch as the main release branch, typically master
- configure autorelease to only release from the main branch
- configure CI to always run on pushes to main branch
- development on and push to branches that are not the main branch
- when the package is ready for release, merge with the main branch and allow CI to run autorelease
