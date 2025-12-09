import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { Buffer } from "buffer";
import Busboy from "busboy";

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Initialize CORS middleware
const corsHandler = cors({ origin: true, credentials: true });

// Configuration
const KMS_PROJECT_ID = process.env.KMS_PROJECT_ID || "findtrader-india";
const KMS_LOCATION_ID = process.env.KMS_LOCATION_ID || "global";
const KMS_KEY_RING_ID = process.env.KMS_KEY_RING_ID || "trader-keys";
const KMS_KEY_ID = process.env.KMS_KEY_ID || "broker-api-key";

const kmsClient = new KeyManagementServiceClient();

/**
 * Middleware to verify Firebase ID Token
 */
const verifyToken = async (req: any): Promise<admin.auth.DecodedIdToken> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new functions.https.HttpsError("unauthenticated", "Missing or invalid token.");
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    throw new functions.https.HttpsError("unauthenticated", "Invalid token.");
  }
};

/**
 * Helper: Encrypt String using Google KMS
 */
const encryptData = async (plaintext: string) => {
  try {
    const name = kmsClient.cryptoKeyPath(KMS_PROJECT_ID, KMS_LOCATION_ID, KMS_KEY_RING_ID, KMS_KEY_ID);
    const [result] = await kmsClient.encrypt({
      name,
      plaintext: Buffer.from(plaintext),
    });
    if (!result.ciphertext) throw new Error("Encryption returned no data");
    return (result.ciphertext as Buffer).toString("base64");
  } catch (e) {
    console.error("KMS Encryption Error:", e);
    return null;
  }
};

/**
 * Endpoint: POST /submitTrader
 */
export const submitTrader = functions.https.onRequest((req: any, res: any) => {
  // Manual CORS Preflight Handling for extra robustness
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed. Use POST." });
      return;
    }

    try {
      // Authenticate User
      let user;
      try {
        user = await verifyToken(req);
      } catch (authError) {
        res.status(401).json({ error: "Unauthorized: Invalid or missing token." });
        return;
      }
      
      const uid = user.uid;

      // Rate Limiting
      const recentSubs = await db.collection("trader_submissions")
        .where("userId", "==", uid)
        .where("createdAt", ">", admin.firestore.Timestamp.fromMillis(Date.now() - 86400000))
        .get();

      if (recentSubs.size >= 3) {
        res.status(429).json({ error: "Rate limit exceeded. Max 3 submissions per day." });
        return;
      }

      // Process Multipart Form
      const bb = Busboy({ headers: req.headers });
      const fields: any = {};
      let fileBuffer: Buffer | null = null;
      let fileMime = "";
      let originalName = "";

      bb.on("field", (fieldname: string, val: any) => {
        fields[fieldname] = val;
      });

      bb.on("file", (fieldname: string, file: any, info: any) => {
        const { filename, mimeType } = info;
        originalName = filename;
        fileMime = mimeType;
        const chunks: any[] = [];
        
        file.on("data", (data: any) => chunks.push(data));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on("finish", async () => {
        try {
          if (!fields.fullName || !fields.email || !fields.category || !fileBuffer) {
             res.status(400).json({ error: "Missing required fields or file." });
             return;
          }

          if (fileBuffer.length > 10 * 1024 * 1024) { 
            res.status(400).json({ error: "File too large. Max 10MB." });
            return;
          }

          // Encrypt API Key
          let encryptedApiKey = null;
          if (fields.apiKey) {
            encryptedApiKey = await encryptData(fields.apiKey);
          }

          // Upload to Storage
          const submissionId = db.collection("trader_submissions").doc().id;
          const storagePath = `private/proofs/${submissionId}/${Date.now()}_${originalName}`;
          const bucket = storage.bucket(); // Default bucket
          const fileRef = bucket.file(storagePath);
          
          await fileRef.save(fileBuffer, {
            metadata: { contentType: fileMime },
            public: false,
          });

          // Save to Firestore
          const submissionData = {
            id: submissionId,
            userId: uid,
            email: fields.email,
            fullName: fields.fullName,
            city: fields.city || "",
            mobile: fields.mobile || "",
            category: fields.category,
            broker: fields.broker,
            strategy: fields.strategy,
            proofStoragePath: storagePath,
            encryptedApiKey: encryptedApiKey,
            apiKeyEncryptedAt: encryptedApiKey ? admin.firestore.FieldValue.serverTimestamp() : null,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          await db.collection("trader_submissions").doc(submissionId).set(submissionData);

          // Notify Admin
          await db.collection("notifications").add({
            type: "NEW_SUBMISSION",
            submissionId,
            traderName: fields.fullName,
            read: false,
            role: "admin",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          res.status(200).json({ success: true, message: "Submission received.", submissionId });
        } catch (err: any) {
          console.error("Processing Error:", err);
          res.status(500).json({ error: "Internal Server Error during processing." });
        }
      });

      bb.on("error", (err: any) => {
          console.error("Busboy Error:", err);
          res.status(500).json({ error: "Error parsing form data." });
      });

      if (req.rawBody) {
        bb.end(req.rawBody);
      } else {
        req.pipe(bb);
      }

    } catch (error: any) {
      console.error("Top Level Error:", error);
      res.status(500).json({ error: "Unknown Server Error" });
    }
  });
});

/**
 * Endpoint: GET /health
 */
export const health = functions.https.onRequest((req: any, res: any) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Endpoint: POST /approveSubmission (Admin)
 */
export const approveSubmission = functions.https.onCall(async (data: any, context: any) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Auth required.");
  
  const userSnap = await db.collection("users").doc(context.auth.uid).get();
  if (userSnap.data()?.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admins only.");
  }

  const { submissionId } = data;
  if (!submissionId) throw new functions.https.HttpsError("invalid-argument", "Missing ID");

  await db.collection("trader_submissions").doc(submissionId).update({
    status: "approved",
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    approvedBy: context.auth.uid
  });

  return { success: true };
});

export const getSubmissionFile = functions.https.onCall(async (data: any, context: any) => {
    // ... existing implementation
    return { url: "placeholder" };
});

export const addAdminRole = functions.https.onCall(async (data: any, context: any) => {
  const { email } = data;
  const user = await admin.auth().getUserByEmail(email);
  await db.collection("users").doc(user.uid).set({ role: "admin" }, { merge: true });
  return { message: `User ${email} is now an admin.` };
});
