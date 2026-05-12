# 需求文档

## 简介

本需求文档定义 ICP（Interactive Conversation Protocol）社区治理文档的编写需求。社区治理文档是面向协议贡献者、翻译者和社区成员的指导性文档集合，位于 `docs/{lang}/community/`。

文档集合涵盖：贡献指南（代码、文档、翻译的贡献流程）、行为准则（社区行为标准）、RFC 提案流程（协议变更的提案与评审机制）、翻译贡献指南（多语言翻译的具体规范）、以及项目治理结构（角色定义、决策流程、发布流程）。

## 术语表

- **Community_Docs**: 社区治理文档集合，位于 `docs/{lang}/community/` 的文档目录
- **Contributing_Guide**: 贡献指南文档，定义代码、文档和翻译的贡献流程与规范
- **Code_of_Conduct**: 行为准则文档，定义社区成员的行为标准和违规处理机制
- **RFC_Process**: RFC（Request for Comments）提案流程，协议变更和扩展的提案、评审与决策机制
- **Translation_Guide**: 翻译贡献指南文档，定义多语言翻译的流程、质量标准和术语一致性规范
- **Governance_Structure**: 项目治理结构文档，定义社区角色、决策流程和版本发布流程
- **Core_Maintainer**: 核心维护者，拥有代码合并权限和架构决策权的项目成员
- **Contributor**: 贡献者，通过 Pull Request 提交代码、文档或翻译的社区成员
- **Community_Member**: 社区成员，参与讨论、提交 Issue 或使用 ICP 的广泛群体
- **Supported_Language**: 支持语言，ICP 文档计划覆盖的 9 种语言（zh-CN、zh-TW、en、ja、ko、fr、de、es、ru）

## 需求


### 需求 1：贡献指南（CONTRIBUTING）

**用户故事：** 作为一个潜在贡献者，我希望社区文档提供清晰的贡献指南，以便我能了解如何为 ICP 项目贡献代码、文档和翻译。

#### 验收标准

1. THE Contributing_Guide SHALL define the contribution workflow including: forking the repository, creating a feature branch, submitting a Pull Request, and passing review
2. THE Contributing_Guide SHALL specify code contribution standards including: commit message format, code style requirements, and required test coverage
3. THE Contributing_Guide SHALL specify documentation contribution standards including: Markdown formatting rules, heading hierarchy conventions, and example requirements for abstract concepts
4. THE Contributing_Guide SHALL describe the Pull Request review process including: required number of approvals, review turnaround expectations, and merge criteria
5. IF a Pull Request does not meet the contribution standards, THEN THE Contributing_Guide SHALL specify that reviewers provide actionable feedback describing the required changes

### 需求 2：行为准则（CODE_OF_CONDUCT）

**用户故事：** 作为一个社区成员，我希望社区文档定义明确的行为准则，以便我能了解社区的行为标准和违规后果。

#### 验收标准

1. THE Code_of_Conduct SHALL define expected behaviors for all Community_Member participants including: respectful communication, constructive feedback, and inclusive language
2. THE Code_of_Conduct SHALL define prohibited behaviors including: harassment, discrimination, personal attacks, and publishing private information without consent
3. THE Code_of_Conduct SHALL define the violation reporting mechanism including: reporting channel, reporter confidentiality protection, and expected response timeline
4. THE Code_of_Conduct SHALL define the enforcement actions for violations including: warning, temporary suspension, and permanent ban, with escalation criteria for each level
5. THE Code_of_Conduct SHALL specify the scope of applicability covering all project spaces including: GitHub repositories, issue trackers, discussion forums, and community communication channels

### 需求 3：RFC 提案流程

**用户故事：** 作为一个协议贡献者，我希望社区文档定义 RFC 提案流程，以便我能了解如何提出协议变更或扩展提案并推动其通过评审。

#### 验收标准

1. THE RFC_Process SHALL define the complete lifecycle of an RFC proposal including the following stages: Draft, Review, Accepted, Implemented, and Rejected
2. THE RFC_Process SHALL specify the RFC document template including: title, author, status, summary, motivation, detailed design, alternatives considered, and backward compatibility analysis
3. THE RFC_Process SHALL define the review and decision criteria including: minimum review period, required Core_Maintainer approvals, and community feedback incorporation requirements
4. WHEN an RFC proposal affects backward compatibility, THE RFC_Process SHALL require the author to provide a migration plan and deprecation timeline
5. THE RFC_Process SHALL specify that all RFC documents are stored in a designated directory within the repository and assigned sequential RFC numbers

### 需求 4：翻译贡献指南

**用户故事：** 作为一个翻译贡献者，我希望社区文档提供翻译贡献的具体指引，以便我能按照统一的标准为 ICP 文档提供高质量的多语言翻译。

#### 验收标准

1. THE Translation_Guide SHALL list all nine Supported_Language versions (zh-CN, zh-TW, en, ja, ko, fr, de, es, ru) and specify the directory structure `docs/{lang}/` for each language
2. THE Translation_Guide SHALL define the translation workflow including: claiming a translation task, translating content, submitting for review, and incorporating reviewer feedback
3. THE Translation_Guide SHALL specify terminology consistency requirements: core technical terms (ICP, iFay, coFay, Conception_Annotation) retain their original form, and each language maintains a localized glossary for non-technical terms
4. THE Translation_Guide SHALL specify that zh-CN is the source language for all translations, and translators work from the zh-CN version as the authoritative reference
5. WHEN the zh-CN source document is updated, THE Translation_Guide SHALL specify the process for synchronizing translations including: notification mechanism, update priority, and staleness tracking

### 需求 5：项目治理结构

**用户故事：** 作为一个社区参与者，我希望社区文档定义清晰的项目治理结构，以便我能了解项目的角色体系、决策流程和版本发布机制。

#### 验收标准

1. THE Governance_Structure SHALL define three community roles with explicit responsibilities: Core_Maintainer (code merge authority, architecture decisions, release management), Contributor (code/doc/translation submissions via Pull Request), and Community_Member (issue reporting, discussion participation, feature requests)
2. THE Governance_Structure SHALL define the decision-making process including: consensus-seeking discussion, Core_Maintainer voting for unresolved disputes, and transparent documentation of all decisions
3. THE Governance_Structure SHALL define the version release process including: release cadence, release candidate testing period, changelog requirements, and release approval criteria
4. THE Governance_Structure SHALL define the criteria and process for role transitions: from Community_Member to Contributor (first accepted Pull Request) and from Contributor to Core_Maintainer (sustained contributions and nomination by existing Core_Maintainer)
5. THE Governance_Structure SHALL specify that all governance decisions and role changes are publicly documented in the repository
