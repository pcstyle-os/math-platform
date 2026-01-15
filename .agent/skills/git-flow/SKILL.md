# git-flow

## Description

Advanced Git operations including rebasing, cherry-picking, interactive rebase, and conflict resolution.

## Instructions

- Use `git rebase -i` to clean up commits before merging.
- Use `git cherry-pick` to pull specific bug fixes into release branches.
- Use `git stash` to move work-in-progress changes between branches.
- Resolve conflicts by manually editing conflict markers and then using `git add` and `git rebase --continue`.
- Prefer `git merge --no-ff` for feature branches to keep history clear.
