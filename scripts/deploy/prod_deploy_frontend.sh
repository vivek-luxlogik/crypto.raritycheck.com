#!/bin/bash 
set -euo pipefail

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
 
generate_random_number() {
  echo $(( ( RANDOM % 9 )  + 1 ))
}

num=$(generate_random_number) 
 
echo "To confirm production deployment, please enter the number $num:"
read user_input
 

if [ "$user_input" -eq "$num" ]; then
    ROOT_DIR="."
    PROTOS_DIR="${ROOT_DIR}/protos"

    cd "$__dir/../../frontend"

    export NODE_OPTIONS="--max-old-space-size=8192"
    npm install 
    npm run build

    BUILD_DIR="dist/"
    BUCKET="s3://crypto-raritycheck-frontend-prod"
    CLOUDFRONT_DIST_ID="E3175NJAPIRG5J"

    source "$__dir/upload_to_s3.sh"

    echo "Frontend production deployment complete!"
else
    echo "Input incorrect. Deployment aborted."
fi