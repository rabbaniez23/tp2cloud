pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'nrrbni' // Username Docker Hub
        IMAGE_BACKEND = "${DOCKER_HUB_USER}/backend-musik"
        IMAGE_FRONTEND = "${DOCKER_HUB_USER}/frontend-musik"
    }

    stages {
        stage('Checkout') {
            steps {
                // Menarik kode dari GitHub publik
                git branch: 'main', url: 'https://github.com/rabbaniez23/tp2cloud.git'
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    // Login ke Docker Hub menggunakan perintah 'bat' (karena Jenkins di Windows)
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        bat "docker login -u %USER% -p %PASS%"
                    }

                    // Build & Push Backend
                    bat "docker build -t ${IMAGE_BACKEND}:latest ./backend"
                    bat "docker push ${IMAGE_BACKEND}:latest"

                    // Build & Push Frontend
                    bat "docker build -t ${IMAGE_FRONTEND}:latest ./frontend"
                    bat "docker push ${IMAGE_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy ke AKS (Menggunakan 'bat')
                    withCredentials([file(credentialsId: 'kubeconfig-aks', variable: 'KUBECONFIG')]) {
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" apply -f k8s/backend.yaml"
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" apply -f k8s/frontend.yaml"
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" apply -f k8s/ingress.yaml"
                        
                        // Menampilkan info ingress di log Jenkins
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" get ingress musik-ingress"
                        
                        // Force update agar image terbaru ditarik ke AKS (rolling restart)
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" rollout restart deployment backend-musik"
                        bat "kubectl --kubeconfig=\"${KUBECONFIG}\" rollout restart deployment frontend-musik"
                    }
                }
            }
        }
    }
}
