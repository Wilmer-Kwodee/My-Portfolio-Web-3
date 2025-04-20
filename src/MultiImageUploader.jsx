import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { RotatingLines } from "react-loader-spinner";

export default function MultiImageUploader({ id }) {
    const [selectedImages, setSelectedImages] = useState([]); // Store selected files
    const [previewImages, setPreviewImages] = useState([]);  // Store preview URLs
    const [isUploading, setIsUploading] = useState(false);  // Upload status

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(files);

        // Generate preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const uploadMultipleFiles = async () => {
        if (selectedImages.length === 0) {
            alert("No images selected.");
            return;
        }

        setIsUploading(true);

        try {
            const uploadPromises = selectedImages.map((image, index) => {
                const imageRef = storageRef(storage, `Project Images/${id}/img${Date.now()}_${index}`);
                return uploadBytes(imageRef, image).then(snapshot => getDownloadURL(snapshot.ref));
            });

            const imageUrls = await Promise.all(uploadPromises);

            // Save the image URLs to Firestore
            const docRef = doc(db, 'MyProjects', id);
            await updateDoc(docRef, { journeyImages: imageUrls });

            alert("Images uploaded successfully!");
            setSelectedImages([]);
            setPreviewImages([]);
        } catch (error) {
            console.error("Error uploading images:", error.message);
            alert("Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial', padding: '1rem' }}>
            <h2>Upload Multiple Images</h2>
            
            {/* File input */}
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ marginBottom: '1rem' }}
            />
            
            {/* Preview selected images */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {previewImages.map((src, index) => (
                    <img 
                        key={index} 
                        src={src} 
                        alt={`Preview ${index}`} 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} 
                    />
                ))}
            </div>

            {/* Upload button */}
            <button 
                onClick={uploadMultipleFiles} 
                disabled={isUploading} 
                style={{
                    marginTop: '1rem',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: isUploading ? '#ccc' : '#00d5ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
            >
                {isUploading ? "Uploading..." : "Upload Images"}
                {isUploading ? <>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <RotatingLines 
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="96"
                            visible={true}
                        />
                    </div>
                </> : <></>}
            </button>
        </div>
    );
}
