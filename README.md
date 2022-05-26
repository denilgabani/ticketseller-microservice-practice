# ticketseller-microservice-practice
A project to deep dive into microservices using nodejs with docker and kubernetes
Important topics, Technologies and Tools Used:
1. Nodejs
2. Typescript
3. Reactjs
4. Stripe
5. Docker
6. Kubernetes
7. NATS-Streaming as Event Bus
8. Ingress Nginx
9. Skaffold
10. Build CI/CD pipeline with testcase linked to Github

### Step by Step process to setup the project

 1. git clone: https://github.com/denilgabani/ticketseller-microservice-practice.git
 2. Install Docker: https://docs.docker.com/get-docker/
 3. Install/Enable Kubernetes: 
	 -> Enable Kubernetes directly from docker desktop app:   
	      https://docs.docker.com/desktop/kubernetes/ 
	      OR
	 -> Download and Install
		  Kuberenetes https://kubernetes.io/releases/download/ 
4. Install Skaffold: https://skaffold.dev/docs/install/
5. Install Ingress nginx: run the below command
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml
6. Create stripe developer account and take stripe key: https://stripe.com/docs/development
7. Run command: kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY= \< Enter your Stripe private key\>
8. Run command: kubectl create secret generic jwt-secret --from-literal=JWT_KEY=\<Give any random key\>  
9. You can change localhost to custom domain name here ticketseller.dev:
	https://www.technig.com/change-localhost-to-domain-name/
10. Go to the project directory and run the command: skaffold dev 

* Skaffold will build and run the container and deployment service from infra dircories as mentioned in skaffold.yaml file.
* These deployment services run the pod for each services and also for event bus too.
* After running all the pods successfully you can visit to http://ticketseller.dev to get the live demo.
