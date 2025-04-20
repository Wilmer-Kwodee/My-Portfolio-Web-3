import { useEffect, useRef, useState } from "react"
import { db, doc, getDoc, insertToFirestore, storage, updateDoc } from "../firebase"
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore/lite";
import { RotatingLines } from "react-loader-spinner";

export default function(){
    const [itemTitle, setItemTitle] = useState('Enter Title Here...')
    const [itemDesc, setItemDesc] = useState('Enter desc here...')
    const [itemColor, setItemColor] = useState('white')
    const [itemImage, setItemImage] = useState()
    const [itemImagePath, setItemImagePath] = useState()

    const inputTitleRef = useRef(null)
    const h1TitleRef = useRef(null)

    const [isLoading, setLoading] = useState(false)

    async function handleUpdate() {
        if (itemImage == null) {
            alert('oi image empty');
            return;
        }
    
        try {
            setLoading(true)
            // Insert first to get the ID
            const docRef = await addDoc(collection(db, 'MyProjects'), {
                title: itemTitle,
                desc: itemDesc,
                color: itemColor,
                image: '', // Empty string for now
                order: 0
            });
    
            // Now we have the docRef with the ID
            const id = docRef.id;
    
            // Upload the file using the new ID
            const imageUrl = await uploadFile(id);
    
            // Update the document with the image URL
            await updateDoc(docRef, {
                image: imageUrl
            });
    
            setLoading(false)
            alert('Success');
            window.location.href = '/';
        } catch (error) {
            console.error('Error inserting/updating document:', error.message);
        }
    }
    
    function uploadFile(id) {
        if (itemImage == null) {
            return Promise.reject('No image selected');
        }
    
        return new Promise((resolve, reject) => {
            const imageRef = storageRef(storage, `Project Images/${id}/img`);
            
            uploadBytes(imageRef, itemImage)
                .then(snapshot => getDownloadURL(snapshot.ref))
                .then(url => {
                    setItemImagePath(url);
                    resolve(url);
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

    return(
        <div style={{fontFamily: 'arial'}}>

            {isLoading ? 
            <>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <RotatingLines 
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                </div>
            </> 
            : <></> }

            <h1 className='text-3xl font-bold' style={{fontSize: 50, padding: '3rem'}}>Write new chapter</h1>
            
            <div style={{display: 'flex', backgroundColor: itemColor, padding: 30, height: 'auto'}}>
            <div id='left' style={{width: '50%', paddingLeft: 140}}>
                <img className="max-w-96" style={{height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} src={itemImage ? URL.createObjectURL(itemImage) : ''} alt='empty...' />
            </div>
            <div id='right' style={{width: '50%', paddingRight: 130}}>
                <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} ref={inputTitleRef} style={{display: 'none', fontSize: 32, fontWeight: 700, marginTop: 10, marginBottom: 20, backgroundColor: itemColor, outlineStyle: 'none'}}/>
                <h1 className='text-3xl font-bold' onClick={handleTitleClick} ref={h1TitleRef}>{itemTitle}</h1>
                
                <textarea 
                value={itemDesc} 
                onChange={e => setItemDesc(e.target.value)} 
                className="w-full border border-black rounded-md p-2"
                />                
                <span>{itemDesc}</span>
                
    {/*
   * sorry... sumpah terpaksa chatgpt, ga ada waktu sumpah 
   */}

    

  {/*
   */}

                <input 
                style={{ marginTop: 20 }} 
                value={itemColor} 
                onChange={(e) => setItemColor(e.target.value)} 
                className="border border-black rounded-md p-2"
                />                
                <br/>
                <input type="file" accept="image/*" onChange={e => setItemImage(e.target.files[0]) } />
                <br />
                <br />
                <br />
                <button onClick={() => {handleUpdate()}} style={{
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
    )
}
