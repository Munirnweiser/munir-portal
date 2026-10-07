pipeline {
    agent any

    stages {
        stage('Validate') {
            steps {
                sh 'test -f frontend/index.html && echo "index.html OK"'
                sh 'echo "HTML pages:" && ls frontend/*.html | wc -l'
            }
        }

        stage('Package') {
            steps {
                sh 'tar -czf site.tar.gz frontend/'
                archiveArtifacts artifacts: 'site.tar.gz', fingerprint: true
            }
        }
    }
}

