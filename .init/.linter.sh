#!/bin/bash
cd /home/kavia/workspace/code-generation/typing-speed-challenge-316105-316114/typing_challenge_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

