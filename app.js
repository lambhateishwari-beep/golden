// Replace the Firebase configuration below with your project's configuration.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const firebaseConfig = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_AUTH_DOMAIN',
  projectId: 'PASTE_PROJECT_ID',
  storageBucket: 'PASTE_STORAGE_BUCKET',
  messagingSenderId: 'PASTE_MESSAGING_SENDER_ID',
  appId: 'PASTE_APP_ID'
};
const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);
const categoriesCol=collection(db,'categories'), dishesCol=collection(db,'dishes');
const $=id=>document.getElementById(id); let categories=[],dishes=[],editingId=null;
$('ownerToggle').onclick=()=>{$('loginPanel').classList.toggle('hidden');$('adminPanel').classList.add('hidden')};
$('login').onclick=async()=>{try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value);$('loginMsg').textContent='';}catch(e){$('loginMsg').textContent='Login failed. Check email and password.';}};
$('logout').onclick=()=>signOut(auth);
onAuthStateChanged(auth,user=>{if(user){$('loginPanel').classList.add('hidden');$('adminPanel').classList.remove('hidden');refresh();}else{$('adminPanel').classList.add('hidden');}});
async function refresh(){try{const c=await getDocs(categoriesCol),d=await getDocs(dishesCol);categories=c.docs.map(x=>({id:x.id,...x.data()}));dishes=d.docs.map(x=>({id:x.id,...x.data()}));render();}catch(e){$('status').textContent='Could not load menu. Check Firebase setup and permissions.';$('status').classList.add('error');}}
function render(){ $('status').textContent=categories.length?'':'Add menu categories in Owner access to begin.';const menu=$('menu');menu.innerHTML='';categories.forEach(cat=>{const section=document.createElement('section');section.className='category';const title=document.createElement('h2');title.textContent=cat.name;section.append(title);dishes.filter(d=>d.categoryId===cat.id).forEach(d=>{const item=document.createElement('div');item.className='item';if(d.image){const img=document.createElement('img');img.src=d.image;img.alt=d.name;img.loading='lazy';item.append(img);}const details=document.createElement('div');details.className='details';const h=document.createElement('h3');h.textContent=d.name;details.append(h);if(d.description){const p=document.createElement('p');p.textContent=d.description;details.append(p);}item.append(details);const price=document.createElement('span');price.className='price';price.textContent='₹'+Number(d.price).toLocaleString('en-IN');item.append(price);section.append(item);});menu.append(section);});
const sel=$('dishCategory');sel.innerHTML='';categories.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;sel.append(o)});
$('categoryList').innerHTML='';categories.forEach(c=>{const row=document.createElement('div');row.className='rowManage categoryManage';const span=document.createElement('span');span.textContent=c.name;row.append(span);const del=document.createElement('button');del.textContent='Delete';del.className='secondary';del.onclick=async()=>{if(dishes.some(d=>d.categoryId===c.id)){alert('Delete or move this category’s dishes first.');return;}if(confirm('Delete category '+c.name+'?')){await deleteDoc(doc(db,'categories',c.id));refresh();}};row.append(del);$('categoryList').append(row);});
$('dishList').innerHTML='';dishes.forEach(d=>{const row=document.createElement('div');row.className='rowManage';const span=document.createElement('span');span.textContent=d.name+' — ₹'+d.price+' ('+(categories.find(c=>c.id===d.categoryId)?.name||'Uncategorised')+')';row.append(span);const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>startEdit(d);row.append(edit);const del=document.createElement('button');del.textContent='Delete';del.className='secondary';del.onclick=async()=>{if(confirm('Delete '+d.name+'?')){await deleteDoc(doc(db,'dishes',d.id));refresh();}};row.append(del);$('dishList').append(row);});}
$('addCategory').onclick=async()=>{const name=$('categoryName').value.trim();if(!name)return;await addDoc(categoriesCol,{name});$('categoryName').value='';refresh();};
$('saveDish').onclick=async()=>{const name=$('dishName').value.trim(),price=$('dishPrice').value,categoryId=$('dishCategory').value;if(!name||price===''||!categoryId){$('adminMsg').textContent='Enter a dish name, price and category.';return;}const data={name,price:Number(price),categoryId,description:$('dishDescription').value.trim(),image:$('dishImage').value.trim()};if(editingId)await updateDoc(doc(db,'dishes',editingId),data);else await addDoc(dishesCol,data);resetDishForm();$('adminMsg').textContent='Saved.';refresh();};
function startEdit(d){editingId=d.id;$('dishName').value=d.name;$('dishPrice').value=d.price;$('dishDescription').value=d.description||'';$('dishImage').value=d.image||'';$('dishCategory').value=d.categoryId;$('saveDish').textContent='Save changes';$('cancelEdit').classList.remove('hidden');}
function resetDishForm(){editingId=null;$('dishName').value='';$('dishPrice').value='';$('dishDescription').value='';$('dishImage').value='';$('saveDish').textContent='Add dish';$('cancelEdit').classList.add('hidden');}
$('cancelEdit').onclick=resetDishForm;
