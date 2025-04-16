pipeline {
  agent any

  environment {
    REGISTRY = "10.1.223.21:5000"
    IMAGE_NAME = "react-app"
    IMAGE_TAG = "${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
    K8S_NAMESPACE = "default"
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'http://10.1.218.84/achiv/arc-react-app.git',
        credentialsId: 'gitlab-token'
      }
    }

    stage('Install & Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Build Image') {
      steps {
        sh """
          sudo nerdctl build -t ${IMAGE_TAG} .
        """
      }
    }

    stage('Push to Registry') {
      steps {
        sh """
          sudo nerdctl push ${IMAGE_TAG}
        """
      }
    }

    stage('Deploy to K8s') {
      steps {
        sh """
          kubectl set image deployment/react-app react-app=${IMAGE_TAG} -n ${K8S_NAMESPACE}
        """
      }
    }
  }
}
