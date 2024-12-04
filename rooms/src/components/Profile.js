// import React, { useState, useEffect, useRef } from "react";
// import {
//   DotsVerticalIcon,
//   XIcon,
//   HomeIcon,
//   UserIcon,
//   TrashIcon, // Import Trash Icon
// } from "@heroicons/react/outline";
// import Navigation from "./Navigation";
// import ProfileModal from "./ProfileModal";
// import {
//   getAuth,
//   signOut,
//   updateEmail,
//   reauthenticateWithCredential,
//   sendEmailVerification,
//   EmailAuthProvider,
//   updatePassword,
// } from "firebase/auth";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   push,
//   set,
//   equalTo,
//   query,
//   orderByChild,
// } from "firebase/database";
// import { Dialog } from "primereact/dialog"; // Import Dialog from PrimeReact
// import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";
// import { ProgressSpinner } from "primereact/progressspinner";
// import { Toast } from "primereact/toast";
// import { MailIcon, LockClosedIcon, CogIcon ,PencilIcon} from "@heroicons/react/solid";
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";
// import { format } from "date-fns"; // Import format from date-fns for date formatting

// function Profile() {
//   const [isNavOpen, setIsNavOpen] = useState(false);
//   const [activeLink, setActiveLink] = useState("Home"); // State to track the active link
//   const [profileImage, setProfileImage] = useState(null);
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const navigate = useNavigate();
//   const toast = useRef(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [isSubmittingEmailChange, setIsSubmittingEmailChange] = useState(false);

//   const [isSubmittingPasswordChange, setIsSubmittingPasswordChange] =
//     useState(false);
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

//   const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for showing delete confirmation dialog
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//   const [isMenuVisibleRooms, setIsMenuVisibleRooms] = useState(false);


//   const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
//   const auth = getAuth();
//   const [email, setEmail] = useState("");

//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const userId = auth.currentUser.uid;
//   const database = getDatabase();

//   // Include userId in the dependency array

//   useEffect(() => {
//     const database = getDatabase();
//     const userRef = ref(database, `users/${userId}`);
  
//     // Fetch user profile data
//     const unsubscribeUserProfile = onValue(userRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setProfileImage(data.profileImageUrl || null);
//         setUsername(data.username || "");
//         setBio(data.bio || "");
//       }
//     });
  
//     // Corrected query for user's rooms
//     const userRoomsRef = query(
//       ref(database, "rooms"),
//       orderByChild("createdBy"),
//       equalTo(userId)
//     );
  
//     // Fetch user's rooms
//     // Fetch and sort user's rooms
//   const unsubscribeUserRooms = onValue(userRoomsRef, (snapshot) => {
//     const roomsData = snapshot.val();
//     if (roomsData) {
//       const roomsArray = Object.keys(roomsData)
//         .map((key) => ({
//           id: key,
//           ...roomsData[key],
//         }))
//         .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // Sort by createdAt in descending order

//       setRooms(roomsArray);
//     }
//   });
  
//     // Return a cleanup function that unsubscribes from both listeners
//     return () => {
//       unsubscribeUserProfile();
//       unsubscribeUserRooms();
//     };
//   }, [userId]); // Include userId in the dependency array
  

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return format(date, "MMM do, yyyy h:mm a"); // Example: 'Nov 12th, 2023 4:30 PM'
//   };

//   const toggleImageModal = () => {
//     setShowImageModal(!showImageModal);
//   };

//   // Function to toggle the custom menu visibility
//   const toggleMenu = () => {
//     setIsMenuVisible((prev) => !prev);
//   };

//   const toggleMenuRooms = () => {
//     setIsMenuVisibleRooms((prev) => !prev);
//   };

//   const toggleChangeEmailModal = () => {
//     setShowChangeEmailModal(!showChangeEmailModal);
//   };

//   const toggleChangePasswordModal = () => {
//     setShowChangePasswordModal(!showChangePasswordModal);
//   };

//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   const isValidEmail = (email) => {
//     // Simple regex for basic email validation
//     const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     return re.test(email);
//   };

//   const menuItemsWithIcons = [
//     {
//       label: "Change Email",
//       icon: MailIcon,
//       action: "changeEmail",
//     },
//     {
//       label: "Change Password",
//       icon: LockClosedIcon,
//       action: "changePassword",
//     },
//     // ... add other menu items with icons here
//   ];


//   const menuItemsWithIconsRooms = [
//     {
//       label: "Edit Room",
//       icon: PencilIcon,
//       action: "editroom",
//     },
//     {
//       label: "Delete Room",
//       icon: TrashIcon,
//       action: "deleteroom",
//     },
//     // ... add other menu items with icons here
//   ];

//   // Custom menu items
//   const handleMenuClick = (action) => {
//     setIsMenuVisible(false); // Hide the menu
//     if (action === "changeEmail") {
//       toggleChangeEmailModal();
//     } else if (action === "changePassword") {
//       toggleChangePasswordModal();
//     }
//     else if(action === 'editroom'){
//       console.log('edit room');
//       toggleMenuRooms();
//     }
//     else if(action === 'deleteroom'){
//       console.log('delete room');
//       toggleMenuRooms();
//     }
//   };

//   const handleChangeEmail = async (event) => {
//     event.preventDefault();

//     const auth = getAuth();
//     const user = auth.currentUser;
//     setIsSubmittingEmailChange(true); // Start submitting

//     if (!isValidEmail(email)) {
//       console.error("Please enter a valid email address.");

//       showToast("error", "Error", "Please enter a valid email address.");

//       // Inform the user or show some error message
//       setIsSubmittingEmailChange(false); // Start submitting

//       return;
//     }

//     try {
//       await updateEmail(user, email);
//       await sendEmailVerification(user); // Send a verification email to the new address
//       showToast(
//         "success",
//         "Success",
//         "Verification email sent. Please verify your new email."
//       );
//     } catch (error) {
//       console.error("Error updating email:", error);
//       showToast("error", "Error", error.message);
//     }
//     setIsSubmittingEmailChange(false); // Start submitting
//   };

//   const handleChangePassword = async (event) => {
//     setIsSubmittingPasswordChange(true);

//     event.preventDefault();
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (newPassword !== confirmNewPassword) {
//       showToast("error", "Error", "New passwords do not match.");
//       setIsSubmittingPasswordChange(false);
//       return;
//     }

//     // Re-authenticate user
//     const credential = EmailAuthProvider.credential(user.email, oldPassword);
//     try {
//       await reauthenticateWithCredential(user, credential);
//     } catch (error) {
//       console.error("Re-authentication failed:", error);
//       showToast("error", "Error", "Current password is incorrect.");
//       setIsSubmittingPasswordChange(false);
//       return;
//     }

//     // Update password
//     try {
//       await updatePassword(user, newPassword);
//       showToast(
//         "success",
//         "Success",
//         "Password updated successfully. Please log in again."
//       );

//       // Log the user out or force re-authentication
//       await signOut(auth);
//       navigate("/login"); // Redirect to login page
//     } catch (error) {
//       console.error("Error updating password:", error);
//       showToast("error", "Error", "Failed to update password.");
//     }
//     setIsSubmittingPasswordChange(false);
//   };

//   // Function to render menu items with icons
//   const renderMenuItem = (item, index) => (
//     <a
//       href="#"
//       key={index}
//       onClick={() => handleMenuClick(item.action)}
//       className="flex items-center px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
//     >
//       <item.icon className="mr-3 h-5 w-5" />
//       {item.label}
//     </a>
//   );

//   const confirmDelete = () => {
//     setShowDeleteDialog(true);
//   };

//   const showToast = (severity, summary, detail) => {
//     toast.current.show({ severity, summary, detail });
//   };

//   // Function to handle the deletion of the profile image
//   const handleDeleteProfileImage = async () => {
//     const userId = auth.currentUser.uid;
//     const database = getDatabase();

//     try {
//       await set(ref(database, `users/${userId}/profileImageUrl`), null);
//       setProfileImage(null); // Update local state
//       console.log("Profile image deleted successfully.");
//       showToast("success", "Error", "Profile image deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting profile image:", error);
//       showToast("error", "Error", "Error deleting profile image.");
//     }

//     setShowDeleteDialog(false); // Close the dialog after deleting
//   };

//   const handleLogout = async () => {
//     setIsSubmitting(true); // Start submitting

//     try {
//       await signOut(auth);
//       navigate("/login"); // Adjust the path as per your route setup

//       // Here you can redirect the user to the login page or perform other actions post-logout
//     } catch (error) {
//       console.error("Logout failed:", error);
//       showToast("error", "Error", "Logout failed.");

//       // Handle logout error (e.g., display an error message to the user)
//     }
//     setIsSubmitting(false); // Stop submitting
//   };

//   const deleteDialogFooter = (
//     <div className="flex justify-between">
//       <Button
//         label="No"
//         icon="pi pi-times"
//         onClick={() => setShowDeleteDialog(false)}
//         className="p-button-text bg-green-500 text-white" // Added bg-green-500 for green background
//       />
//       <Button
//         label="Yes"
//         icon="pi pi-check"
//         onClick={handleDeleteProfileImage}
//         className="bg-red-500 text-white" // Added bg-red-500 for red background
//         autoFocus
//       />
//     </div>
//   );

//   const toggleModal = () => {
//     setShowModal(!showModal);
//   };

//   return (
//     <div className="relative bg-white h-screen ">
//       <Navigation activeLink={activeLink} setActiveLink={setActiveLink} />

//       {/* Main Content */}
//       <div className="container mx-auto p-2 ">
//         <Toast ref={toast} position="top-center" />

//         <div className="flex flex-wrap justify-center items-start">
//           {/* Profile Card */}
//           <div className="w-4/5 md:w-1/4 p-4 bg-gray-100 text-center rounded-lg shadow-md mb-4 md:mb-0 md:mr- ml-0 relative">
//             <div className="relative">
//               <CogIcon
//                 className="h-6 w-6 text-gray-500 cursor-pointer absolute top-0 right-0 m-2"
//                 onClick={toggleMenu}
//               />
//               {/* Conditionally render the menu when the cog icon is clicked */}
//               {isMenuVisible && (
//                 <div className="absolute right-0 mt-8 py-2 w-48 bg-white rounded-md shadow-xl z-20">
//                   {menuItemsWithIcons.map(renderMenuItem)}
//                 </div>
//               )}
//             </div>

//             {profileImage ? (
//               <div className="relative inline-block">
//                 {" "}
//                 {/* Container div */}
//                 <img
//                   src={profileImage}
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full"
//                   onClick={toggleImageModal}
//                 />
//                 <TrashIcon
//                   className="h-6 w-6 text-red-500 cursor-pointer absolute bottom-0 right-0 mb-1 ml-1"
//                   onClick={confirmDelete}
//                 />
//               </div>
//             ) : (
//               <UserIcon className="w-32 h-32 text-gray-400 mx-auto" />
//             )}

//             <h3 className="text-center text-xl mt-2 font-bold">{username}</h3>
//             <p className="text-center text-gray-700">{bio}</p>
//             <div className="flex justify-around mt-4">
//               <button
//                 onClick={toggleModal}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Edit Profile
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 {isSubmitting ? (
//                   <ProgressSpinner
//                     style={{ width: "50px", height: "50px" }}
//                     strokeWidth="8"
//                     fill="var(--surface-ground)"
//                     animationDuration=".5s"
//                   />
//                 ) : (
//                   "Logout"
//                 )}
//               </button>
//             </div>
//           </div>
//           {/* Rooms List */}

//           <div className="w-full md:max-w-2xl  pl-16 pr-4 pb-4  md:mr-40">
//             {rooms.map((room) => (
//               <div
//                 key={room.id}
//                 className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mb-4 relative"
//               >
                
//                 <DotsVerticalIcon
//                 className="h-6 w-6 text-gray-500 cursor-pointer absolute top-0 right-0 m-2"
//                 onClick={toggleMenuRooms}
//               />

//               {/* Conditionally render the menu when the cog icon is clicked */}
//               {isMenuVisibleRooms && (
//                 <div className="absolute right-0 mt-8 py-2 w-48 bg-white rounded-md shadow-xl z-20">
//                   {menuItemsWithIconsRooms.map(renderMenuItem)}
//                 </div>
//               )}

//                 <h3 className="text-lg font-bold">{room.title}</h3>
//                 {room.imageUrl ? (
//                   <img
//                     src={room.imageUrl}
//                     alt="Room Thumbnail"
//                     className="w-full h-64 rounded-md my-2 object-cover"
//                   />
//                 ) : (
//                   <HomeIcon className="w-full h-64 text-gray-400 mx-auto" />
//                 )}
//                 <p className="break-words">{room.description}</p>

//                 <div className="flex justify-between items-center mt-2">
//                   <span>Participants: {room.participants}</span>
//                   <span>{formatDate(room.createdAt)}</span>

//                   {/* Format date */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Profile Edit Modal */}
//       {showModal && (
//         <ProfileModal
//           toggleModal={toggleModal}
//           initialUsername={username}
//           initialBio={bio}
//           initialImage={profileImage}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         header="Confirm Delete"
//         visible={showDeleteDialog}
//         style={{ width: "30vw" }}
//         footer={deleteDialogFooter}
//         onHide={() => setShowDeleteDialog(false)}
//       >
//         <p>Are you sure you want to delete your profile picture?</p>
//       </Dialog>

//       {showImageModal && (
//         <div className="fixed inset-0  h-1/3 w-1/3 z-50">
//           <div className="relative" style={{ top: "70px", left: "10px" }}>
//             <div className="bg-white p-5 rounded-lg shadow-lg">
//               <img
//                 src={profileImage}
//                 alt="Profile enlarged"
//                 className=" object-cover rounded-lg"
//                 // Set a larger size for the modal image
//               />
//               <button
//                 onClick={toggleImageModal}
//                 className="text-gray-600 hover:text-gray-800 absolute top-0 right-0 m-2"
//               >
//                 <XIcon className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showChangeEmailModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-5 rounded-lg shadow-lg w-3/4 md:w-1/2">
//             <h2 className="text-lg font-bold mb-4">Change Email</h2>
//             <form onSubmit={handleChangeEmail} className="space-y-4">
//               <input
//                 type="email"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                 placeholder="New Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 // State and onChange handler
//               />
//               <div className="flex justify-end mt-4">
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
//                   onClick={toggleChangeEmailModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded"
//                 >
//                   {isSubmittingEmailChange ? (
//                     <ProgressSpinner
//                       style={{ width: "50px", height: "50px" }}
//                       strokeWidth="8"
//                       fill="var(--surface-ground)"
//                       animationDuration=".5s"
//                     />
//                   ) : (
//                     "Update Email"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showChangePasswordModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-5 rounded-lg shadow-lg w-3/4 md:w-1/2">
//             <h2 className="text-lg font-bold mb-4">Change Password</h2>
//             <form onSubmit={handleChangePassword} className="space-y-4">
//               <input
//                 type="password"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                 placeholder="Current Password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 required

//                 // State and onChange handler for current password
//               />

//               <input
//                 type="password"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 // State and onChange handler for new password
//               />
//               <input
//                 type="password"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                 placeholder="Confirm New Password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 required
//                 // State and onChange handler for confirming new password
//               />
//               <div className="flex justify-end mt-4">
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
//                   onClick={toggleChangePasswordModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded"
//                 >
//                   {isSubmittingPasswordChange ? (
//                     <ProgressSpinner
//                       style={{ width: "50px", height: "50px" }}
//                       strokeWidth="8"
//                       fill="var(--surface-ground)"
//                       animationDuration=".5s"
//                     />
//                   ) : (
//                     "Update Password"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;
