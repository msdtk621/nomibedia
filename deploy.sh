#!/bin/bash
set -e

SSH_KEY="C:/Users/msdtk/.ssh/xserver_hoiku"
SSH_HOST="xs227431@xs227431.xsrv.jp"
SSH_PORT=10022
REMOTE_DIR="/home/xs227431/nomibedia"
ARCHIVE="nomipedia-deploy.tar.gz"

echo "=== 1. ビルド ==="
npm run build

echo "=== 2. standalone に静的ファイル・設定をコピー ==="
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp ecosystem.config.js .next/standalone/ecosystem.config.js

echo "=== 3. アーカイブ作成（standalone の中身を直接固める）==="
tar -czf "$ARCHIVE" -C .next/standalone .

echo "=== 4. サーバーへアップロード ==="
scp -i "$SSH_KEY" -P "$SSH_PORT" "$ARCHIVE" "$SSH_HOST:~/$ARCHIVE"

echo "=== 5. サーバー上で展開 & PM2 再起動 ==="
ssh -i "$SSH_KEY" -p "$SSH_PORT" "$SSH_HOST" bash << 'ENDSSH'
  mkdir -p /home/xs227431/nomibedia
  rm -rf /home/xs227431/nomibedia/.next
  tar -xzf ~/nomipedia-deploy.tar.gz -C /home/xs227431/nomibedia
  rm ~/nomipedia-deploy.tar.gz
  cd /home/xs227431/nomibedia
  if pm2 list | grep -q "nomibedia"; then
    pm2 reload nomibedia
  else
    pm2 start ecosystem.config.js
  fi
  pm2 save
ENDSSH

echo "=== 6. ローカルのアーカイブを削除 ==="
rm -f "$ARCHIVE"

echo "=== デプロイ完了 ==="
echo "URL: https://xs227431.xsrv.jp/nomibedia/"
