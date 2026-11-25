// Firebase setup required: create a Firebase project, enable Email/Password Authentication
// and Firestore, then replace the configuration below. See README.md.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
const OWNER_UID = "REPLACE_WITH_OWNER_AUTH_UID";
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
const $ = id => document.getElementById(id);
$("ownerBtn").onclick=()=>{$("panel").hidden=!$("panel").hidden;};
$("loginBtn").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value,$("password").value);$("message").textContent="";}catch(e){$("message").textContent="Login failed: "+e.message;}};
$("logout").onclick=()=>signOut(auth);
onAuthStateChanged(auth,user=>{const allowed=!!user&&user.uid===OWNER_UID;$("login").hidden=allowed;$("manager").hidden=!allowed;if(user&&!allowed){signOut(auth);$("message").textContent="This account is not authorized as owner."; } if(allowed)loadMenu();});
$("categoryForm").onsubmit=async e=>{e.preventDefault();await addDoc(collection(db,"categories"),{name:$("categoryName").value.trim()});$("categoryName").value="";loadMenu();};
$("dishForm").onsubmit=async e=>{e.preventDefault();await addDoc(collection(db,"dishes"),{name:$("dishName").value.trim(),description:$("dishDesc").value.trim(),price:Number($("dishPrice").value),categoryId:$("dishCategory").value,available:true});e.target.reset();loadMenu();};
async function loadMenu(){const cs=await getDocs(collection(db,"categories")),ds=await getDocs(collection(db,"dishes"));const cats=cs.docs.map(x=>({id:x.id,...x.data()})),dishes=ds.docs.map(x=>({id:x.id,...x.data()}));$("dishCategory").innerHTML=cats.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");$("menu").innerHTML=cats.map(c=>`<section class="category"><h3>${esc(c.name)} <button class="danger" data-cat="${c.id}">Delete category</button></h3>${dishes.filter(d=>d.categoryId===c.id).map(d=>`<div class="dish"><span><strong>${esc(d.name)}</strong><br>${esc(d.description||"")}<br>₹${d.price} · ${d.available?"Available":"Unavailable"}</span><button data-toggle="${d.id}" data-state="${d.available}">${d.available?"Mark unavailable":"Mark available"}</button><button data-edit="${d.id}" data-price="${d.price}">Change price</button><button class="danger" data-delete="${d.id}">Delete dish</button></div>`).join("")}</section>`).join("")+dishes.filter(d=>!cats.some(c=>c.id===d.categoryId)).map(d=>`<div class="dish">${esc(d.name)} — ₹${d.price}<button class="danger" data-delete="${d.id}">Delete dish</button></div>`).join("");
document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this category? Dishes in it will remain uncategorized.")){await deleteDoc(doc(db,"categories",b.dataset.cat));loadMenu();}});
document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this dish permanently?")){await deleteDoc(doc(db,"dishes",b.dataset.delete));loadMenu();}});
document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,"dishes",b.dataset.toggle),{available:b.dataset.state!=="true"});loadMenu();});
document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=async()=>{const p=prompt("Enter new price",b.dataset.price);if(p!==null&&p.trim()!==""&&!isNaN(Number(p))&&Number(p)>=0){await updateDoc(doc(db,"dishes",b.dataset.edit),{price:Number(p)});loadMenu();}});
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
