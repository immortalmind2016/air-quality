
#!/bin/bash

kubectl apply -f ./deployments/cronjobs/air-info-cronjob.yml
kubectl get cronjob