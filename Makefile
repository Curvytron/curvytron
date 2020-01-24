.SILENT:
.PHONY: help

## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

###############
# Environment #
###############

## Setup environment & Install & Build application
setup:
	vagrant up --no-provision
	vagrant provision
	vagrant ssh -- "cd /srv/app && make install build"

## Update environment
update: export ANSIBLE_TAGS = manala.update
update:
	vagrant provision

## Update ansible
update-ansible: export ANSIBLE_TAGS = manala.update
update-ansible:
	vagrant provision --provision-with ansible

## Provision environment
provision: export ANSIBLE_EXTRA_VARS = {"manala":{"update":false}}
provision:
	vagrant provision

## Provision nginx
provision-nginx: export ANSIBLE_TAGS = manala_nginx
provision-nginx: provision

## Provision supervisor
provision-supervisor: export ANSIBLE_TAGS = manala_supervisor
provision-supervisor: provision

###########
# Install #
###########

## Install application
install:
	npm install #--no-spin
	bower install

install@production: NODE_ENV = production
install@production:
	npm install --no-spin --dev --production

#########
# Build #
#########

## Build application
build:
	gulp

build@production:
	gulp

#########
# Watch #
#########

## Watch application
watch:
	gulp watch

#######
# Run #
#######

## Run application
run:
	node bin/curvytron.js

#########
# Debug #
#########

## Debug application
debug:
	node-debug -p=8000 --web-host="0.0.0.0" bin/server.js

##########
# Custom #
##########

# Restart server
restart:
	sudo supervisorctl restart server

##########
# Deploy #
##########

## Deploy application
deploy@production:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_production
