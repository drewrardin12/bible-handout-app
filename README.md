# Bible Handout Follow-Up

A Safari web app for ministry contact follow-up and outreach tallies. Open the hosted app in Safari and use Share → Add to Home Screen.

## Development

Use Node.js 24 and pnpm 11. Run `pnpm install --frozen-lockfile --ignore-scripts`, then `pnpm dev`. Run `pnpm build` to build the static site.

## Hosting and privacy

GitHub Pages serves public app code. Firebase Authentication and Firestore membership rules protect private records and ministry templates. Never commit contact exports, personal records, credentials, or membership documents. Firebase web configuration identifies the project; Firestore rules enforce access.

The current app supports one ministry. Separate church onboarding and isolation require additional implementation before admitting other ministries.

Trigger the Pages workflow manually in GitHub Actions. Add the Pages hostname to Firebase Authentication authorized domains before testing hosted sign-in. Existing Firebase data and the original app are preserved.

## Checks

Run `pnpm exec tsc --noEmit`, `node tests/record-validation.mjs`, `node tests/contact-filters.mjs`, and `node tests/report-periods.mjs`. Firestore privacy tests run against the Firebase emulator using `tests/firestore-privacy.mjs`.
