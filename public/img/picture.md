# Image Replacement Guide

This file documents the placeholder images in `public/img` and the design aspect ratios they should follow.

> Use these ratios when replacing the placeholder SVGs with real photos to avoid breaking the site layout.

## Home teasers

These three images are used on the homepage teaser cards.

- `home-portrait.svg` — aspect ratio: `3:4` (portrait) — A single portrait subject framed tight and intimate, soft natural or window light, calm and direct (pairs with the "Quiet frames" label).
- `home-commercial.svg` — aspect ratio: `3:4` (portrait) — A clean brand or product still — controlled set, deliberate framing, built to sell (pairs with the "Brand work" label).
- `home-editorial.svg` — aspect ratio: `3:4` (portrait) — A fashion or lifestyle frame with cinematic mood, narrative, and a magazine-style edge (pairs with the "Story-led" label).

## Portfolio cards

Six portfolio images are shown in the portfolio grid.

- `portfolio-portrait-01.svg` — aspect ratio: `3:4` — "Northlight Portraits" (Brooklyn, NY) — an individual subject bathed in soft north-facing window light, classic studio portrait with a calm, direct gaze.
- `portfolio-commercial-01.svg` — aspect ratio: `3:4` — "Quiet Launch" (Austin, TX) — a brand launch or product campaign frame, clean background, controlled set, minimal styling.
- `portfolio-editorial-01.svg` — aspect ratio: `3:4` — "Field Notes" (Paris, FR) — a Parisian fashion or street editorial frame, cinematic tone, strong shape, magazine-style sequence feel.
- `portfolio-event-01.svg` — aspect ratio: `3:4` — "After Hours" (New York, NY) — a low-light NYC event or nightlife moment, atmosphere intact, candid energy, venue lighting.
- `portfolio-portrait-02.svg` — aspect ratio: `3:4` — "Low Tide Portraits" (Reykjavik, IS) — a subject in a cool, windswept Icelandic coastal landscape, muted palette, environmental portrait.
- `portfolio-commercial-02.svg` — aspect ratio: `3:4` — "Surface Study" (Los Angeles, CA) — a minimalist product or material detail shot, sharp light, California warmth, tight crop.

## About page image

This image appears on the About page and is a taller portrait-style frame.

- `about-studio.svg` — aspect ratio: `4:5` — A tall interior portrait of the LUMIS studio space — gear, lighting, and working environment visible, atmospheric and on-brand.

## Journal cards

Three journal cards use a more landscape-oriented image.

- `journal-light.svg` — aspect ratio: `4:3` — "Why We Start With Shadow" (Light Notes) — a high-contrast frame led by darkness, deep shadow, and a single controlled highlight.
- `journal-craft.svg` — aspect ratio: `4:3` — "The Value of a Tighter Edit" (Craft) — a deliberate, tightly composed single frame — restrained, considered, one clear subject.
- `journal-vision.svg` — aspect ratio: `4:3` — "What We Look For Before the Shoot Starts" (Vision) — a pre-production mood image — scouted location, reference scene, or a quiet environmental shot setting tone and direction.

## Notes

- Keep the same orientation (portrait vs landscape) for each image.
- Prefer cropping to the target ratio rather than stretching the image.
- If you need to use a different size, preserve the ratio and use `object-cover` styling so the image fills the block cleanly.
