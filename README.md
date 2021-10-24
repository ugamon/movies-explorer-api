# Movies explorer backend

## Infrastructure

Infra is based on the docker-compose mechanism.

It has the services:

---> mongodb
---> app


## Installation 

Deployment proccess is based on Ansible software.
1. To perform installation you need to install Ansible
2. Run the playbook with 
```
ansible-playbook deploy-playbook.yml -i hosts 
```
Please make sure to have local .env file to copy.

Structure:
```
NODE_ENV=production
JWT_SECRET=
MONGODB_USER=root
MONGODB_PASSWORD=
MONGODB_DATABASE=moviesdb
MONGODB_LOCAL_PORT=7017
MONGODB_DOCKER_PORT=27017

NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080
```

## Links

backend - https://ugamonmovies.nomoredomains.monster/

