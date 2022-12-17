import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
//import db from "../lib/firebase";
import db from "../lib/firebase";
import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

//const app = initializeApp(firebaseConfig);

const AddNewPost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  const [uid, setUID] = useState("");
  const [isSaving, setSaving] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUID(user.uid);
        // ...
      } else {
      }
    });
  });
  const handleSubmit = async () => {
    //const db = getFirestore(app);
    console.log("db", db);
    setSaving(true);
    const date = new Date();

    /*  try {
      const docRef = await addDoc(collection(db, "posts"), {
        message: todo,    
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } */
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title,
        userID: uid,
        description: description,
        imageUpload: imageUpload,
        upVotesCount: 0,
        downVotesCount: 0,
        createdAt: date.toUTCString(),
        updatedAt: date.toUTCString(),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    /*        await db.collection("posts").add({
        title,
        upVotesCount: 0,
        downVotesCount: 0,
        createdAt: date.toUTCString(),
        updatedAt: date.toUTCString(),
      }); */

    onClose();
    setTitle("");
    setDescription("");
    setImageUpload("");

    setSaving(false);
  };

  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="green" size="xxlg">
        Add new post
      </Button>

      <Modal onClose={onClose} size="xl" isOpen={isOpen} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Add new post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired id="post-title">
                <FormLabel>Post title</FormLabel>
                <Input
                  type="post-title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired id="post-description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  type="post-description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl id="post-imageupload">
                <FormLabel>Image Upload</FormLabel>
                <input
                  type="file"
                  alt="No image"
                  value={imageUpload}
                  onChange={(e) => setImageUpload(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={4}>
                <Button onClick={onClose}>Close</Button>
                <Button
                  onClick={handleSubmit}
                  colorScheme="blue"
                  disabled={!title.trim() && !description.trim()}
                  isLoading={isSaving}
                >
                  Save
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default AddNewPost;
