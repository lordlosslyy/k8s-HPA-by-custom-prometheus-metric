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

`helm install ps prometheus-community/kube-prometheus-stack -n monitoring --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false`

> `--set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false` let the prometheus detects every namespace

(Uninstall: `helm uninstall ps -n monitoring` )

(Rollback: `helm rollback ps [version number] -n monitoring`)

Use following command to set  **serviceMonitorSelectorNilUsesHelmValues** to false if prometheus already install

`helm upgrade ps prometheus-community/kube-prometheus-stack -n monitoring --reuse-values --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false`

After install, you could see use `kubectl get service -n monitoring` to see the service in monitoring namespace 

## Install Prometheus adaptor: 

**Get Repo**

`helm repo add prometheus-community [https://prometheus-community.github.io/helm-charts](https://prometheus-community.github.io/helm-charts)`

`helm repo update`

**Install Chart**

Get prometheus version 2.15

- Helm 3, get prometheus version 2.15

`helm install [RELEASE_NAME] prometheus-community/prometheus-adapter -n [namespace]`  

- upgrade:

`helm upgrade [RELEASE_NAME] prometheus-community/prometheus-adapter -n [namespace]`

- with the custom metrics config setting in testps namespace

`helm install [RELEASE_NAME] -f helm/prometheus_adaptor_values.yaml prometheus-community/prometheus-adapter  -n [namespace]`
 
**After install or upgrade**

use `kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1" | jq .` to see if it works (see the name of the metrics)

## Create simple API and put it to the docker hub
Code and dockerfile in the Simple-Node-API
or use the docker file in /hibrush/prometheus-node

## Create deployment, service, serviceMonitor, HorizontalPodAutoscaler in Kubernetes within namespace 

**Create namespace testps**
`kubectl create namespace testps`


**Create deployment**
`kubectl apply -f psnode_deploy.yaml -n testps` 


**Create service**
`kubectl apply -f psnode_service.yaml -n testps`


**Create serviceMonitor**
`kubectl apply -f psnode_serviceMonitor.yaml -n testps`

**Create HorizontalPodAutoscaler** 
`kubectl apply -f hpanodejs.yaml -n testps`

(You could use `kubectl get hpa -n [namespace]` to see the hpa resource,
or 
`kubectl decsribe hpa -n [namespace]`  to see the details)

## Reference: 

[https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack](prometheus-helm-chart)

[https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/getting-started.md#include-servicemonitors](include-servicemonitors)

[https://github.com/siimon/prom-client](https://github.com/siimon/prom-client)

[https://artifacthub.io/packages/helm/prometheus-community/prometheus-adapter](prometheus-adapter)

