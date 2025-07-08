#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Default to github-to-gitlab if no argument is provided
DIRECTION=${1:-github-to-gitlab}

# Sync from GitHub to GitLab (for deployment)
if [ "$DIRECTION" == "github-to-gitlab" ]; then
  echo "Syncing from GitHub to GitLab..."
  
  echo "Pulling latest changes from github/main..."
  git pull github main
  
  echo "Pushing changes to gitlab/main (for deployment)..."
  # Using --force to ensure the GitLab repo mirrors the deployment state.
  git push origin main --force
  
  echo "Sync from GitHub to GitLab complete."

# Sync from GitLab to GitHub
elif [ "$DIRECTION" == "gitlab-to-github" ]; then
  echo "Syncing from GitLab to GitHub..."
  
  echo "Pulling latest changes from gitlab/main..."
  git pull origin main
  
  echo "Pushing changes to github/main..."
  git push github main
  
  echo "Sync from GitLab to GitHub complete."

else
  echo "Invalid argument. Usage: $0 [github-to-gitlab|gitlab-to-github]"
  exit 1
fi

echo "Synchronization finished."
