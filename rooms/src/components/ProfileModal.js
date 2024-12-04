// // ProfileModal.js
// import React, { useState, useRef } from "react";
// import { PencilIcon, XIcon, UserIcon } from "@heroicons/react/outline";
// import { getAuth } from 'firebase/auth';
// import { getDatabase, ref, set, child, get } from 'firebase/database';
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { ProgressSpinner } from "primereact/progressspinner";
// import { Toast } from "primereact/toast";


// const ProfileModal = ({ 
//     toggleModal,
//     initialUsername, 
//     initialBio, 
//     initialImage  }) => {
//   const [username, setUsername] = useState(initialUsername); // Placeholder for actual username
//   const [bio, setBio] = useState(initialBio); // Placeholder for actual bio
//   const [image, setImage] = useState(initialImage); // Placeholder for actual profile image
//   const [imagePreview, setImagePreview] = useState(initialImage); // For displaying image preview
//   const [isSubmitting, setIsSubmitting] = useState(false);


//   const toast = useRef(null);

//   const showToast = (severity, summary, detail) => {
//     toast.current.show({ severity, summary, detail });
//   };


//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     if (file.size > 4 * 1024 * 1024) {
//       console.error('File size is beyond 4 MB.');
//       // Display error message to user
//       showToast("error", "Error", "File size is beyond 4 MB.");

//       return;
//     }

//     const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

//     if (!validTypes.includes(file.type)) {
//       console.error('Invalid file type. Only PNG, JPG, JPEG are allowed.');
//       showToast("error", "Error", "Invalid file type. Only PNG, JPG, JPEG are allowed.");

//       // Display error message to user
//       return;
//     }

//     if (file) {
//       setImage(file); // Set the actual File object to state
//       setImagePreview(URL.createObjectURL(file)); // Create and set the URL for preview
//     }
//   };
  

 
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true); // Start submitting

//     const auth = getAuth();
//     const database = getDatabase();
//     const storage = getStorage();
  
//     // Get the current user's ID
//     const userId = auth.currentUser.uid;
  
//     let imageUrl = image; // Default to the existing image URL or null
  
//     // Upload new profile image to Firebase Storage
//     if (image && image instanceof File) {
//       const imageRef = storageRef(storage, `profileImages/${userId}/${image.name}`);
//       try {
//         const snapshot = await uploadBytes(imageRef, image);
//         imageUrl = await getDownloadURL(snapshot.ref);
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         showToast("error", "Error", "Error uploading file.");
//         setIsSubmitting(false); // Stop submitting

//         return;
//       }
//     }
  
//     // Check for updates and update Firebase Realtime Database
//     if (username !== initialUsername || bio !== initialBio || imageUrl !== initialImage) {
//       try {
//         // Check if username is unique and different from the initial one
//         if (username !== initialUsername) {
//           const usernameRef = child(ref(database), 'usernames/' + username);
//           const usernameSnapshot = await get(usernameRef);
//           if (usernameSnapshot.exists() && usernameSnapshot.val() !== userId) {
//             console.error('Username already taken.');
//             showToast("error", "Error", "Username already taken.");

//             setIsSubmitting(false); // Stop submitting

//             return;
//           }
  
//           // Delete the old username entry if it has been changed
//           if (initialUsername) {
//             const oldUsernameRef = child(ref(database), 'usernames/' + initialUsername);
//             await set(oldUsernameRef, null);
//           }
  
//           // Update username mapping with the new username
//           await set(usernameRef, userId);
//         }
  
//         // Update user's profile in the database
//         await set(ref(database, `users/${userId}`), {
//           username: username || initialUsername,
//           bio: bio || initialBio,
//           profileImageUrl: imageUrl
//         });
  
//         console.log('Profile updated successfully.');
//         toggleModal(); // Close the modal on successful update
//       } catch (error) {
//         console.error('Error updating profile:', error);
//         showToast("error", "Error", "Error updating profile.");


//       }
//     } else {
//       toggleModal(); // Close the modal if no changes were made
//     }
//     setIsSubmitting(false); // Stop submitting

//   };
  
  
  
  

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//             <Toast ref={toast} position="top-center" />

//       <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
//         <div className="flex justify-end">
//           <button onClick={toggleModal} className="text-gray-600 hover:text-gray-800">
//             <XIcon className="h-6 w-6" />
//           </button>
//         </div>
//         <div className="mt-3 text-center">
//         <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Profile</h3>

//           <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
//             {imagePreview ? (
//               <img className="rounded-full h-full w-full" src={imagePreview} alt="Profile" />
//             ) : (
//               <UserIcon className="h-12 w-12 text-green-600" />
//             )}
//           </div>
//           <input
//             type="file"
//             onChange={handleImageChange}
//             className="mt-2 text-sm text-gray-600"
//           />
//           {/* Profile Edit Form */}
//           <form onSubmit={handleSubmit} className="mt-2 px-4 pb-4">
//             {/* Username Field */}
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
//             />
//             {/* Bio Field */}
//             <textarea
//               placeholder="Short bio"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className="mt-2 px-4 py-2 bg-gray-100 w-full rounded-md"
//             />
//             <div className="items-center px-4 py-3">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
//               >
//                  {isSubmitting ? (
//               <ProgressSpinner
//                 style={{ width: "50px", height: "50px" }}
//                 strokeWidth="8"
//                 fill="var(--surface-ground)"
//                 animationDuration=".5s"
//               />
//             ) : (
//               "Save changes"
//             )}
                
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileModal;
