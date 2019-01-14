# Apache Solr instance

[![Build Status](https://travis-ci.org/Services-Sandbox/solr.svg?branch=master)](https://travis-ci.org/Services-Sandbox/solr)


For more information about this project-repository, the [documentation can be found here](https://apache-solr-search.readthedocs.io/en/latest/) as the readme file will contain summaries of each portion of the project. For official documentation of the libraries used in this project, please consult the table as follows:

| Technology | Description |
|------------|-------------|
| [Apache Solr](http://lucene.apache.org/solr/guide/--) | This is the main engine that will index the contents and store in the elgg-core directory within the data folder. Solr must have access to this core in order to store index and log warnings and errors. The configuration file is located within the solr-configuration-files directory.|
| [Docker Community Edition](https://docs.docker.com/install/linux/docker-ce/ubuntu/#prerequisites) |    This instance has been configured to run inside a Docker container that contains all the dependencies and libraries that are used. The Dockerfile can be found in docker-configuration-files. |
| [Kubernetes](https://kubernetes.io/docs/home/?path=users&persona=app-developer&level=foundational) |  Still in process to be worked on, but there are configuration files for Kubernetes deployment developed, it can be found in the kubernetes-configuration-files directory. |


###### Sections

* [Setting up this project using Docker containers](https://github.com/Services-Sandbox/solr#using-docker)
* [Setting up this project using Kubernetes](https://github.com/Services-Sandbox/solr#using-kubernetes)
* [Setting up this project manually](https://github.com/Services-Sandbox/solr#optional-manual-installation-without-docker-or-kubernetes)

## Specifications and Dependencies

### Virtual Machine specifications that developed the package:
* Ubuntu Server 16 LTS
  * 2GB RAM
  * 100GB ROM
  * Virtually bridged network (to download install dependencies)
* VMware Workstation Player

### Libraries used:
* Apache Suite
  * Solr 	- the search engine
  * Tika 	- file extraction for .pdf, .docx, etc
  * Maven	- package management required to update Tika
  * Groovy	- used to retrieve and push data into solr for indexing
* Open JDK
* Docker CE
* Kubernetes
* ReactJS

## Getting Started -- Installation

### Directories Explained

| directory | description |
|-----------|-------------|
| docker-configuration-files | contains the Dockerfile needed to create and run the container for Solr |
| docs | contains the documentation for the entire project, it is currently hosted and can be viewed [here](https://apache-solr-search.readthedocs.io/en/latest/) |
| elgg-plugin | contains the plugin that can be installed on an elgg instance, it basically generates REST API that retrieves all the contents and displays it in json format |
| kubernetes-configuration-files | contains all the files required to run the project in a pod |
| search-portal-app | contains the reactjs project that formats the search results thats retrieved from solr |
| solr-configuration-files | contains the groovy scripts that will be run for indexing and the core that will be used to organize the index |

### (Optional) Manual Installation, without Docker or Kubernetes

The following needs to be installed:
- elgg

   You just need an instance of Elgg so that we have something we can crawl. The plugin for this to work is in the ```elgg-plugin``` directory which also require ```web services``` to be enabled on elgg. This basically generates REST API for the indexing portion of this project. Will require LAMP (Apache, MySQL, PHP) stack to be installed for this application. Please read up on the documentation for [elgg installation](http://learn.elgg.org/en/2.0/intro/install.html).

- reactjs

   A ReactJS project is also included in this repository in the ```search-portal-app```, so we can test the resultset that gets retrieved from Apache Solr. Please consult the **[Minimum Viable Product - Search Portal](https://github.com/Services-Sandbox/solr#optional-minimum-viable-product---search-portal)** section on installation and running the app.

- apache solr

   The meat of the repository, it just contains the configuration files. You may need to create the index folder and give the user read and write access to the entire configuration directory since the engine will be creating and modifying log files and indexes. 

   ```
   # in your home directory, download the solr package from their official site and unzip
   $ wget http://httpd-mirror.sergal.org/apache/lucene/solr/7.3.0/solr-7.3.0.tgz --no-proxy -q
   $ tar -xf solr-7.3.0.tgz 
   $ mv solr-7.3.0 solr && mv solr /opt/

   # move the configuration file (that is included in this repository) to the solr engine
   $ mv elgg-core /opt/solr/server/solr/

   # on an instance of linux, the solr app files are all located within /opt/solr/
   $ cd /opt/solr/bin

   # start the solr app using the solr user (this is recommended), unless you run root, then you will be required to add the flag -force
   $ sudo -u solr solr start
   $ sudo ./solr start -force

   Waiting up to 180 seconds to see Solr running on port 8983 [-]
   Started Solr server on port 8983 (pid=22624). Happy searching!
   ```

- apache groovy

   This is a scripting mechanism that you can run on a daily basis using crontab (linux) or scheduleder (windows), this can be found in the directory called ```solr-configuration-files```.

   ```
   # installation
   $ curl -s get.sdkman.io | bash
   $ source "$HOME/.sdkman/bin/sdkman-init.sh"
   $ sdk install groovy

   # running groovy scripts
   $ groovy script-name-here.groovy
   ```


### (Optional) Minimum Viable Product - Search Portal

This is optional, if you like to design how the results should be displayed you can use this small NodeJS site application that request and retrieves to display the result set onto the page. Since it is developed in NodeJS, it is fully dynamic. 

To get started with the ReachJS application, you need to be in the search-portal directory.

```
# install package management
$ apt install npm

# install nodejs
$ curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ apt-get install nodejs
$ npm -v

# compile the code
$ npm install -g create-react-app
$ create-react-app search-portal
$ cd search-portal/

# start the application
$ npm start

# to import libraries, they must be in the npm repository
$ npm install --save react-fontawesome
```

## Running Groovy Scripts as your indexer

```
# running groovy scripts
$ groovy your-groovy-script.groovy

# configure the crontab to run the groovy script every so often
$ crontab -e
```

File: /tmp/crontab

```
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

* * * * * groovy your-groovy-script.groovy

```

## Using Docker

### Prerequisites
* docker
* docker-compose

The dockerfile is in the docker-configuration-files directory, run the following commands to build and run

```
# install docker ce**
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd-] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ apt-cache policy docker-ce
$ sudo apt-get install -y docker-ce
$ sudo systemctl status docker

# run docker container
$ docker build -t search-portal
$ docker run --name solr-service -d -P solr-service

# display status of the container(s)
$ docker ps

# login to the container
$ docker exec -it solr-service bash

# after logging into the docker container, modify the cronjob file then start service
# for the groovy scripts, the parameters are in this order : groovy indexing-script.groovy site-addr solr-addr api-key
$ nano /etc/cron/cron.d/groovy-cron
$ service cron start
 * Starting periodic command scheduler cron                                                                                                                                         [ OK ]

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                     NAMES
6e21d435f3be        solr-service        "/opt/solr/bin/solr …"   8 seconds ago       Up 6 seconds        0.0.0.0:32768->8983/tcp   solr-service

# remove existing docker instances
$ docker kill 6e21d435f3be
$ docker rm solr-service
```

## Using Kubernetes

### Prerequisites
* docker
* docker-compose
* kubectl
* kubeadm

```
# install kubernetes
$ sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add
$ nano /etc/apt/sources.list.d/kubernetes.list
# then add the following to the file: deb http://apt.kubernetes.io/ kubernetes-xenial main

$ apt-get update
$ apt-get install -y kubelet kubeadm kubectl kubernetes-cni

# starting up kubernetes
# disable swap
$ swapoff -a
# we are using flannel as our virtual network
$ kubeadm init --pod-network-cidr=10.244.0.0/16

[init] Using Kubernetes version: v1.9.8
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks.
        [WARNING SystemVerification]: docker version is greater than the most recently validated version. Docker version: 17.12.1-ce. Max validated version: 17.03
        [WARNING FileExisting-crictl]: crictl not found in system path
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [ubuntu kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.65]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests".
[init] This might take a minute or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 210.005277 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node ubuntu as master by adding a label and a taint
[markmaster] Master ubuntu tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: 1c91b2.3f5d23cf8ce4e820
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token 3e0a6b.501f5895e6e1a9df 192.168.1.65:6443 --discovery-token-ca-cert-hash sha256:ae12de632770aa36c88cf33ae0f64a6400362a321d88a21e3612adc7a84e40b2


$ mkdir -p $HOME/.kube

# remove existing configuration, this may cause problem later on
$ rm /root/.kube/config

$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

$ sysctl net.bridge.bridge-nf-call-iptables=1

# check all the pods and untaint the node 
$ kubectl get pods --all-namespaces
$ kubectl taint nodes ubuntu node-role.kubernetes.io/master:NoSchedule-

# install flannel
$ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml

# install and deploy dashboard ui
$ kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml

# create user accounts
$ kubectl create clusterrolebinding cluster-syste --clusterrole=cluster-admin --user=system:serviceaccount
$ kubectl create clusterrolebinding cluster-system-anonymous --clusterrole=cluster-admin --user=system:anonymous
$ kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --user=system:serviceaccount:kube-system:kubernetes-dashboard

# create the deployment from the .yaml file
$ kubectl create -f solr-deployment.yaml
$ kubectl get deployments

NAME              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
solr-deployment   2         2         2            2           7m

$ kubectl get pods

NAME                              READY     STATUS    RESTARTS   AGE
solr-deployment-95dfb5d8f-hzdk5   1/1       Running   0          7m
solr-deployment-95dfb5d8f-p9vn5   1/1       Running   0          7m

# run kubernetes pod deployment (ports and hosts can be specified in parameters)
$ kubectl solr-service --image=pandurx/solr X
$ kubectl solr-service --image=pandurx/solr --port=80 --host=192.168.0.1

# expose the service then accessing it remotely
$ kubectl expose deployment solr-deployment --type=LoadBalancer --name=my-service

service "my-service" exposed

$ kubectl get services my-service

NAME         TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
my-service   LoadBalancer   10.107.208.248   <pending>     8983:32338/TCP   9s

Accessing the service in the browser by going to : http://192.168.1.65:32338/solr/#/

# get the pod name(s) and then ssh into the service
# it is required to modify the scripts so that it knows where to index and where to commit the index
$ kubectl get pods --all-namespaces
$ kubectl exec -it solr-deployment-95dfb5d8f-hzdk5 -- /bin/bash

# kill and delete deployment
$ kubectl kill portal-service-79b5ddd677-js7d7 X
$ kubectl delete deployment -l app=solr

# stop the kubernetes cluster
$ kubeadm reset
```


## Contribution

I encourage anyone who would like to use this repository, to also contribute back to this repository. Thanks!

