---
title: Behavioral Questions
published: false
layout: page
---

## My Star Results

1. Tell me about a time you worked on a critical project.
    * S: Our monolithic build system took too long to execute, slowing deployments.
    * T: I needed to help migrate parts of it to Bazel to speed up builds and support multiple platforms.
    * A: I led a two person team in converting portions of the desktop build to Bazel, managed all aspects of the project, and implemented improvements to the in-house CMake buildfile generation tool.
    * R: Build times dropped significantly, improving developer productivity and accelerating release cycles.

2. Describe a time you resolved a conflict on your team.
    * S: Two engineers disagreed on whether to persist Gradle in GitHub or start with Bazel and convert prior to transitioning to GitHub.
    * T: I was asked to present technical insights and create documentation to help them make an informed decision.
    * A: I analyzed build logs, visualized industry adoption numbers for both systems, and documented trade-offs for each in a short proof-of-concept.
    * R: The data helped the team agree on a phased adoption approach, where key projects were converted to Bazel and then transitioned to GitHub, reducing tension and moving the project forward smoothly.

3. Tell me about dealing with ambiguity.
    * S: Our microservice projects lacked clear guidelines on dependency management across multiple releases, causing month long release cycles.
    * T: I had to determine a workable approach for reducing release engineering's long cycle times and manage cross-project dependencies.
    * A: I tested dependency resolution strategies in a controlled environment, documented my findings, and provided a proof-of-concept of a scatter gather architecture pattern to create release branches for each maintained release's dependencies  with Artifactory and Gradle.
    * R: My recommendations clarified how to maintain consistent dependencies, helping the team proceed confidently.

4. Describe a failure and what you learned.
    * S: An attempt at centralizing database migrations led to reverting my work.
    * T: I needed to fix the issue quickly and prevent build instability.
    * A: I rolled back the change, reviewed logs, and ran more targeted tests to identify missing migrations causing the failure.
    * R: After reverting the changes and verifying there weren't any regressions, the build stabilized. I learned to validate and clarify architectural assumptions earlier.

5. Give an example of influencing a decision without direct authority.
    * S: The web runtime team considered a custom build system that didn’t integrate well with our CI/CD pipelines.
    * T: I wanted them to consider reusing our stable, Gradle alternative.
    * A: I showed them a working prototype using the existing build system, highlighting easier setup and maintenance.
    * R: They adopted the Gradle approach, improving compatibility and saving them massive configuration changes.

6. Tell me about delivering under a tight deadline.
    * S: Apple changed the API contract for notarizion of macOS builds within a short window.
    * T: I had to implement and test an update to the existing tool swiftly.
    * A: I updated our notarization tool, validated it across macOS versions, and ran automated tests in TeamCity to ensure correctness.
    * R: The update went out on time, meeting compliance requirements, and avoiding release delays.

7. Describe a time you raised the bar on standards.
    * S: Our builds were slow and lacked consistency across platforms.
    * T: I aimed to improve reliability and speed using Bazel and better CI practices.
    * A: I helped configure Bazel caching, updated test suites to run in parallel, and added Kotlin build configuration changes streamlining branching, distribution, and notifications.
    * R: Builds became faster and more predictable, establishing higher standards for future development work.

8. Tell me about pushing back on a requirement.
    * S: A last-minute feature request for bootstrapping bash scripts threatened to derail a stable release.
    * T: I needed to communicate the technical risks clearly.
    * A: I showed data on maintenance costs to support the feature, integration tests, and the complexity of adjusting Bazel build modules, suggesting it be postponed.
    * R: The feature was delayed, ensuring a stable, on-time release without undue risk.

9. Share a situation where you built consensus across teams.
    * S: Multiple teams needed to ramp up on Bazel.
    * T: I needed to help facilitate ensemble programming.
    * A: I compared workflows, demonstrated a unified approach to learning Bazel by mobbing on work items and rotating control of writing code, and documented an ensemble programming working agreement.
    * R: All teams agreed on a shared method, speeding up integration and enabling monorepo release.

10. Tell me about a significant technical challenge you overcame.
    * S: Our large codebase’s complex dependencies slowed down builds and testing.
    * T: I was responsible for optimizing and modularizing certain components to enable faster builds.
    * A: I created Bazel-compatible build files, split monolithic sections into manageable modules, and introduced test timeout functionality for existing integration tests..
    * R: This modular approach reduced build times and made the codebase more maintainable, reliable, and supported quicker, safer deployments.
