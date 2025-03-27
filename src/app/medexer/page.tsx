'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { storage } from "../../firebase/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import Loading from '../../components/loading/loading';

interface FileData {
    previewFile: {
        name: string;
        type: string;
        size: number;
        dataURL: string;
    } | null;
    errorMessage: string;
}

const Medexer: React.FC = () => {
    const [fileData, setFileData] = useState<FileData>({ previewFile: null, errorMessage: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [finding, setFinding] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const openFileDialog = (): void => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDraggingOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const file = droppedFiles[0];

        if (file) {
            checkFileType(file);
        }
    };

    const checkFileType = (file: File): void => {
        setUploadedImage(file);
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            setFileData({ ...fileData, errorMessage: 'Unsupported file format. Please upload a .png or .jpeg file.' });
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setFileData({
                    ...fileData,
                    previewFile: {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        dataURL: event.target.result as string
                    }
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const deletePreviewFile = (): void => {
        setFinding('');
        setDescription('');
        setFileData({ ...fileData, previewFile: null, errorMessage: '' });
    };

    const formatBytesToMB = (bytes: number): string => {
        if (bytes === 0) return '0 MB';
        const mbSize = bytes / (1024 * 1024);
        return mbSize.toFixed(2) + ' MB';
    };

    const uploadImage = async (): Promise<void> => {
        if (!uploadedImage) return;
        setIsLoading(true);
        try {
            const imageRef = ref(storage, `images/${uploadedImage.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, uploadedImage);
            const url = await getDownloadURL(snapshot.ref);
            console.log('Upload URL:', url);
            await handlePredict(url);
        } catch (error) {
            setIsLoading(false);
            console.error("Error uploading image:", error);
            setFileData(prev => ({
                ...prev,
                errorMessage: 'Failed to upload image. Please try again.'
            }));
        }
    };

    const handlePredict = async (imageURL: string): Promise<void> => {
        try {
            // Use environment variable for API URL, fallback to localhost for development
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: imageURL })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            console.log('Prediction:', data.prediction.name);
            console.log('Description:', data.prediction.description);

            setFinding(data.prediction.name);
            setDescription(data.prediction.description);
            
            // Add a small delay before navigation to ensure state updates are complete
            setTimeout(() => {
                router.push(`/report?result=${encodeURIComponent(data.prediction.name)}&img=${encodeURIComponent(imageURL)}&description=${encodeURIComponent(data.prediction.description)}`);
            }, 100);
        } catch (error) {
            setIsLoading(false);
            console.error('Error occurred while fetching data:', error);
            setFileData(prev => ({
                ...prev,
                errorMessage: 'Failed to process image. Please try again.'
            }));
        }
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center p-8'>
            {isLoading && <Loading />}
            {fileData.errorMessage && (
                <div className="bg-red-500 text-white p-3 mb-3 rounded">
                    {fileData.errorMessage}
                    <button onClick={() => setFileData({ ...fileData, errorMessage: '' })} className="ml-2 font-semibold">Close</button>
                </div>
            )}
            {fileData.previewFile ? (
                <div className='flex-row inline-flex p-3 text-white gap-5 items-start'>
                    <div id="Preview" className="p-3 h-full flex-col justify-center items-center inline-flex gap-5">
                        <div className="flex-col justify-center items-center flex w-[200px] h-[300px]">
                            <Image 
                                src={fileData.previewFile.dataURL} 
                                alt="Preview" 
                                width={200}
                                height={300}
                                className="w-full h-full object-cover bg-white rounded-[10px]" 
                            />
                        </div>
                        <div className='text-white'>
                            <p className='italic'>{fileData.previewFile.name}</p>
                            <p className='text-xs italic'>{formatBytesToMB(fileData.previewFile.size)}</p>
                        </div>
                    </div>
                    <div className='inline-flex flex-col gap-5 items-start justify-around h-full'>
                        <div className='inline-flex flex-col gap-5 items-start justify-start'>
                            <p className='text-xl'>{finding ? finding : "Press Submit and Wait...!"}</p>
                        </div>
                        <div className='inline-flex flex-row gap-5'>
                            <div className='group'>
                                <button 
                                    className="group-hover:bg-slate-700 px-5 py-2.5 text-primary bg-white bg-opacity-80 rounded-[5px] justify-start items-start gap-2.5 inline-flex active:bg-green-700 focus:ring focus:ring-gray-700" 
                                    onClick={deletePreviewFile}
                                >
                                    <div className='group-hover:text-white'>Re-upload</div>
                                </button>
                            </div>
                            <div className='group'>
                                <button 
                                    className="group-hover:bg-slate-700 px-5 py-2.5 text-primary bg-white bg-opacity-80 rounded-[5px] justify-start items-start gap-2.5 inline-flex active:bg-green-700 focus:ring focus:ring-gray-700" 
                                    onClick={uploadImage}
                                >
                                    <div className='group-hover:text-white'>Submit</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    id="DragNDrop" 
                    className={`text-green p-3 h-full w-full flex-col justify-start items-start gap2.5 inline-flex ${isDraggingOver ? 'border-4 border-blue-500' : ''}`} 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop} 
                    onDragLeave={handleDragLeave}
                >
                    <div className="self-stretch grow shrink basis-0 p-2.5 rounded-[10px] border-dotted border-2 border-zinc-300 border-opacity-30 flex-col justify-center items-center gap-5 flex">
                        <Image 
                            src="/upload.png" 
                            alt="Upload" 
                            width={100} 
                            height={100}
                            className="" 
                        />
                        <div className="text-zinc-300 text-opacity-30 text-lg font-normal font-['Inter']">Drag & Drop to Upload Chest X-ray</div>
                        <input
                            id="fileInput"
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => e.target.files?.[0] && checkFileType(e.target.files[0])}
                        />
                        <div className='group'>
                            <button 
                                className="group-hover:bg-slate-700 px-5 py-2.5 text-primary bg-white bg-opacity-80 rounded-[5px] justify-start items-start gap-2.5 inline-flex active:bg-green-700 focus:ring focus:ring-gray-700" 
                                onClick={openFileDialog}
                            >
                                <div className='group-hover:text-white'>Browse</div>
                            </button>
                        </div>
                        <div className="text-zinc-300 text-opacity-30 text-base font-normal font-['Inter']">Supported File formats: .png, .jpeg</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Medexer; 