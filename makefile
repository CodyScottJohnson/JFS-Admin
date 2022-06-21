run:
	grunt serve -env=prod
serve:
	npm run serve
deploy-prod:
	grunt build -env=prod
	grunt ssh_deploy:production