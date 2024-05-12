'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion,onSnapshot } from "firebase/firestore";
import { db, storage } from "@/app/firebase-config";
import Link from "next/link";
import useAuth from "@/app/utils/userAuth";
import { useRouter } from "next/navigation";
import { getDownloadURL, getMetadata, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { auth } from "@/app/firebase-config";
const Page = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { isAuthenticated, authInitialized } = useAuth();
  const params = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && authInitialized) {
      router.push("/");
    }
  }, [isAuthenticated, authInitialized, router]);

  const fetchData = async () => {
    const docRef = doc(db, "users", params.users);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const handleUpload = async () => {
    if (file) {
      const id = params.users;
      const storageRef = ref(storage, `${id}/documents/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        async () => {
          try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, {
              govt_doc: arrayUnion(file.name),
            });
            setFile(null);
            setUploadProgress(0);
          } catch (error) {
            console.error("Error updating document: ", error);
          }
        }
      );
    }
  }

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.log(error)
    }
  }

  const fetchImage = async () => {
    const storageRef = ref(storage,`${params.users}/images`);
    try {
      const imageList = await listAll(storageRef);
      if(imageList.items.length > 0) {
        const firstImage = imageList.items[0];
        const imgUrl = await getDownloadURL(firstImage);
        return imgUrl;
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getImage = async () => {
      const userImage = await fetchImage();
      setImage(userImage);
    };
    getImage();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await fetchData();
      setUserData(user);
    };
    fetchUserData();
  }, [params.users]);
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", params.users);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };

    const unsubscribe = onSnapshot(doc(db, "users", params.users), (doc) => {
      setUserData(doc.data());
    });

    fetchData();

    return () => unsubscribe();
  }, [params.users]);

  return (
    <div className="flex flex-col h-screen ">
      {userData ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between bg-gray-950 text-white font-bold h-20 px-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full border-2 border-gray-300 overflow-hidden">
                {image ? (
                  <img className="w-full h-full object-cover" src={image} alt="Profile Picture" />
                ) : (
                  <img className="w-full h-full bg-gray-300" src='user.jpg'/> // Placeholder or loading spinner
                )}
              </div>
              <div className="ml-3">
                Welcome {userData.name}
              </div>
            </div>
            <div className="flex space-x-6">
              <Link href={`/myapp/protected/profile/${params.users}/updateMyProfile`} className="hover:underline">Profile</Link>
              <button onClick={handleLogOut} className="hover:underline">Logout</button>
            </div>
          </div>

          <h1 className="text-center mt-4 text-xl font-bold">Your Documents</h1>
          <div className="flex flex-wrap justify-center flex-1">
            {userData.govt_doc.map((document, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 ">
                <Link href={''} className="max-w-sm p-6 border border-gray-200 rounded-lg shadow block bg-gradient-to-t from-slate-900 to-red-900">
                  <h5 className="mb-2 text-2xl font-bold  text-white tracking-tight overflow-hidden overflow-ellipsis whitespace-nowrap  dark:text-white">{document}</h5>
                </Link>
              </div>
            ))}
          </div>
          <footer className="flex items-center justify-center bg-gray-950 p-4">
            <div className="flex flex-col w-full md:w-80">
              <label className="block mb-2 text-sm font-medium text-white" htmlFor="file_input">Upload file</label>
              <input className="block w-full text-sm text-gray-900 border border-gray-300 py-3 px-4 rounded-lg bg-gray-50" id="file_input" type="file" onChange={handleFileChange} />
              <button className="mt-2 bg-gray-900 rounded-lg text-bold text-white py-1 px-4" onClick={handleUpload}>Save</button>
              <div className="mt-2 bg-gray-400 h-4 rounded-lg">
                <div className="bg-red-500 h-full rounded-lg" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <p className="flex items-center justify-center h-full">Loading... If taking time please login again with correct credentials <Link href={'/'} className="text-blue-800">Click Here to login</Link> </p>
      )}
    </div>
  );
};

export default Page;
