pipeline {
    agent any

    environment {
        SONARQUBE_URL = 'http://54.166.191.92:9000'
        SONARQUBE_LOGIN = credentials('sonarqube-token')
    }

    stages {
        stage('Setup NodeJS') {
            steps {
                tool name: 'NodeJS', type: 'NodeJSInstallation'
                sh 'node --version'
                sh 'npm --version'
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/somesh202/LiveCode.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.projectKey=jenkins -Dsonar.sources=. -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.login=${SONARQUBE_LOGIN}'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
    }

    post {
        always {
            mail to: 'your-email@example.com',
                subject: "Jenkins Pipeline: ${currentBuild.fullDisplayName}",
                body: "Build result: ${currentBuild.result}"
        }
    }
}
