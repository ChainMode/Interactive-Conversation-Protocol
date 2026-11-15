# Security Policy — Interactive Conversation Protocol (ICP)

## Supported Protocol & Artifact Versions

Security advisories and patches are maintained for the following released ICP baseline and `@ifay/icp` reference library:

| Protocol Version | Normative Artifacts | Security Support |
| --- | --- | --- |
| `1.0` (`icp-ctx-file/1.0`) | `schemas/icp-1.0.json`, `schema/2025-10-25/`, `vectors/icp-1.0-conformance.json`, `src/` (`@ifay/icp` `1.0.x`) | Supported |
| `< 1.0` (pre-release drafts) | Superseded snapshots | Unsupported |

## Security Scope

Security reports are prioritized for vulnerabilities or specification gaps affecting `.ctx` processing and `@ifay/icp` (`src/`):

1. **`.ctx` Parser, Mode Conversion & Anchor Graph Safety**: Algorithmic complexity / ReDoS or injection bugs in `parseInline` and `PrettyPrinter` (`src/inline.mjs`), `sidecar` / `detached` `sha256` digest verification bypasses or unintended `source.content` injection (`src/modes.mjs`), anchor-media matrix escapes, or bypasses of directed anchor cycle detection (`E_ICP_ANCHOR_CYCLE`, `src/validator.mjs`).
2. **`secret` Sign Redaction & Zero-Leak Audit Serialization**: Any path in terminal degradation (`src/degrade.mjs`), mode conversion, or audit logging (`src/security.mjs`) where content annotated with the built-in `secret` sign fails to mask as `••••••••` by default or leaks raw sensitive plaintext to logs or storage.
3. **Mandatory `Human Prime` Consent & CAP 1.0 Reaction Gate**: Any bypass of the Default-Deny reaction safety gate (`src/security.mjs`) allowing side-effecting or cross-**Host** reactions (`url`, `function`, `app`, `command`, or any reaction carrying `target_device`) to execute without explicit **Human Prime** consent, allowing unverified `.ctx` sources to persist permanent allowlist overrides, failing to downgrade unsupported `render` components on a **Host** to `text_block`, or failing to emit a valid **CAP 1.0** (`cap/1.0`) delegation envelope for **Host** capability or cross-**Host** actions.

## Reporting a Vulnerability Privately

**Please do NOT report undisclosed security vulnerabilities via public GitHub Issues, Discussions, or Pull Requests.**

### 1. Primary Channel — GitHub Private Vulnerability Reporting

Submit a confidential report directly via **GitHub Security Advisories**:

- **Report URL**: https://github.com/ChainMode/Interactive-Conversation-Protocol/security/advisories/new

### 2. Fallback Channel — Security Email

If GitHub Security Advisories are unavailable, send your report via email:

- **Email**: **jah.g@ifay.ai**
- Include `[SECURITY][ICP]` in the subject line along with affected module/schema sections, minimal `.ctx` proof-of-concept input, and impact assessment.

## Response & Coordinated Disclosure Timeline

- **Initial Acknowledgment**: Within **72 hours** of report receipt.
- **Triage & Validation**: Within **7 calendar days** to confirm root cause and affected versions.
- **Coordinated Disclosure Window**: **90 days** from report submission to publish fixes, regression conformance vectors, and a coordinated GitHub Security Advisory (crediting the reporter unless anonymity is requested).
