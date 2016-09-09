#!/bin/bash
read -p "push or pull: " action
if [ "$action" = "push" ]; then
read -p "Commit description: " desc
git add . && \
git add -u && \
git commit -m "$desc" && \
git push origin dev_branch
elif [ "$action" = "pull" ]; then
git reset --hard origin/dev_branch
git pull origin dev_branch
else
echo invalid input
fi
