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
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  // Load faceapi models
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
  }, []);

  // Fetch user face data for face matcher
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
            `https://hris-api.ptspsi.co.id/api/company-user/${user.companies_users_id}`,
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
            const matcher = new faceapi.FaceMatcher([labeledFaceDescriptor], 0.6);
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

  // Handle face recognition
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
            onSuccess();
            stopCamera(); // Stop camera after success
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      setError("Gagal mengakses kamera.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    } else {
      console.log("No media stream found.");
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start the camera stream and handle cleanup on unmount
  useEffect(() => {
    startCamera();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
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
