# Next Task

This file contains exactly one bounded next task.

## Task

**Title:** Run the Milestone 0 Quest 3 manual acceptance test.

## Why this is next

Automated and desktop validation passed, but the Milestone 0 success condition depends on physical evidence for Quest Browser immersive AR, passthrough, floor registration, world stability, session re-entry, and recenter behavior.

## Recommended execution

**Model:** GPT-5.6 Sol

**Reasoning effort:** High

**Mode:** Plan, then guided physical validation

**Thread:** Main control thread

## Objective

Using an authorized HTTPS deployment of the committed Milestone 0 spike and a physical Meta Quest 3, execute `docs/QUEST_TESTING.md`, preserve evidence, and classify each criterion as PASS, FAIL, or NOT RUN without changing application behavior.

## Prerequisites

- The Milestone 0 implementation commit is available at an authorized HTTPS URL.
- A physical Meta Quest 3 and a safe test area are available.
- Quest OS version, Quest Browser version, tested URL, and tested commit can be recorded.

If no authorized HTTPS URL exists, stop and request a separately authorized deployment task; this task does not itself authorize remote creation, push, Pages enablement, or deployment.

## Required work

1. Confirm the deployed URL corresponds to the intended implementation commit.
2. Execute every step in `docs/QUEST_TESTING.md` on Quest 3.
3. Record passthrough, floor alignment, vertical alignment, lateral/vertical motion, 60-second drift, exit/re-entry, and recenter evidence.
4. Classify every criterion as PASS, FAIL, or NOT RUN.
5. Update `PROJECT_STATE.md`, `CHANGELOG.md`, and the evidence table without implementing fixes during the acceptance run.
6. Set exactly one next task based on the physical evidence.

## Prohibited scope

- No north calibration, controller raycasting, geolocation, Astronomy Engine, celestial geometry, persistence, or time controls.
- No application fixes mixed into the evidence-gathering run.
- No remote, push, deployment, or external configuration without explicit separate authorization.
- Do not mark a criterion passed from code inspection or desktop behavior.

## Acceptance criteria

1. Tested device, OS, browser, URL, and commit are recorded.
2. Every checklist criterion has PASS, FAIL, or NOT RUN with concise evidence.
3. Passthrough and `local-floor` claims rely on physical observation.
4. Failures produce a bounded diagnostic/fix task rather than silent scope expansion.
5. Milestone 1 does not begin unless the technical-spike risk is explicitly resolved or deliberately accepted.

## Stop conditions

- No authorized HTTPS deployment is available.
- The deployed commit cannot be identified.
- Safe physical testing is not possible.
- A failure requires code changes; record it and stop before fixing.
- Completion would require an unauthorized external action.

## Expected return format

```text
Objective:
Status: Complete | Partial | Blocked

Test target:
- Device:
- Quest OS:
- Quest Browser:
- URL:
- Commit:

Evidence:
- PASS:
- FAIL:
- NOT RUN:

Milestone 0 result:
- PASS | CONDITIONAL PASS | FAIL

Exact next task:
- <one bounded task>
```
