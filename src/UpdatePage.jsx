import { useEffect, useRef, useState } from "react"
import { addTechnology, db, doc, getDoc, removeTechnology, storage, updateDoc } from "../firebase"
import { useParams } from "react-router-dom"
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { RotatingLines } from "react-loader-spinner";
import MultiImageUploader from "./MultiImageUploader";

export default function(){
    const { id } = useParams()
    const [item, setItem] = useState({})
    const [itemTitle, setItemTitle] = useState()
    const [itemDesc, setItemDesc] = useState()
    const [itemColor, setItemColor] = useState()
    const [itemImage, setItemImage] = useState()
    const [itemImagePath, setItemImagePath] = useState()
    const [newTech, setNewTech] = useState("");

    const inputTitleRef = useRef(null)
    const h1TitleRef = useRef(null)

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        async function biarBisaPakeAwait() {
            setLoading(true)
            try {
                const docRef = doc(db, 'MyProjects', id)
                const docSnap = await getDoc(docRef)
                const docData = docSnap.data()
    
                setItem(docData);
                setItemTitle(docData.title);
                setItemDesc(docData.desc);
                setItemColor(docData.color);

                setLoading(false)
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        biarBisaPakeAwait()
    }, [])

    async function handleUpdate() {
        try {
            // Wait for the file to upload and get the URL
            setLoading(true)
            const imageUrl = await uploadFile();
            const docRef = doc(db, 'MyProjects', id);
    
            if(itemImage == null){
                await updateDoc(docRef, {
                    title: itemTitle, desc: itemDesc, color: itemColor,
                });
            }
            else{
                // Once the URL is available, update the Firestore document
                await updateDoc(docRef, {
                    title: itemTitle,
                    desc: itemDesc,
                    color: itemColor,
                    image: imageUrl, // Use the URL obtained from uploadFile
                });
            }
    
            setLoading(false)
            alert('Success');
            window.location.href = '/control-room';
        } catch (error) {
            console.error('Error updating document:', error.message);
        }
    }
    
    function uploadFile() {
        if(itemImage == null){
            return;
        }

        return new Promise((resolve, reject) => {
            const imageRef = storageRef(storage, `Project Images/${id}/img`);
            
            uploadBytes(imageRef, itemImage)
                .then(snapshot => {
                    getDownloadURL(snapshot.ref)
                        .then((url) => {
                            // Resolve the promise with the URL
                            setItemImagePath(url);
                            resolve(url);
                        })
                        .catch(error => {
                            console.error('Error getting download URL:', error.message);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error('Error uploading file:', error.message);
                    reject(error);
                });
        });
    }
    
    function handleTitleClick(){
        inputTitleRef.current.style.display = 'block'
        inputTitleRef.current.focus()
        h1TitleRef.current.style.display = 'none'
    }

      /*
   * sorry... sumpah terpaksa chatgpt, ga ada waktu sumpah 
   */

      function handleAddTechnology() {
        if (newTech.trim() !== "") {
            addTechnology(id, newTech);
            setNewTech(""); // Clear the input field
        }
    }
    
    function handleRemoveTechnology(tech) {
        removeTechnology(id, tech);
    }

      /*
      */

    return(
        <>
        {!isLoading ? 
            <div style={{fontFamily: 'arial', paddingTop: '7rem'}}>
                <div style={{display: 'flex', backgroundColor: itemColor, padding: 30, height: 'auto'}}>
                <div id='left' style={{width: '50%', paddingLeft: 140}}>
                    <img style={{position: 'fixed', height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} src={itemImage ? URL.createObjectURL(itemImage) : item.image} alt='empty...' />
                </div>
                <div id='right' style={{width: '50%', paddingRight: 130}}>
                    <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} ref={inputTitleRef} style={{display: 'none', fontSize: 32, fontWeight: 700, marginTop: 10, marginBottom: 20, backgroundColor: itemColor, outlineStyle: 'none'}}/>
                    <h1 className='text-3xl font-bold' onClick={handleTitleClick} ref={h1TitleRef}>{itemTitle}</h1>
                    
                    <textarea                 className="w-full h-52 border border-black rounded-md p-2"
 value={itemDesc} onChange={e => setItemDesc(e.target.value)} style={{width: '100%'}}/><br/>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{itemDesc}</p>
                    
                    <input className="border border-black rounded-md p-2"
 style={{marginTop: 20}} value={itemColor} onChange={(e) => setItemColor(e.target.value)}/><br/>
                    <br/>
                    <input type="file" accept="image/*" onChange={e => setItemImage(e.target.files[0])}/>
                    <br />
                    <br />
                    <br />
                    
                    <div>
                        {/* Existing UI */}
                        <h3 className="font-bold">Technologies</h3>
                        <ul>
                            {item.technologies?.map((tech, index) => (
                                <li key={index}>
                                    {tech} -
                                    <button className="text-red-500" onClick={() => handleRemoveTechnology(tech)}> - Remove</button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            placeholder="Add a technology"
                            className="border border-black rounded-md p-2"
                        />
                        <button onClick={handleAddTechnology} className="text-green-500">Add Technology</button>
                    </div>

                    <br />
                    <br />
                    <br />
                    <MultiImageUploader id={id}/>
                    <button onClick={() => {handleUpdate()}}                 style={{
                    marginTop: '1rem',
                    padding: '10px 20px',
                    fontSize: '45px',
                    backgroundColor: '#00d5ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                }}>Submit</button>
                </div>
                </div>
            </div>
            :
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <RotatingLines 
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </div>
        }
        </>
    )
}
