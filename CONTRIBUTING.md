# Contributing to Interactive Conversation Protocol (ICP)

Thank you for contributing to **Interactive Conversation Protocol (ICP)** (`icp-ctx-file/1.0`) and `@ifay/icp`! This guide covers local setup, test and conformance verification, schema stability rules, commit sign-off, terminology standards, and dual-track licensing.

## Code of Conduct & Security

- All participants are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md) (contact: **jah.g@ifay.ai**).
- Never report undisclosed vulnerabilities in public issues or pull requests; follow [SECURITY.md](./SECURITY.md) for private disclosure.

## Contribution Workflow

1. Fork `https://github.com/ChainMode/Interactive-Conversation-Protocol` on GitHub.
2. Clone your fork and add `upstream`:
   ```bash
   git clone https://github.com/<your-username>/Interactive-Conversation-Protocol.git
   cd Interactive-Conversation-Protocol
   git remote add upstream https://github.com/ChainMode/Interactive-Conversation-Protocol.git
   ```
3. Create a topic branch from `main` (`feat/`, `fix/`, `docs/`, `schema/`, `test/`, `chore/`).
4. Run `npm test` to verify all unit, AST round-trip, reaction gate, and conformance vector suites before opening a Pull Request.

## Development Setup & Verification

`@ifay/icp` (`src/`) is a zero-runtime-dependency Node.js (`>= 20.0.0`) ESM reference implementation.

```bash
# Run unit tests, inline AST round-trip properties, reaction safety checks, and 20 conformance vectors
npm test
```

## Schema & Conformance Vector Discipline

- **Frozen `1.0` Baseline**: `schemas/icp-1.0.json`, `schema/2025-10-25/`, `docs/zh-CN/specification/2025-10-25/index.md`, and `vectors/icp-1.0-conformance.json` define the normative `icp-ctx-file/1.0` contract and are **frozen** once released.
- **Additive Minor Evolution**: Backward-compatible `1.x` extensions MUST be introduced as new versioned schema and vector files (for example `schemas/icp-1.1.json` and `vectors/icp-1.1-conformance.json`), preserving vendor-namespaced (`vendor:name`) pass-through and lossless conversion across `inline`, `sidecar`, and `bundled` modes.
- **Reaction & Redaction Safety**: Changes touching `src/security.mjs` or `src/degrade.mjs` MUST preserve default `secret` masking (`••••••••`), mandatory **Human Prime** explicit consent for side-effecting or cross-**Host** reactions, and **CAP 1.0** (`cap/1.0`) delegation envelope generation.

## Ecosystem Terminology Rules

Use positive canonical iFay terminology across all specifications, schemas, code, and translations:

- **`Human Prime`** (`人类原型`): Exclusively denotes the natural person interacting with and authorizing a `Fay`.
- **`Host`** (`宿主`): Strictly denotes a runtime terminal hardware device or client software application rendering `.ctx` content or executing authorized reactions.
- **`Fay`** (`iFay` + `coFay`): Denotes an accountable digital avatar bound to a verifiable legal responsibility entity.
- **`GMChain`** (`公誉链`) & **`MeriToken`** (`美誉值` / `Merit Unit`): Denotes the ecosystem's strictly non-monetary social contribution reputation metric.

## Commit Convention & DCO 1.1 Sign-Off

Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `schema`, `refactor`, `test`, `chore`).

Every commit MUST include a **Developer Certificate of Origin v1.1 (DCO 1.1)** `Signed-off-by` trailer (`git commit -s`) certifying contribution rights under https://developercertificate.org/ (no separate CLA required):

```text
test(security): verify cross-Host reaction requires CAP 1.0 envelope

Signed-off-by: Your Legal Name <you@example.com>
```

## Dual-Track Inbound = Outbound Licensing

By contributing (`Inbound = Outbound`), you license your contribution under this repository's dual-track model (`Copyright (c) 2025-2026 ChainMode contributors`):

- **MIT License** ([`LICENSE`](./LICENSE)) for `@ifay/icp` reference code and tests (`src/`, `tests/`), machine-readable schemas (`schemas/`, `schema/`), and conformance test vectors (`vectors/`).
- **Creative Commons Attribution 4.0 International (`CC BY 4.0`)** ([`LICENSE-DOCS`](./LICENSE-DOCS)) for protocol specifications and architectural blueprint documents under `docs/`.
