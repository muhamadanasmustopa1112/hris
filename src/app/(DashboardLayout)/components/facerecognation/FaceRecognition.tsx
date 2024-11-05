import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

interface FaceRecognitionProps {
  userId: number;
  onSuccess: () => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ userId, onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null); // Simpan referensi stream

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  // Load face recognition models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (err) {
        setError("Gagal memuat model pengenalan wajah.");
        console.error(err);
      }
    };

    loadModels();
  }, [basicAuth]);

  // Fetch user face data from database and create face matcher
  useEffect(() => {
    if (modelsLoaded) {
      const fetchUserPhoto = async () => {
        try {
          const userCookie = Cookies.get("user");
          const user = userCookie ? JSON.parse(userCookie) : null;

          if (!user || !user.company_id) {
            setError("Tidak ada data karyawan");
            return;
          }

          const response = await axios.get(
            `https://backend-apps.ptspsi.co.id/api/company-user/${user.companies_users_id}`,
            {
              headers: {
                'Authorization': `Basic ${basicAuth}`
              },
            }
          );
          const userPhotoUrl = response.data.data.foto_karyawan;
          const img = await faceapi.fetchImage(userPhotoUrl);
          const userDescriptor = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (userDescriptor) {
            const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(
              user.name,
              [userDescriptor.descriptor]
            );
            const matcher = new faceapi.FaceMatcher([labeledFaceDescriptor], 0.6); // Create matcher with threshold
            setFaceMatcher(matcher);
          } else {
            setError("Wajah tidak terdeteksi dari foto database.");
          }
        } catch (err) {
          setError("Gagal mengambil foto pengguna dari database.");
          console.error(err);
        }
      };

      fetchUserPhoto();
    }
  }, [modelsLoaded, userId, basicAuth]);

  // Perform face recognition by comparing live camera feed with database face descriptor
  const handleRecognition = async () => {
    if (videoRef.current && faceMatcher) {
      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.label !== "unknown") {
            onSuccess(); // If face matches, trigger success callback
            console.log("Face matched:", bestMatch.label);
            // Stop the camera
            stopCamera();
          } else {
            setError("Wajah tidak cocok.");
          }
        } else {
          setError("Wajah tidak terdeteksi, coba lagi.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memproses pengenalan wajah.");
        console.error(err);
      }
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
  };

  // Start camera on mount
  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
          setMediaStream(stream);
        })
        .catch(() => {
          setError("Gagal mengakses kamera.");
        });
    }
  }, [basicAuth]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}
    >
      <Typography variant="h6">Pengenalan Wajah</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <video ref={videoRef} autoPlay muted width="300" height="300" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRecognition}
        sx={{ mt: 2 }}
        disabled={!modelsLoaded}
      >
        Cek Wajah
      </Button>
    </Box>
  );
};

export default FaceRecognition;
