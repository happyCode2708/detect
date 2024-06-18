name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18.17'

      - name: Deploy to VPS
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          VPS_IP: ${{ secrets.VPS_IP }}
          VPS_USER: ${{ secrets.VPS_USER }}
          APP_DIR: /root/source/product_ocr/detect
          APP_DIR_MAIN: /root/source/product_ocr
          PORT: ${{ secrets.PORT }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
        run: |
          # Debugging: Print environment variables
          echo "VPS_USER: $VPS_USER"
          echo "VPS_IP: $VPS_IP"
          echo "APP_DIR: $APP_DIR"

          # Check if the SSH_PRIVATE_KEY variable is not empty
          if [ -z "$SSH_PRIVATE_KEY" ]; then
            echo "SSH_PRIVATE_KEY is not set"
            exit 1
          fi

          # Save the SSH private key to a file
          echo "$SSH_PRIVATE_KEY" > private_key
          chmod 600 private_key

          # Run rsync to copy files
          rsync -avz -e "ssh -i private_key -o StrictHostKeyChecking=no" ./ $VPS_USER@$VPS_IP:$APP_DIR

          # set up env
          ssh -i private_key -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP <<EOF
            # git config --global --add safe.directory $APP_DIR_MAIN
            cd $APP_DIR_MAIN 
            rm -rf detect && git clone https://github.com/happyCode2708/detect.git && cd detect && echo "GOOGLE_CREDENTIALS=$GOOGLE_CREDENTIALS" > .env
          EOF
