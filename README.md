# prometheus-node
A simple Prometheus node monitoring API

### Prerequisite: 

microk8s and kubectl

## Install Prometheus-operator (kube-prometheus-stack)

Prometheus-operator (Now rename to kube-prometheus-stack) installation 

**Install Helm** 

`sudo snap install helm --classic`

**Add Helm Repo and update it** 

`helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
`helm repo update`

Create **namespace** *monitoring* in kubernetes (not recommend to install in default namespace)

`kubectl create namespace monitoring`

Use `kubectl get namespace` , you can get all namespaces in this cluster 

**Install kube-promethus-stack**: 

`helm install ps prometheus-community/kube-prometheus-stack -n monitoring`
(ps is helm namespace, you can name anything you want)
or 

`helm install ps prometheus-community/kube-prometheus-stack -n monitoring --reuse-values --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false`

> `--set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false` let the prometheus detects every namespace

(Uninstall: `helm uninstall ps -n monitoring` )

(Rollback: `helm rollback ps [version number] -n monitoring`)

Use following command to set  **serviceMonitorSelectorNilUsesHelmValues** to false if prometheus already install

`helm upgrade ps prometheus-community/kube-prometheus-stack -n monitoring --reuse-values --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false`

After install, you could see use `kubectl get service -n monitoring` to see the service in monitoring namespace 



## Create simple API and put it to the docker hub
Code and dockerfile in the Simple-Node-API
or use the docker file in /hibrush/prometheus-node

## Create deployment, service, and serviceMonitor in namespace 

**Create namespace testps**
`kubectl create namespace testps`


**Create deployment**
`kubectl apply -f psnode_deploy.yaml -n testps` 


**Create service**
`kubectl apply -f psnode_service.yaml -n testps`


**Create serviceMonitor**
`kubectl apply -f psnode_serviceMonitor.yaml -n testps`

## Reference: 

[https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)

[https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/getting-started.md#include-servicemonitors](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/getting-started.md#include-servicemonitors)

[https://github.com/siimon/prom-client](https://github.com/siimon/prom-client)
