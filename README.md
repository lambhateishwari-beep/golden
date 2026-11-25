# The Golden Sip — Owner Menu Panel Starter

This is a starter owner panel for managing menu categories and dishes (prices, descriptions, availability, adding/deleting). It uses Firebase Authentication and Firestore; it is **not secure until you finish the Firebase setup and replace the placeholders**.

## 1. Create Firebase
1. Go to https://console.firebase.google.com/ and create a project.
2. Add a Web App and copy the Firebase config into `app.js`.
3. Authentication → Sign-in method → enable Email/Password.
4. Authentication → Users → Add user. Create the owner's email/password.
5. Open that user and copy the UID. Replace `REPLACE_WITH_OWNER_AUTH_UID` in BOTH `app.js` and `firestore.rules`.
6. Firestore Database → Create database.
7. In Firestore Rules, paste the rules from `firestore.rules` and Publish.

## 2. Deploy
Upload the files in this folder to a GitHub repository (keep `index.html` at the repository root) and import it into Vercel. No build command is required for this static starter.

## 3. Existing website integration
This starter is a separate admin page. It does not automatically connect to an existing site's menu display. To integrate with your existing website, use the same Firestore collections (`categories` and `dishes`) in its menu rendering code and add the Firebase initialization. Do not replace your current website with this starter unless you want the simple sample layout.

## Collections
- `categories`: documents with `name`
- `dishes`: documents with `name`, `description`, `price`, `categoryId`, `available`

## Important security notes
- Replace all config placeholders and the UID placeholders.
- Firestore rules restrict writes to the owner UID. Reads are public for menu display.
- Never share the owner's password or UID unnecessarily.
- Consider restricting owner sign-up and use only the created owner account.
