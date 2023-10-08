
#!/bin/bash

kubectl apply -f ./deployments/cronjob.yaml
kubectl get cronjob