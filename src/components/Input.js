import React, { useState, useContext } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebase'
import { v4 as uuid } from "uuid"


const Input = () => {

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  // const handleSend = async () => {
  //   if(image) {

  //     const storage = getStorage();
  //     const storageRef = ref(storage, uuid());
  
  //     const uploadTask = uploadBytesResumable(storageRef, image);
  
  //     uploadTask.on( 
  //       (error) => {
  //         console.log(error);
  //       }, 
  //       () => {

  //         getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
  
  //           await updateDoc( doc(db, "chats", data.chatId), {
  //             messages: arrayUnion({
  //               id : uuid(),
  //               text,
  //               senderId : currentUser.uid,
  //               date : Timestamp.now(),
  //               img : downloadURL
  //             })
  //           });
  //         });
  //       }
  //     );
      
  //    } else {
  //       await updateDoc( doc(db, "chats", data.chatId), {
  //         messages: arrayUnion({
  //           id : uuid(),
  //           text,
  //           senderId : currentUser.uid,
  //           date : Timestamp.now(),
  //         }),
  //     });
  // }


  // await updateDoc(doc(db, "userChats", currentUser.uid), {
  //   [data.chatId + ".lastMessage"]: {
  //     text,
  //   },
  //   [data.chatId + ".date"]: serverTimestamp(),
  // });

  // await updateDoc(doc(db, "userChats", data.user.uid), {
  //   [data.chatId + ".lastMessage"]: {
  //     text,
  //   },
  //   [data.chatId + ".date"]: serverTimestamp(),
  // });

  //    setText("");
  //    setImage(null);
     
  // }


  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL)
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
    <input
      type="text"
      placeholder="Type something..."
      onChange={ (e) => setText(e.target.value) }
      value={text}
    />
    <div className="send">
      <img src={ Attach } alt="" />
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={ (e) => setImg(e.target.files[0]) }
      />
      <label htmlFor="file">
        <img src={Img} alt="" />
      </label>
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  )
}

export default Input