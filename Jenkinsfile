pipeline {
    agent any

    environment {
        SONARQUBE_URL = 'http://35.174.156.89:9000'
        SONARQUBE_LOGIN = credentials('sonarqube-token')
        SCANNER_HOME = '/opt/sonar-scanner'
    }

    tools {
        nodejs 'NodeJS'
        git 'Default'
        jdk 'OracleJDK17'
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
                        -Dsonar.sources=src \
                        -Dsonar.tests=src \
                        -Dsonar.test.inclusions="**/*.test.js,**/*.spec.js" \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                        -Dsonar.host.url=${SONARQUBE_URL} \
                        -Dsonar.login=${SONARQUBE_LOGIN}
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
               script {
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                    }
                }
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
        always {
            junit '**/test-results.xml'
            cleanWs()
        }
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