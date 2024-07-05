# Jenkins Pipeline for Node.js Project

This repository contains a Jenkins pipeline script (`Jenkinsfile`) that automates the build, test, analysis, and reporting processes for a Node.js project. The pipeline integrates with SonarQube for code analysis, performs security scans, evaluates cyclomatic complexity, and sends email notifications based on build status.

## Pipeline Overview

The Jenkins pipeline consists of several stages to ensure the quality and security of the Node.js project. Below is an overview of each stage and its purpose:

### Stages

1. **Checkout**
   - **Purpose**: Fetches the latest code from the Git repository.
   - **Steps**: Uses Git to checkout the `master` branch from `https://github.com/somesh202/LiveCode.git`.

2. **Install Dependencies**
   - **Purpose**: Installs Node.js dependencies required for the project.
   - **Steps**: Executes `npm install` to fetch and install Node.js dependencies defined in `package.json`.

3. **Run Tests and Code Coverage**
   - **Purpose**: Executes unit tests and generates code coverage reports.
   - **Steps**:
     - Runs tests using `npm test`.
     - Publishes HTML-based code coverage reports located in `coverage/lcov-report/index.html`.

4. **SonarQube Analysis**
   - **Purpose**: Performs static code analysis using SonarQube.
   - **Steps**:
     - Configures SonarQube environment with credentials and URL (`http://54.166.191.92:9000`).
     - Executes SonarQube scanner (`sonar-scanner`) to analyze the project (`-Dsonar.projectKey=jenkins -Dsonar.sources=.`).

5. **Quality Gate**
   - **Purpose**: Waits for SonarQube's quality gate to assess the overall code quality.
   - **Steps**: Configured to halt the pipeline if the quality gate criteria are not met.

6. **Security Scan**
   - **Purpose**: Identifies security vulnerabilities in project dependencies.
   - **Steps**:
     - Uses `dependency-check` to scan for vulnerabilities (`--format HTML --out dependency-check-report.html`).
     - Checks for critical vulnerabilities in the generated HTML report and fails the build if found.

7. **Cyclomatic Complexity Analysis**
   - **Purpose**: Analyzes code complexity metrics using `lizard`.
   - **Steps**:
     - Generates a complexity report (`complexity-report.txt`) using `lizard .`.
     - Archives `complexity-report.txt` as a build artifact for future reference.

### Post-build Actions

- **Success Notification**: Sends an email notification on successful pipeline execution to `someshranjan252008@gmail.com`.
- **Failure Notification**: Sends an email notification if the pipeline fails, detailing the cause and encouraging investigation.

## Configuration Requirements

Ensure the following configurations are in place for the Jenkins pipeline to function correctly:

- **Jenkins Plugins**: Install and configure plugins such as `NodeJS`, `SonarQube Scanner`, and `Email Extension` in Jenkins.
- **Credentials**: Set up a Jenkins credential named `sonarqube-token` for authenticating with SonarQube.
- **Network Connectivity**: Ensure Jenkins server has outbound access to SonarQube server (`http://54.166.191.92:9000`) and necessary package repositories for Node.js dependencies.

## Troubleshooting Tips

If encountering issues during pipeline execution, consider the following troubleshooting steps:

- **SonarQube Analysis Issues**: Verify correct configuration of `SONARQUBE_URL` and `SONARQUBE_LOGIN` credentials.
- **Dependency Check Failures**: Ensure `dependency-check` tool is installed and permissions are set correctly.
- **Node.js Dependency Installation**: Check for network connectivity issues impacting `npm install`.
- **Email Notifications**: Validate SMTP server settings in Jenkins configuration for email delivery.
- **General Pipeline Failures**: Review Jenkins console output and logs for detailed error messages. Ensure all required tools and dependencies are accessible to Jenkins.
