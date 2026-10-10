# aCOUNT Entry

Open `entry.html` for the separate, account-free entry screen. Its prospect fields match aCOUNT's Add Contact form. Cards and drafts save in IndexedDB on the iPad. Uploads retry automatically while Entry is open and connected; copies remain on the device after successful upload.

The first visit must be online to download the app. The screen confirms **Ready to open offline** when its service worker is installed. No account, code, or outing setup is needed. Optionally add Entry to the Home Screen. iPadOS can suspend closed apps, so uploads resume when Entry reopens.

The free-plan workflow imports uploaded cards when signed-in aCOUNT is open. Date met matches an outing's date; one match imports automatically, multiple matches show an outing chooser, and no match waits safely for the outing to be added. Stable record IDs and transactions prevent duplicate imports. Tallies are preserved.

Outing labels use **Location — Month Day, Year**. Existing IDs and contact links remain intact. New and edited outings save the generated name, without a separate name field.

Server importers in `functions/` were implemented and emulator-tested, but they are not deployed: Firebase requires a billing upgrade for them, and the user chose to stay on the free plan. They are not necessary for the free-plan workflow.

Production entry permissions are awaiting explicit approval. Anonymous devices can create immutable entry cards and retry identical submissions, but cannot read ministry records or edit submitted cards. Approved members retain private record access. Rule deployment was blocked by automatic approval review; no workaround was attempted.

## Verification

TypeScript, production build, date/name matching, anonymous submission/retry privacy, existing private-record access, concurrent import deduplication, and server importer tests passed. Browser tests at an iPad-sized viewport passed for offline saving/reopening, retained cards, and recovered drafts. Physical iPad Safari testing remains a device check.

## Publishing

After production permissions are approved, deploy only Firestore rules (`firebase deploy --only firestore:rules --project bible-handout-follow-up-abm`) and run the GitHub Pages workflow. The app build generates the service worker cache from its actual assets. Do not deploy Cloud Functions or enable billing for the chosen free-plan workflow.
