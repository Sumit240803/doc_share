"use client"
import { useRouter } from "next/navigation";
import useAuth from "@/app/utils/userAuth";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { storage } from "@/app/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useParams } from "next/navigation";
import { updateProfile } from "firebase/auth"
import { MdEdit } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
const Spinner = () => {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
    </div>
  );
};
const updateMyProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState('');
  const [image, setImage] = useState('');
  const { isAuthenticated, authInitialized } = useAuth();
  const[showInput , setShowInput] = useState(false);
  const params = useParams();
  const [isLoading , setIsLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated && authInitialized) { // check if authentication is initialized
      router.push("/");
    }
  }, [isAuthenticated, authInitialized, router]);
  const fetchData = async () => {
    setIsLoading(true);
    const docRef = doc(db, "users", params.users);
    const docSnap = await getDoc(docRef);
    setIsLoading(false);
    return docSnap.data();
  };
  const handleImageState = (event) => {
    setImage(event.target.files[0]);
    console.log(image)
  }
  const handleImage = async () => {
    if (image) {
      const storageref = ref(storage, `${params.users}/images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageref, image);

      try {
        // Wait for upload to complete
        await uploadTask;

        // Get the download URL of the uploaded image
        const imgUrl = await getDownloadURL(storageref);

        // Update the user's profile photoURL
        await updateProfile(auth.currentUser, {
          photoURL: imgUrl
        });

        console.log("Profile photo updated successfully!");
      } catch (error) {
        console.error("Error updating profile photo:", error);
      }
    }
  };
  const updateNameInDatabase = async (newName) => {
    try {
      const docRef = doc(db, "users", params.users);
      await updateDoc(docRef, { name: newName });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };
  const updateContactInDatabase = async (newContact) => {
    try {
      const docRef = doc(db, "users", params.users);
      await updateDoc(docRef, { contact: newContact });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };
  const updateAgeInDatabase = async (newAge) => {
    try {
      const docRef = doc(db, "users", params.users);
      await updateDoc(docRef, { age: newAge });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleEditClick = async (fieldName) => {
    let newValue = prompt(`Enter new ${fieldName}:`);
    if (newValue !== null) {
      switch (fieldName) {
        case 'name':
          await updateNameInDatabase(newValue);
          break;
        case 'contact':
          await updateContactInDatabase(newValue);
          break;
        case 'age':
          await updateAgeInDatabase(newValue);
        // Add cases for other fields as needed
        default:
          break;
      }
      // Fetch updated user data after updating fields in the database
      const updatedUserData = await fetchData();
      setUserData(updatedUserData);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await fetchData();
      setUserData(user); // Set the fetched user data in state
    };
    fetchUserData();
  }, [params.users]);
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
  <div className="text-center">
    {isLoading && (
    <Spinner/>
  )
}
    {auth.currentUser && auth.currentUser.photoURL && (
      <div className="mb-4">
        <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden mx-auto">
          <img className="w-full h-full object-cover" src={auth.currentUser.photoURL} alt="Profile" />
        </div>
        {!showInput && (
          <div className="flex justify-center">
            <FaUserEdit className='cursor-pointer text-2xl' onClick={() => setShowInput(true)} />
          </div>
        )}
        {showInput && (
          <div>
            <input type="file" accept=".png,.jpg,.jpeg" id="image_input" className="rounded-lg appearance-none text-transparent" onChange={handleImageState} />
            <button className="rounded-full bg-black text-white p-2" onClick={() => {setShowInput(false); handleImage()}}>Upload Image</button>
          </div>
        )}
      </div>
    )}
    {userData && (
      <div className="w-64 mx-auto"> {/* Set a fixed width and center the container */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-full p-2 mb-2">
            <span>Name:</span>
            <h2 className="text-lg font-semibold">{userData.name}</h2>
            <MdEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditClick('name')} />
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-full p-2 mb-2">
            <span>Contact</span>
            <p>{userData.contact}</p>
            <MdEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditClick('contact')} />
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-full p-2">
            <span>Age</span>
            <p>{userData.age}</p>
            <MdEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditClick('age')} />
          </div>
        </div>
      </div>
    )}
  </div>
</div>




  )
}

export default updateMyProfile












/* 
  const trueId = useCurrentUserId();
  const path = usePathname();
  const parts = path.split("/"); // Split the path by "/"
  const id = parts[parts.length - 2]; // Get the second-to-last element, which represents the ID
  console.log(trueId);
  console.log(id);
  if(trueId !== id){
    router.push("/")
  }*/