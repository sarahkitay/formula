#!/usr/bin/env bash
# Re-encode marketing MP4 masters into web-friendly files under public/media/home/.
# Requires ffmpeg. Run from repo root after placing 4K masters as:
#   public/IMG_6200_1.mp4 (speed court), _3 (speed track), _4 (assessment), _5 (facility walkthrough).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/media/home"
mkdir -p "$OUT"

echo "Encoding loop backgrounds (no audio, 1280px max, faststart)…"
ffmpeg -y -i "$ROOT/public/IMG_6200_1.mp4" -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset fast -crf 26 -movflags +faststart "$OUT/speed-court.mp4"
ffmpeg -y -i "$ROOT/public/IMG_6200_3.mp4" -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset fast -crf 26 -movflags +faststart "$OUT/speed-track.mp4"
ffmpeg -y -i "$ROOT/public/IMG_6200_4.mp4" -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset fast -crf 26 -movflags +faststart "$OUT/assessment.mp4"

echo "Encoding facility walkthrough (1920px max, AAC audio)…"
ffmpeg -y -i "$ROOT/public/IMG_6200_5.mp4" -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset fast -crf 26 -c:a aac -b:a 128k -movflags +faststart "$OUT/facility-walkthrough.mp4"

echo "Posters (JPEG)…"
for name in speed-court speed-track assessment; do
  ffmpeg -y -i "$OUT/${name}.mp4" -frames:v 1 -vf "scale=min(960\,iw):-2" -q:v 5 "$OUT/${name}-poster.jpg"
done
ffmpeg -y -ss 00:00:01 -i "$OUT/facility-walkthrough.mp4" -frames:v 1 -vf "scale=min(960\,iw):-2" -q:v 5 -update 1 "$OUT/facility-walkthrough-poster.jpg"

ls -lh "$OUT"
echo "Done. Paths are wired from lib/marketing/home-video-assets.ts"
