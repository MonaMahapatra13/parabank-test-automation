#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up ParaBank Test Automation Framework...${NC}"

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

# Install Playwright browsers
echo -e "\n${GREEN}Installing Playwright browsers...${NC}"
npx playwright install

# Initialize environment variables
if [ ! -f .env ]; then
  echo -e "\n${GREEN}Creating .env file from template...${NC}"
  cp .env.example .env
  echo -e "${YELLOW}Please update .env with your credentials${NC}"
fi

# Initialize Git hooks
echo -e "\n${GREEN}Setting up Git hooks...${NC}"
npm run prepare

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update .env with your credentials"
echo "2. Run 'npm run test:all' to verify the setup"
echo "3. Run 'npm run report' to view test results"
