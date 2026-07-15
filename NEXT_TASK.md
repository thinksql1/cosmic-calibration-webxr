# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Publish the Milestone 0 test site to GitHub Pages.

## Why this is next

Milestone 0 is integrated into local `master`, and its automated and desktop integration checks passed. Physical Quest validation requires an HTTPS site serving the exact integrated build. No GitHub repository, remote, deployment, or Pages URL currently exists.

## Recommended execution

**Model:** GPT-5.6 Sol

**Reasoning effort:** High

**Mode:** Guided publication with explicit authorization gates

**Thread:** Main control thread

## Objective

After the user explicitly confirms the GitHub account, repository name, repository visibility, and each external publication action, create the GitHub repository, add the remote, push local `master` normally, publish with GitHub Actions, verify the HTTPS production site, and record the exact URL without claiming Quest success.

## Required work

1. Confirm the working tree is clean and local `master` contains the integrated Milestone 0 commits.
2. Ask the user to confirm the authorized GitHub account, repository name, and repository visibility.
3. Before creating a repository, adding a remote, pushing, enabling Pages, or causing deployment, present the exact external action and obtain explicit authorization.
4. Create the repository without altering local history, add the intended remote, and push `master` normally.
5. Configure Pages to publish through GitHub Actions and observe the existing workflow through completion.
6. Open the resulting HTTPS URL, verify the production application and relative assets, and record the URL and tested commit in `PROJECT_STATE.md`.
7. Preserve Quest validation as **NOT RUN** and replace this file with exactly one physical Quest 3 acceptance task.

## Prohibited scope

- Do not create a GitHub repository, add a remote, push, enable Pages, or cause deployment before the corresponding external action is explicitly authorized.
- Do not rewrite local history, force-push, delete branches, expose credentials, add dependencies, change application behavior, or begin Quest testing.
- Do not begin north calibration, controller raycasting, geolocation, Astronomy Engine, celestial geometry, persistence, or time controls.
- Do not infer Quest passthrough, floor registration, stability, drift, re-entry, or recenter behavior from the hosted desktop/browser check.

## Acceptance criteria

1. Authorized GitHub account and repository name are confirmed.
2. Repository visibility is confirmed.
3. GitHub repository is created without altering local history.
4. Local `master` is pushed normally.
5. Pages publishing source uses GitHub Actions.
6. Workflow completes successfully.
7. HTTPS Pages URL loads the production site.
8. URL is recorded in `PROJECT_STATE.md`.
9. Quest success remains unclaimed.
10. `NEXT_TASK.md` then becomes the physical Quest 3 acceptance test.

## Stop conditions

- The GitHub account, repository name, visibility, or external authorization is missing or ambiguous.
- Repository creation, remote configuration, push, Pages enablement, or deployment differs from the exact authorized action.
- Credentials, repository permissions, workflow execution, or the HTTPS site cannot be verified safely.
- Publication would require rewriting history, force-pushing, changing application behavior, or expanding scope.

## Expected return format

```text
Objective:
Status: Complete | Partial | Blocked

Authorization:
- Account:
- Repository:
- Visibility:
- Approved external actions:

Publication:
- Remote:
- Pushed commit:
- Workflow:
- HTTPS URL:

Validation:
- PASS:
- FAIL:
- NOT RUN:

Exact next task:
- <one bounded task>
```
