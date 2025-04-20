import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, getDocs, addDoc, doc, updateDoc, orderBy, query, arrayUnion, arrayRemove } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpTL2ecFwJV_UCQ5Yf7v2sl-onXJGX27s",
  authDomain: "wilmer-portfolio-web.firebaseapp.com",
  projectId: "wilmer-portfolio-web",
  storageBucket: "wilmer-portfolio-web.appspot.com",
  messagingSenderId: "997051434145",
  appId: "1:997051434145:web:894f21f13fa81542b95ce0",
  measurementId: "G-G4NHBQEGN9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage()

// Get a list of cities from your database
async function getCities(db) {
  // supaya firebase ga ngamuk & quota limit shit again
  try {
    const projectRef = collection(db, 'MyProjects')
    const q = await query(projectRef, orderBy('order')) 
    const citySnapshot = await getDocs(q);
  
    const cityList = citySnapshot.docs.map(doc => {
      return { 
          id: doc.id, 
          ...doc.data(), 
      }
    });
    return cityList;
    
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    return []; // Return an empty array to prevent app crashes
  }
}

async function insertToFirestore(title, desc, color, order, imageLink){
    try {
      const docRef = await addDoc(collection(db, 'MyProjects'), {
        title: title,
        desc: desc,
        color: color,
        order: order,
        image: imageLink,
        journeyImages: ['test'],
        technologies: ['html']
      })
      console.log(docRef)
    } catch (e) {
      console.log(e)
    }
  }
  
  /*
   * sorry... sumpah terpaksa chatgpt, ga ada waktu sumpah 
   */

    // list of skills = [react, firebase, tailwind]

    // multiple image function logic

  async function addTechnology(id, technology) {
    const docRef = doc(db, 'MyProjects', id);
    try {
        await updateDoc(docRef, {
            technologies: arrayUnion(technology),
        });
        alert('Technology added successfully!');
    } catch (error) {
        console.error("Error adding technology: ", error.message);
    }
  }
  async function removeTechnology(id, technology) {
    const docRef = doc(db, 'MyProjects', id);
    try {
        await updateDoc(docRef, {
            technologies: arrayRemove(technology),
        });
        alert('Technology removed successfully!');
    } catch (error) {
        console.error("Error removing technology: ", error.message);
    }
}

  /*
   */

export {db, storage, doc, getCities, getDoc, insertToFirestore, updateDoc, addTechnology, removeTechnology }