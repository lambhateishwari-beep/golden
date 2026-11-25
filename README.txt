THE GOLDEN SIP - OWNER MENU PANEL STARTER

IMPORTANT: This starter is not connected to your current Vercel website yet. Deploying these files replaces/creates a site only if deployed to the correct Vercel project. Firebase setup is required for the owner login and persistent menu storage.

SETUP (free Firebase plan is sufficient for a small menu project):
1. Visit https://console.firebase.google.com and create a Firebase project.
2. Add a Web app in project settings and copy its Firebase configuration.
3. Replace the placeholder values in app.js (firebaseConfig).
4. In Firebase Authentication > Sign-in method, enable Email/Password.
5. In Authentication > Users, add your owner's email and password.
6. In Firestore Database, create a database.
7. Open Authentication > Users, copy the owner's UID.
8. Replace PASTE_OWNER_UID in firestore.rules with that UID.
9. Publish the rules from Firebase Firestore > Rules (copy firestore.rules contents).
10. Deploy the website files to the Vercel project using the project's files/deployment workflow.

HOW OWNER ACCESS WORKS:
- On the customer page, click Owner access near the bottom.
- Sign in using the email/password created in Firebase Authentication.
- Add categories; add/edit/delete menu items and prices.
- Customer menu updates from Firestore.

Security note: do not publish firebase.rules with the placeholder UID. Set the actual UID first. Do not share the owner password.

This is a starter, not a modification of your existing design/code. To preserve the exact existing Golden Sip layout, its original source files must be merged with these features.
