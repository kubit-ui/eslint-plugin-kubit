## Contributing

We welcome contributions to **eslint-plugin-kubit**! This project is open source and we encourage community participation through **forks and pull requests**. All contributions must be made through the fork workflow - we do not accept direct pushes to the main repository.

### Why Fork-Based Contributing?

This project follows the **fork-based contribution model** to:

- Maintain code quality and security
- Ensure all changes are reviewed before merging
- Keep the main repository clean and stable
- Allow contributors to work independently on features

### Development Workflow

1. **Fork the Repository**: Click the "Fork" button in the upper right corner of the [eslint-plugin-kubit repository](https://github.com/kubit-ui/eslint-plugin-kubit) on GitHub. This will create a copy of the repository in your GitHub account.

2. **Clone Your Fork**: Clone your forked repository to your local machine (not the original repository).

   ```sh
   git clone https://github.com/your-username/eslint-plugin-kubit.git
   cd eslint-plugin-kubit
   ```

3. **Add Original Repository as Upstream**: Add the original repository as a remote to keep your fork synchronized.

   ```sh
   git remote add upstream https://github.com/kubit-ui/eslint-plugin-kubit.git
   git fetch upstream
   ```

4. **Create a Feature Branch**: Always create a new branch for your changes. Use proper branch naming conventions for automatic version detection.

   ```sh
   git checkout -b <branch-type>/<branch-name>
   ```

5. **Install Dependencies and Run Tests**:

   ```sh
   pnpm install
   pnpm test
   ```

6. **Make Changes**:
   - Follow the coding standards outlined in this guide
   - Add or update tests for your changes
   - Update documentation if necessary
   - Test your changes thoroughly using `pnpm test`

7. **Commit Changes**: Use conventional commit messages for clarity.

   ```sh
   git add .
   git commit -m "feat(rules): add new ESLint rule"
   ```

8. **Keep Your Fork Updated**: Before pushing, sync with the upstream repository.

   ```sh
   git fetch upstream
   git rebase upstream/main
   ```

9. **Push to Your Fork**: Push your changes to your forked repository (never to the original).

   ```sh
   git push origin <branch-name>
   ```

10. **Open a Pull Request**:
    - Go to the original [eslint-plugin-kubit repository](https://github.com/kubit-ui/eslint-plugin-kubit)
    - Click "New pull request"
    - Select "compare across forks"
    - Choose your fork and branch as the source
    - Fill out the PR template with details about your changes
    - Submit the pull request for review

### Adding a New Rule

When contributing a new ESLint rule:

1. Create the rule file in `lib/rules/<rule-name>.js`
2. Add the rule to `lib/index.js`
3. Create tests in `tests/rules/<rule-name>.test.js`
4. Add documentation in `docs/rules/<rule-name>.md`
5. Update `README.md` with the new rule
6. Ensure all tests pass with `pnpm test`

Every rule **must** include:

- `meta.type` (problem, suggestion, or layout)
- `meta.docs` with description and url
- `meta.messages` (use messageIds, not inline strings)
- `meta.schema` for options validation
- Tests covering valid and invalid cases

### Automatic Version Management with Changesets

This repository uses **[Changesets](https://github.com/changesets/changesets)** for automated version management and changelog generation.

#### How It Works (Fully Automatic)

1. **You create a PR** with proper branch naming (feat/, fix/, break/)
2. **PR gets merged** to main
3. **Workflow automatically:**
   - Detects version bump type from branch name
   - Generates changeset from PR title and description
   - Updates package version
   - Updates CHANGELOG.md
   - Publishes to NPM
   - Creates GitHub Release
   - Comments on your PR with publish details

#### Branch Naming Determines Version

The version bump is automatically detected from your branch name:

- `feat/` or `feature/` - **MINOR** version bump (new features)
- `fix/` or `bugfix/` - **PATCH** version bump (bug fixes)
- `break/` or `breaking/` - **MAJOR** version bump (breaking changes)

### Branch Naming Patterns

| Branch Pattern          | Version Bump | Example                    | Description                  |
| ----------------------- | ------------ | -------------------------- | ---------------------------- |
| `feat/` or `feature/`   | **MINOR**    | `feat/new-rule`            | New ESLint rules             |
| `fix/` or `bugfix/`     | **PATCH**    | `fix/rule-false-positive`  | Bug fixes in rules           |
| `break/` or `breaking/` | **MAJOR**    | `break/remove-deprecated`  | Breaking rule changes        |
| `hotfix/`               | **PATCH**    | `hotfix/critical-bug`      | Urgent fixes                 |
| `chore/`                | **PATCH**    | `chore/update-deps`        | Maintenance tasks            |

### Requirements

Before contributing, ensure you have the following installed:

- **Node.js**: v20.x or higher (recommended: v22.x)
- **pnpm**: v9.x or higher (recommended: v10.29.2)
- **Git**: Latest version

### Development Commands

```sh
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint the codebase
pnpm lint

# Test locally in another project
pnpm link --global
cd /path/to/test-project
pnpm link --global eslint-plugin-kubit
```

### Testing Your Changes

Before submitting your PR:

1. **Run all tests**: `pnpm test`
2. **Verify no conflicts**: Ensure rules don't conflict with each other
3. **Check documentation**: Update docs with any new options
4. **Validate examples**: Ensure all code examples in docs are correct
5. **Test with a real project**: Link locally and test in a real codebase

### Code Review Process

Once you submit your PR:

1. **Automated Checks**: GitHub Actions will run validation workflows
2. **Code Review**: Maintainers will review your changes
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Auto-publish**: The package will be automatically published to NPM

### Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please be respectful and inclusive in all interactions.

### License

By contributing to eslint-plugin-kubit, you agree that your contributions will be licensed under the [Apache 2.0 License](./LICENSE).
