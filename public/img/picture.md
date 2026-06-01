# Image Replacement Guide

This file documents the placeholder images in `public/img` and the design aspect ratios they should follow.

> Use these ratios when replacing the placeholder SVGs with real photos to avoid breaking the site layout.

## Home teasers

These three images are used on the homepage teaser cards.

- `home-portrait.svg` — aspect ratio: `3:4` (portrait)
- `home-commercial.svg` — aspect ratio: `3:4` (portrait)
- `home-editorial.svg` — aspect ratio: `3:4` (portrait)

## Portfolio cards

Six portfolio images are shown in the portfolio grid.

- `portfolio-portrait-01.svg` — aspect ratio: `3:4`
- `portfolio-commercial-01.svg` — aspect ratio: `3:4`
- `portfolio-editorial-01.svg` — aspect ratio: `3:4`
- `portfolio-event-01.svg` — aspect ratio: `3:4`
- `portfolio-portrait-02.svg` — aspect ratio: `3:4`
- `portfolio-commercial-02.svg` — aspect ratio: `3:4`

## About page image

This image appears on the About page and is a taller portrait-style frame.

- `about-studio.svg` — aspect ratio: `4:5`

## Journal cards

Three journal cards use a more landscape-oriented image.

- `journal-light.svg` — aspect ratio: `4:3`
- `journal-craft.svg` — aspect ratio: `4:3`
- `journal-vision.svg` — aspect ratio: `4:3`

## Notes

- Keep the same orientation (portrait vs landscape) for each image.
- Prefer cropping to the target ratio rather than stretching the image.
- If you need to use a different size, preserve the ratio and use `object-cover` styling so the image fills the block cleanly.
