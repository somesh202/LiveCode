pipeline {
    agent any

    environment {
        SONARQUBE_URL = 'http://54.166.191.92:9000'
        SONARQUBE_LOGIN = credentials('sonarqube-token')
    }

    tools {
        nodejs 'NodeJS'
        git 'Default'
        jdk 'OracleJDK8'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/somesh202/LiveCode.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests and Code Coverage') {
            steps {
                sh 'npm test'
                publishHTML(target: [
                    reportDir: 'coverage/lcov-report',
                    reportFiles: 'index.html',
                    reportName: 'Code Coverage Report'
                ])
            }
        }


        stage('SonarQube Analysis') {
             environment {
                SCANNER_HOME = tool 'SonarQube'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=jenkins \
                        -Dsonar.sources=.
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Security Scan') {
            steps {
                sh 'dependency-check --project Jenkins --scan ./ --format HTML --out dependency-check-report.html'
                script {
                    def report = readFile 'dependency-check-report.html'
                    if (report.contains('CRITICAL')) {
                        error('Critical vulnerabilities found')
                    }
                }
            }
        }

        stage('Cyclomatic Complexity Analysis') {
            steps {
                sh 'lizard . > complexity-report.txt'
                archiveArtifacts artifacts: 'complexity-report.txt', allowEmptyArchive: true
                echo 'Cyclomatic Complexity analysis complete. Check the complexity-report.txt for details.'
            }
        }

    }

    post {
        success {
            emailext subject: "Jenkins Build Success: ${currentBuild.fullDisplayName}",
                    body: "Build successful! Check Jenkins for details.",
                    to: 'someshranjan252008@gmail.com'
        }
        failure {
            emailext subject: "Jenkins Build Failure: ${currentBuild.fullDisplayName}",
                    body: "Build failed! Check Jenkins for details.",
                    to: 'someshranjan252008@gmail.com'
        }
    }
}