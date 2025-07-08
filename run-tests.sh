#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Installing dependencies..."
npm ci

echo "Running tests..."
npm test

echo "Tests finished."
