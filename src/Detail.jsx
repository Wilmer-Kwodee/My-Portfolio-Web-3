import React from 'react'
import { useEffect, useRef, useState } from "react"
import { db, doc, getDoc, storage, updateDoc } from "../firebase"
import { useParams } from "react-router-dom"
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { RotatingLines } from "react-loader-spinner";

export default function Detail() {
    const { id } = useParams()
    const [item, setItem] = useState({})
    // const [itemTitle, setItemTitle] = useState()
    // const [itemDesc, setItemDesc] = useState()
    // const [itemColor, setItemColor] = useState()
    const [itemImage, setItemImage] = useState()
    const [isLoading, setLoading] = useState(false)
    const [itemImages, setItemImages] = useState([])

    useEffect(() => {
        async function biarBisaPakeAwait() {
            setLoading(true)
            try {
                const docRef = doc(db, 'MyProjects', id)
                const docSnap = await getDoc(docRef)
                const docData = docSnap.data()
    
                setItem({
                    ...docData,
                    title: docData.title,
                    desc: docData.desc,
                    color: docData.color,
                })
                if (docData && docData.journeyImages) {
                    setItemImages(docData.journeyImages); // Assume `setItemImages` updates the state for rendering images.
                }
                setLoading(false)
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        biarBisaPakeAwait();
    }, [])


    return(
        <div>
        <div className='w-screen h-screen bg-gradient-to-b from-transparent from-70% via-black/50 via-100% to-black to-100% fixed top-0 left-0 pointer-events-none'></div>        
        
        {!isLoading ? 
            <div style={{fontFamily: 'arial'}}>
                <div style={{display: 'flex', padding: 30, height: 'auto'}}>
                <div id='left' style={{ width: '50%', paddingLeft: 140}}>
                    <img style={{position: 'static', marginTop: '13rem', height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} src={itemImage ? URL.createObjectURL(itemImage) : item.image} alt='empty...' />
                    <div>
                        {itemImages?.map((url, index) => (
                            <img key={index} src={url} alt={`Image ${index}`} style={{position: 'static', marginTop: '3rem', height: 200, outlineStyle: 'solid', borderRadius: 20, outlineColor: 'whitesmoke', outlineWidth: 20}} />
                        ))}
                    </div>
                </div>
                <div id='right' style={{width: '50%', paddingRight: 130,  paddingTop: 100}}>
                <h1 className='text-3xl font-bold'>{item.title}</h1>
                <p style={{ whiteSpace: 'pre-wrap', color: 'gray', }}>{item.desc}</p>
                    {/* <p>{itemColor}</p> */}
                    <div className="flex gap-5 pt-5">
                    {item.technologies ? 
                        item.technologies.map((tech) => (
                            <>
                            <img src={`/SVGs/${tech}.svg`} className="w-10"/>
                            </>
                        ))
                        :
                        <></>
                    }
                    </div>
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
        </div>
    )
}
