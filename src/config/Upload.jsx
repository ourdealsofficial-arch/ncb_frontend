import React, { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";

export default function DragUpload() {
  // Firebase Configuration - Replace with your actual config
  const firebaseConfig = {
    apiKey: "AIzaSyD-your-actual-api-key-here",
    authDomain: "linkosmv3.firebaseapp.com",
    projectId: "linkosmv3",
    storageBucket: "linkosmv3.appspot.com",
    messagingSenderId: "123456789", // Your actual sender ID
    appId: "1:123456789:web:your-app-id-here"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [authState, setAuthState] = useState("initializing"); // initializing, loading, authenticated, error
  const [authError, setAuthError] = useState("");

  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // Firebase Auth initialization with anonymous sign-in
  useEffect(() => {
    let unsubscribe;
    
    const initAuth = async () => {
      setAuthState("loading");
      setAuthError("");
      
      try {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("User authenticated:", user.uid);
            setAuthState("authenticated");
            setAuthError("");
          } else {
            setAuthState("loading");
            console.log("No user found, signing in anonymously...");
            // Sign in anonymously if no user
            signInAnonymously(auth)
              .then((userCredential) => {
                console.log("Anonymous sign-in successful:", userCredential.user.uid);
                setAuthState("authenticated");
              })
              .catch((signInError) => {
                console.error("Anonymous sign-in failed:", signInError);
                setAuthState("error");
                setAuthError(`Authentication failed: ${signInError.message}`);
              });
          }
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState("error");
        setAuthError(`Firebase initialization failed: ${error.message}`);
      }
    };

    initAuth();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, auth]);

  // Drag Enter
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.classList.add("border-blue-500", "bg-blue-50");
    }
  };

  // Drag Leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.classList.remove("border-blue-500", "bg-blue-50");
    }
  };

  // Drag Over (required for drop to work)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.classList.remove("border-blue-500", "bg-blue-50");
    }

    const img = e.dataTransfer.files[0];
    if (img && img.type.startsWith('image/')) {
      handleFileSelect(img);
    } else if (img) {
      setError("Please drop a valid image file (JPEG, PNG, GIF, etc.).");
    } else {
      setError("No file was dropped.");
    }
  };

  // File Input Change
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Common file selection handler
  const handleFileSelect = (selectedFile) => {
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB. Please choose a smaller image.");
      return;
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError("Please select a valid image file (JPEG, PNG, GIF, etc.).");
      return;
    }

    // Clear previous error and URL
    setError("");
    setUrl("");
    
    // Revoke previous preview URL if exists
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    const newPreview = URL.createObjectURL(selectedFile);
    setPreview(newPreview);
    console.log("File selected:", selectedFile.name, selectedFile.size);
  };

  // Click to select file via input
  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  // Upload Image with auth check
  const uploadImage = async () => {
    // Check authentication state
    if (authState === "loading" || authState === "initializing") {
      setError("Please wait for authentication to complete...");
      return;
    }

    if (authState === "error") {
      setError("Authentication failed. Please refresh the page and try again.");
      return;
    }

    if (!auth.currentUser) {
      setError("User not authenticated. Please wait a moment and try again.");
      // Retry auth
      signInAnonymously(auth).catch((err) => {
        console.error("Retry auth failed:", err);
        setError(`Auth retry failed: ${err.message}`);
      });
      return;
    }

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      console.log("Starting upload with authenticated user:", auth.currentUser.uid);
      const timestamp = Date.now();
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
      const imageRef = ref(storage, `uploads/${timestamp}-${fileName}`);
      
      console.log("Uploading to path:", `uploads/${timestamp}-${fileName}`);
      
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(prog));
          console.log(`Upload progress: ${Math.round(prog)}%`);
        },
        (uploadError) => {
          console.error("Upload error details:", uploadError);
          setUploading(false);
          setProgress(0);

          let errorMessage = "Upload failed: ";
          
          // Enhanced error handling for Firebase Storage errors
          if (uploadError.code) {
            switch (uploadError.code) {
              case 'storage/unauthorized':
                errorMessage += "Permission denied. This may be due to Storage rules. Check Firebase Console.";
                break;
              case 'storage/canceled':
                errorMessage += "Upload was canceled.";
                break;
              case 'storage/unknown':
                errorMessage += "Unknown error. Check your internet connection.";
                break;
              case 'storage/invalid-root-operation':
                errorMessage += "Invalid storage operation. Verify Firebase configuration.";
                break;
              case 'storage/invalid-argument':
                errorMessage += "Invalid file. Please select a valid image.";
                break;
              case 'storage/quota-exceeded':
                errorMessage += "Storage quota exceeded. Upgrade your Firebase plan.";
                break;
              case 'storage/network-request-failed':
                errorMessage += "Network error. Check your connection and try again.";
                break;
              default:
                errorMessage += `${uploadError.code}: ${uploadError.message}`;
            }
          } else {
            errorMessage += uploadError.message || "An unexpected error occurred.";
          }
          
          setError(errorMessage);
        },
        async () => {
          try {
            console.log("Upload completed, retrieving download URL...");
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL obtained:", downloadURL);
            
            setUrl(downloadURL);
            setProgress(100);
            setUploading(false);
            
            // Show completion for 2 seconds, then reset progress
            setTimeout(() => {
              setProgress(0);
            }, 2000);
            
            // Clear file selection after successful upload (optional)
            // setTimeout(() => {
            //   clearSelection();
            // }, 3000);
            
          } catch (downloadError) {
            console.error("Download URL error:", downloadError);
            setError(`Upload succeeded but URL generation failed: ${downloadError.message}`);
            setUploading(false);
            setProgress(100); // Keep progress at 100 since upload worked
          }
        }
      );
    } catch (initError) {
      console.error("Upload initialization error:", initError);
      setError(`Upload setup failed: ${initError.message}`);
      setUploading(false);
    }
  };

  // Clear selection and reset form
  const clearSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setPreview("");
    setUrl("");
    setError("");
    setProgress(0);
    setUploading(false);
    
    // Revoke preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  // Sign out (for debugging)
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthState("initializing");
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
      setError(`Sign out failed: ${error.message}`);
    }
  };

  // Retry authentication
  const retryAuth = () => {
    setAuthState("loading");
    setAuthError("");
    signInAnonymously(auth)
      .then(() => {
        setAuthState("authenticated");
      })
      .catch((error) => {
        console.error("Retry failed:", error);
        setAuthState("error");
        setAuthError(`Retry failed: ${error.message}`);
      });
  };

  // Loading state
  if (authState === "loading" || authState === "initializing") {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Initializing Firebase...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up authentication and storage</p>
        </div>
      </div>
    );
  }

  // Auth error state
  if (authState === "error") {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentication Error</h3>
          <p className="text-gray-700 mb-4 max-w-md mx-auto">{authError}</p>
          <div className="space-y-2">
            <button
              onClick={retryAuth}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Authentication
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Drag & Drop Image Upload
        </h2>
        {authState === "authenticated" && (
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <span>🔐 Authenticated</span>
            <span className="text-xs">({auth.currentUser.uid.slice(0, 8)}...)</span>
            <button
              onClick={handleSignOut}
              className="text-xs underline hover:text-red-600"
              title="Sign out (debug only)"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Authentication Status */}
      {authState === "authenticated" && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
          ✅ Firebase ready - Anonymous user authenticated successfully
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-500">⚠️</span>
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 text-xl font-bold ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        ref={dropRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          file
            ? 'border-green-400 bg-green-50 shadow-md'
            : authState === "authenticated"
            ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            : 'border-gray-200 bg-gray-50 opacity-60'
        } ${error ? 'border-red-400 bg-red-50' : ''}`}
      >
        {!file ? (
          <div className="space-y-3">
            <div className={`text-5xl ${authState === "authenticated" ? 'text-gray-400' : 'text-gray-300'}`}>
              📁
            </div>
            <div>
              <p className={`font-medium ${
                authState === "authenticated" ? 'text-gray-700' : 'text-gray-500'
              }`}>
                {authState === "authenticated"
                  ? "Drag & drop your image here"
                  : "Loading authentication..."
                }
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, GIF (Max 5MB)
              </p>
            </div>
            
            {authState === "authenticated" && (
              <label
                onClick={handleLabelClick}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium"
              >
                Choose File
              </label>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-3xl text-green-500">✅</div>
            <p className="text-green-700 font-medium">{file.name}</p>
            <p className="text-sm text-green-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={authState !== "authenticated"}
        />
      </div>

      {/* Preview & Upload Controls */}
      {preview && authState === "authenticated" && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-center text-gray-800">Preview</h3>
          <div className="text-center">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover mx-auto rounded-lg shadow-md border-2 border-gray-200"
            />
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Change Image
            </button>
            <button
              onClick={uploadImage}
              disabled={uploading}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
              }`}
            >
              {uploading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                "Upload to Firebase"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Button (for selected file without preview) */}
      {file && !preview && authState === "authenticated" && (
        <button
          onClick={uploadImage}
          disabled={uploading}
          className={`w-full py-3 mt-6 rounded-lg font-semibold transition-all ${
            uploading
              ? "bg-gray-400 cursor-not-allowed text-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Selected Image"}
        </button>
      )}

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Upload Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                progress === 100 ? 'bg-green-600' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {uploading && progress < 100 && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Do not refresh the page while uploading...
            </p>
          )}
        </div>
      )}

      {/* Success Section */}
      {url && (
        <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="text-center mb-6">
            <div className="text-4xl text-green-600 mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Upload Successful!</h3>
            <p className="text-green-700">Your image is now stored in Firebase Storage.</p>
          </div>

          {/* Download URL */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3 text-center">Download URL:</h4>
            <div className="bg-white p-3 rounded border border-gray-200 max-h-20 overflow-auto">
              <code className="text-sm break-all text-blue-700 font-mono block">
                {url}
              </code>
            </div>
            <div className="text-center mt-3">
              <button
                onClick={() => navigator.clipboard.writeText(url).then(() => {
                  alert("URL copied to clipboard!");
                })}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                Copy URL
              </button>
            </div>
          </div>

          {/* Uploaded Image */}
          <div className="text-center mb-6">
            <img
              src={url}
              alt="Uploaded"
              className="w-48 h-48 object-cover mx-auto rounded-lg shadow-lg border-2 border-green-200"
              onError={(e) => {
                console.error("Failed to load uploaded image");
                e.target.style.display = "none";
                e.target.alt = "Upload successful but image failed to load";
              }}
            />
            <p className="text-sm text-green-700 mt-2">
              Image loaded successfully from Firebase Storage
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={clearSelection}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Upload Another Image
            </button>
            <button
              onClick={() => setUrl("")}
              className="px-4 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500 space-y-1">
        <p>Powered by Firebase v10+ • Secure anonymous authentication</p>
        {process.env.NODE_ENV === "development" && (
          <div className="text-xs bg-gray-100 p-2 rounded">
            <p>Debug: Auth State = {authState}</p>
            <p>User: {auth.currentUser ? auth.currentUser.uid.slice(0, 8) + "..." : "None"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
