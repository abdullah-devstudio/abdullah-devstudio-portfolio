import { signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

/*
  Frontend access guard for navigation. Firestore Security Rules remain the
  real authorization boundary for every database operation.
*/
export async function verifyAdmin(user) {
  if (!user) {
    return { authorized: false, reason: "signed-out" };
  }

  try {
    const userSnapshot = await getDoc(doc(db, "users", user.uid));
    const authorized = userSnapshot.exists() && userSnapshot.data().role === "admin";

    if (!authorized) {
      await signOut(auth);
      return { authorized: false, reason: "not-authorized" };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Admin role verification failed.", error);
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Sign-out after failed admin verification failed.", signOutError);
    }
    return { authorized: false, reason: "verification-error" };
  }
}