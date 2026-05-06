pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'nrrbni' // Username Docker Hub dari screenshot
        IMAGE_BACKEND = "${DOCKER_HUB_USER}/backend-musik"
        IMAGE_FRONTEND = "${DOCKER_HUB_USER}/frontend-musik"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout dilakukan otomatis oleh Jenkins jika menggunakan Pipeline dari SCM
                echo 'Checking out code...'
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    // Login ke Docker Hub (Pastikan sudah ada credentials di Jenkins dengan ID 'dockerhub-login')
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                    }

                    // Build & Push Backend
                    sh "docker build -t ${IMAGE_BACKEND}:latest ./backend"
                    sh "docker push ${IMAGE_BACKEND}:latest"

                    // Build & Push Frontend
                    sh "docker build -t ${IMAGE_FRONTEND}:latest ./frontend"
                    sh "docker push ${IMAGE_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy ke AKS (Pastikan sudah ada credentials file Kubeconfig di Jenkins dengan ID 'kubeconfig-aks')
                    withCredentials([file(credentialsId: 'kubeconfig-aks', variable: 'KUBECONFIG')]) {
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/backend.yaml"
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/frontend.yaml"
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/ingress.yaml"
                        
                        // Menampilkan info ingress
                        sh "kubectl --kubeconfig=${KUBECONFIG} get ingress musik-ingress"
                        
                        // Force update agar image terbaru ditarik (rolling restart)
                        sh "kubectl --kubeconfig=${KUBECONFIG} rollout restart deployment backend-musik"
                        sh "kubectl --kubeconfig=${KUBECONFIG} rollout restart deployment frontend-musik"
                    }
                }
            }
        }
    }
}
