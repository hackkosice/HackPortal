if [[ "$*" == *"--build"* ]]; then
    docker rm --force hackportal-e2e
    docker build -f e2e.Dockerfile -t hackportal-e2e .
    docker run -d -p 3005:3001 -p 3004:3004 --name hackportal-e2e hackportal-e2e
else
    if [ "$( docker container inspect -f '{{.State.Status}}' hackportal-e2e )" = "running" ]; then
      echo "Container already running"
    else
      docker start hackportal-e2e
    fi

    echo "Preparing DB for e2e tests"
    docker exec -it hackportal-e2e npm run prisma:prepare-for-e2e
fi

if [[ "$*" == *"--copy-tests"* ]]; then
    docker cp ./e2e/. hackportal-e2e:/app/e2e
    docker cp ./playwright.config.ts hackportal-e2e:/app/
    docker exec -it --user root hackportal-e2e chown -R nextjs:nodejs /app/e2e
    docker exec -it --user root hackportal-e2e chown nextjs:nodejs /app/playwright.config.ts
fi

if [[ "$*" == *"--ui"* ]]; then
  echo "Actually listening on: http://localhost:3005"
  docker exec -it hackportal-e2e npx playwright test --ui-host=0.0.0.0 --ui-port=3001
else
  docker exec -it hackportal-e2e npm run test:e2e
  docker cp hackportal-e2e:/app/e2e/test-reports ./e2e/
  npx playwright show-report ./e2e/test-reports
fi

