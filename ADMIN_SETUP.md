# Backend Setup Instructions

## 1. Enable Google Cloud Services
1. Go to Google Cloud Console for project `findtrader-india`.
2. Enable **Cloud Functions API**.
3. Enable **Cloud Build API**.
4. Enable **Cloud Key Management Service (KMS) API**.

## 2. Setup Google KMS (Encryption)
1. Open Cloud Shell in GCP Console.
2. Create a KeyRing:
   ```bash
   gcloud kms keyrings create trader-keys --location global
   ```
3. Create a CryptoKey for the API keys:
   ```bash
   gcloud kms keys create broker-api-key --location global --keyring trader-keys --purpose encryption
   ```
4. Grant the Cloud Functions Service Account access to encrypt:
   * Identify your App Engine default service account (usually `PROJECT_ID@appspot.gserviceaccount.com`).
   * Add role `Cloud KMS CryptoKey Encrypter/Decrypter`.

## 3. Environment Configuration
Set the KMS configuration for your functions:
```bash
firebase functions:config:set kms.project_id="findtrader-india" kms.location_id="global" kms.key_ring_id="trader-keys" kms.key_id="broker-api-key"
```

## 4. Deploy Functions
```bash
firebase deploy --only functions
```

## 5. Seed Initial Admin
To make the first user an admin so they can approve/reject others:
1. Sign up in the web app with your email (e.g., `admin@findtrader.in`).
2. Run this command locally (or create a temporary script):
   ```bash
   # Use the Firebase Functions Shell to call the utility function locally
   firebase functions:shell
   > addAdminRole({email: "admin@findtrader.in"})
   ```
3. Alternatively, manually go to Firestore Console -> `users` collection -> create doc with ID `UID` -> add field `role: "admin"`.

## 6. Testing
1. Run `npm start` in the client.
2. Go to `/submit`.
3. Submit a form with a dummy PDF and API key.
4. Check Firestore `trader_submissions`: `encryptedApiKey` should be a long base64 string (not the plain text).
5. Check Storage `private/proofs`: File should exist. Try to open the URL directly in an Incognito window - it should fail (Access Denied).
