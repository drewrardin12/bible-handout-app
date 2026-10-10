# aCOUNT Entry

Open `entry.html` for the separate, account-free entry screen. Its prospect fields match aCOUNT's Add Contact form. Cards and drafts save in IndexedDB on the iPad. Uploads retry automatically while Entry is open and connected; copies remain on the device after successful upload.

The first visit must be online to download the app. The screen confirms **Ready to open offline** when its service worker is installed. No account, code, or outing setup is needed. Optionally add Entry to the Home Screen. iPadOS can suspend closed apps, so uploads resume when Entry reopens.

The free-plan workflow imports uploaded cards when signed-in aCOUNT is open. Date met matches an outing's date; one match imports automatically, multiple matches show an outing chooser, and no match waits safely for the outing to be added. Stable record IDs and transactions prevent duplicate imports. Tallies are preserved.

Outing labels use **Location — MM-DD-YYYY**. Existing IDs and contact links remain intact. New and edited outings save the generated name, without a separate name field.

Server importers in `functions/` were implemented and emulator-tested, but they are not deployed: Firebase requires a billing upgrade for them, and the user chose to stay on the free plan. They are not necessary for the free-plan workflow.

Production entry permissions were explicitly approved and deployed. Anonymous devices can create immutable entry cards and retry identical submissions, but cannot read ministry records or edit submitted cards. Approved members retain private record access.

Delete handout moves an outing to Handout Trash, with confirmation. It is excluded from reports and automatic matching; its totals and linked contacts are preserved, and it can be restored. All displayed dates and date inputs use MM-DD-YYYY, while stored date keys remain compatible with existing records.

## Verification

TypeScript, production build, date/name matching, anonymous submission/retry privacy, existing private-record access, concurrent import deduplication, and server importer tests passed. Browser tests at an iPad-sized viewport passed for offline saving/reopening, retained cards, and recovered drafts. Physical iPad Safari testing remains a device check.

## Publishing

Deploy only Firestore rules (`firebase deploy --only firestore:rules --project bible-handout-follow-up-abm`) and run the GitHub Pages workflow. The app build generates the service worker cache from its actual assets. Do not deploy Cloud Functions or enable billing for the chosen free-plan workflow.


Entry uses a charcoal and burnt-orange theme with a responsive form/cards layout. Save & Next clears prospect details while retaining the current date, location, and event type. Sync Cards triggers the same safe upload flow as automatic syncing, and Saved Cards counts retained local copies.

### Reviewing and correcting entries

Saved Cards displays the locally saved cards on the same page as the entry form. Edit works offline and retains a single local card. Corrections upload as immutable revision messages linked by the original unguessable card identifier retained on the Entry device. They update the existing aCOUNT contact when the main app is open and an outing matches. Later revisions take precedence over earlier arrivals, and follow-up status/history stay intact. Entry cannot read private ministry records. Keep this device’s browser storage to retain its saved cards and editing capability.
