pipeline {
  agent any

  environment {
    REGISTRY = "10.1.223.21:5000"
    IMAGE_NAME = "react-app"
    IMAGE_TAG = "${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}-${new Date().getTime()}"
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
        sh "cat nginx.conf"  // 실제로 빌드 전에 확인!
        sh "sudo nerdctl build --no-cache -t ${IMAGE_TAG} ."
      }
    }

    stage('Push to Registry') {
      steps {
        sh """
          sudo ctr image push --plain-http ${IMAGE_TAG}
        """
      }
    }

    stage('Deploy to K8s') {
      steps {
        script {
          def result = sh(script: "kubectl get deployment react-app -n ${K8S_NAMESPACE}", returnStatus: true)
          if (result != 0) {
            sh """
              sed 's|__IMAGE_TAG__|${IMAGE_TAG}|g' k8s/react-deployment.yaml.template > k8s/react-deployment.yaml
            """
          } else {
            sh "kubectl set image deployment/react-app react-app=${IMAGE_TAG} -n ${K8S_NAMESPACE}"
          }
            sh """
                kubectl delete svc react-service --ignore-not-found
                kubectl apply -f k8s/react-deployment.yaml
                kubectl apply -f k8s/react-service.yaml
            """
        }
      }
    }
  }
}
