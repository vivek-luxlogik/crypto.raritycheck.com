#!/bin/bash
 
set -euo pipefail
 
if [ -z "$BUILD_DIR" ]; then
    echo "Error: BUILD_DIR environment variable is not set"
    exit 1
fi

if [ -z "$BUCKET" ]; then
    echo "Error: BUCKET environment variable is not set"
    exit 1
fi

if [ -z "$CLOUDFRONT_DIST_ID" ]; then
    echo "Error: CLOUDFRONT_DIST_ID environment variable is not set"
    exit 1
fi

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Error: Build directory $BUILD_DIR does not exist"
    exit 1
fi

# Write version.json
VERSION="$(git rev-parse --short HEAD)"
echo "Writing $VERSION to version.json..."
echo "{\"gitSha\": \"$VERSION\"}" > "$BUILD_DIR/version.json"

 echo "Syncing static assets to S3..."
aws s3 sync "$BUILD_DIR" "$BUCKET" \
    --exclude "index.html" \
    --exclude "version.json" \
    --cache-control "public, max-age=31536000, immutable"
 
echo "Uploading index.html..."
aws s3 cp "$BUILD_DIR/index.html" "$BUCKET/index.html" \
    --cache-control "public, max-age=30, stale-if-error=120" \
    --content-type "text/html"
 
echo "Uploading version.json..."
aws s3 cp "$BUILD_DIR/version.json" "$BUCKET/version.json" \
    --cache-control "public, max-age=30, stale-if-error=120" \
    --content-type "application/json"
 
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "/*"

echo "S3 upload and CloudFront invalidation complete!"