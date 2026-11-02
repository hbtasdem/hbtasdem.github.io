---
title: BoilerFace
summary: A tool that vets open-source ML models for company use, grown into a model registry with an accessible web interface.
area: swe-ai
kind: Course project · team of 4
role: Quality metrics and accessible web UI
team: 4 · ECE 30861 Software Engineering
timeline: Fall 2025
stack: [Python, FastAPI, Hugging Face API, GitHub REST API, pytest, Selenium, axe-core, GitHub Actions]
highlights:
  - { value: '8', label: 'metrics scored in parallel' }
  - { value: '82%', label: 'test coverage (76 tests)' }
  - { value: 'WCAG 2.1 AA', label: 'web interface' }
links:
  - { label: 'Phase 1 code on GitHub', href: 'https://github.com/hbtasdem/ECE30861_Team4' }
  - { label: 'Phase 2 code on GitHub', href: 'https://github.com/hbtasdem/ECE30861_Team4_P2' }
order: 4
---

## Problem

Our course “customer” wanted engineers to reuse open-source models from Hugging Face, but someone had to check each one by hand first: is the license compatible, are the maintainers still active, is the code any good? We built a tool to do that vetting automatically.

## Phase 1: scoring models

A command-line tool that scores a model on 8 metrics in parallel threads and combines them into a weighted net score. Two of the metrics, written by teammates, use an LLM to read unstructured READMEs.

I built two of the metrics:

- **Dataset quality**, from completeness, correctness, coverage and how current the data is.
- **Code quality**, from documentation (reusability), community downloads (reliability) and testing information (testability).

The team’s suite had 76 pytest tests at 82% coverage.

## Phase 2: a model registry

In the second phase, the course had each team build on another team’s Phase 1 tool. We grew it into a FastAPI registry where people can share, find and evaluate models and datasets. My part:

- **Reproducibility metric:** whether a model runs from the demo code in its model card alone, scored 0, 0.5 (runs after debugging) or 1.
- **Tree-score metric:** the average score of a model’s parent models in its lineage.
- **The web interface, built to WCAG 2.1 AA:** semantic landmarks, a skip link, visible focus, labeled inputs and live regions that announce results. I also replaced the original brand color with a darker one that passes contrast.
- **Automated accessibility tests:** about 30 Selenium tests, including axe-core scans and keyboard-navigation checks, that fail when they find a violation.
