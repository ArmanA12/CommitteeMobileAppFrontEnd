import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import FormData from 'form-data';
import Loader from '../components/Loader'
import * as ImageManipulator from 'expo-image-manipulator';


const UploadProfileImage = ({ onClose, userID }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required.');
      return;
    }
  
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1, // Keep high quality initially
    });
  
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const originalUri = pickerResult.assets[0].uri;
  
      try {
        // Compress the image
        const compressedImage = await ImageManipulator.manipulateAsync(
          originalUri,
          [{ resize: { width: 800 } }],   
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } 
        );
  
        setSelectedImage(compressedImage.uri); 
      } catch (error) {
        console.error('Error compressing image:', error);
        Alert.alert('Error', 'Failed to process the image.');
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('userID', userID); 
    formData.append('profilePic', {
      uri: selectedImage,
      name: 'profile.jpg', 
      type: 'image/jpeg', 
    });
  
    try {
      const response = await axios.post('https://committee-mobile-app-backend.vercel.app/api/v1/auth/uploadMemberProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });  
        Alert.alert('Success', response.data.message);
    } catch (error) {
      Alert.alert('Error', 'Error while uploading profile picture.');
    } finally {
      setIsLoading(false);
      onClose(); 
    }
  };

  










  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Upload Profile Image</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageUploadContainer}>
            <View style={styles.imagePreview}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.image} />
              ) : (
                <AntDesign name="clouduploado" size={104} color="#b3b3b3" />
              )}
            </View>
            <Text style={styles.supportedText}>File Supported: JPG, PNG</Text>
            <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
              <AntDesign name="reload1" size={24} color="#737373" />
              <Text style={styles.buttonText}>CHOOSE IMAGE</Text>
            </TouchableOpacity>

            {selectedImage && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.uploadButtonText}>
                    <Loader />
                  </Text>
                ) : (
                  <>
                    <AntDesign name="upload" size={24} color="#737373" />
                    <Text style={styles.uploadButtonText}>&nbsp;&nbsp;UPLOAD IMAGE</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '55%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#737373',
    letterSpacing: 2,
  },
  imageUploadContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: 'rgba(0,0,0,0.5)',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 10,
  },
  imagePreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  supportedText: {
    textAlign: 'center',
    color: '#b3b3b3',
    letterSpacing: 2,
    marginBottom: 20,
  },
  pickImageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderStyle: 'dashed',
  },
  buttonText: {
    color: '#737373',
    marginLeft: 10,
    fontSize: 16,
    letterSpacing: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#008080',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#737373',
    fontSize: 16,
    letterSpacing: 2,
  },
});

export default UploadProfileImage;
