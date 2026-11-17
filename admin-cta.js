/*
  Public "Dashboard" CTA visibility.

  This only controls what is SHOWN. Real protection lives in
  Firestore Security Rules (admins-only writes) plus the admin
  pages' own role re-check, which redirects non-admins to login.
*/
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db } from "./admin/firebase-config.js";

const ctas = Array.from(document.querySelectorAll("[data-admin-cta]"));

function setVisible(visible) {
  ctas.forEach((el) => {
    el.hidden = !visible;
    el.style.display = visible ? "" : "none";
  });
}

setVisible(false);

if (ctas.length) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setVisible(false);
      return;
    }

    try {
      const snapshot = await getDoc(doc(db, "users", user.uid));
      setVisible(snapshot.exists() && snapshot.data().role === "admin");
    } catch (error) {
      console.error("Admin CTA role check failed.", error);
      setVisible(false);
    }
  });
}
