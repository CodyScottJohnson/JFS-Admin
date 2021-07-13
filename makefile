run:
	grunt serve -env=prod
deploy-prod:
	grunt build -env=prod
	grunt ssh_deploy:production