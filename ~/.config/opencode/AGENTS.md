# Agent Swarm Protocol

*Global rules for the 12-agent swarm. Loaded into every session.*

## Artifact Paths

The swarm communicates via markdown files in `~/.opencode/`:

| Directory | Purpose |
|---|---|
| `~/.opencode/artifacts/dags/` | staff-router task DAG outputs |
| `~/.opencode/artifacts/progress/` | mid-level progress logs |
| `~/.opencode/artifacts/engineer-1/` | engineer-1 work notes |
| `~/.opencode/artifacts/engineer-2/` | engineer-2 validation results |
| `~/.opencode/artifacts/critic/` | senior-critic findings |
| `~/.opencode/artifacts/qa/` | qa-engineer test outputs |
| `~/.opencode/artifacts/security/` | security-reviewer findings |
| `~/.opencode/artifacts/retros/` | retro-agent retrospectives |
| `~/.opencode/memory/patterns.md` | recurring quality patterns |
| `~/.opencode/memory/anti-patterns.md` | quality anti-patterns to avoid |
| `~/.opencode/memory/swarm-learnings.md` | cross-project learnings |

## Naming Convention

All artifacts follow: `<YYYYMMDD>-<project>-<task-id>-<agent>.md`

Example: `20260420-myapp-login-flow-staff-router.md`

## Customer Anchor

Every task brief MUST state:
- **Who** is the user?
- **What** job does this help them do?
- **What's** the success metric?

If you cannot state the user benefit in one sentence, stop and ask the user.

## Handoff Rule

When agents communicate:
- Return `file-path + 1-2 sentence summary`
- NEVER inline full code in returns
- File paths include task ID for traceability

## Escalation Protocol

When blocked, output:
```
ESCALATE: <reason>
```

This surfaces blockers to the human. Use sparingly.

## Git Commit Ban

**NEVER commit to git.** This applies globally and is enforced at the permission level in `opencode.json`. If you need changes committed, the human will do it.

## Agent Roles

| Agent | Role |
|---|---|
| staff-router | Task decomposition, DAG output, planning-only |
| mid-level | Feature orchestration, delegates to specialists |
| engineer-1 | Atomic code execution (1 function/fix) |
| engineer-2 | Syntax validation, lint, tests |
| senior-critic | Quality gate, blocks low-quality work |
| qa-engineer | Adversarial testing, edge cases |
| security-reviewer | Read-only security audit |
| frontend-builder | UI components, React, accessibility |
| backend-builder | API routes, server logic |
| ai-engineer | Agent prompt design, eval harnesses |
| docs-agent | Technical writing, README updates |
| retro-agent | Post-project analysis, continuous improvement |

## Orchestration Flow

```
User request
    ↓
[Tab → staff-router]   ← planning phase, produces DAG, stops
    ↓
User reviews DAG
    ↓
[Tab → mid-level]      ← execution phase
    ↓
  Dispatches via task tool:
    → engineer-1 → engineer-2 → senior-critic   (atomic loop)
    → frontend-builder / backend-builder / ai-engineer (domain work)
    → qa-engineer (after implementation)
    → security-reviewer (after auth/data/API changes)
    → docs-agent (after merge-ready)
    ↓
[@retro-agent]         ← post-project analysis (manual trigger)
```

## Invariants

- Agents never edit the same file simultaneously
- Critic has hard cap of 3 rejection cycles before escalating to human
- Staff-router always outputs DAG; never proceeds to execution
- Security-reviewer is read-only on project code
- All agents write to artifacts/ for traceability
- Retro-agent runs after project completion, updates shared learnings
- No agent should loop more than its max_turns cap; escalate if stuck