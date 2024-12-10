// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Button,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { startOCR } from '@valifysolutions/react-native-vidvocr';
// import { startLiveness } from '@valifysolutions/react-native-vidvliveness';
//
//
// const testOCR = true;
// const testLiveness = true;
//
// // Unified credentials
// const creds = {
//   baseURL: 'https://www.valifystage.com/', // Update with your actual base URL
//   bundleKey: 'ad44eb94ca6747beaf99eef02407221f', // Replace with your actual bundle key
//   userName: 'mobileusername', // Replace with actual credentials
//   password: 'q5YT54wuJ2#mbanR',
//   clientID: 'aKM21T4hXpgHFsgNJNTKFpaq4fFpoQvuBsNWuZoQ',
//   clientSecret: 'r0tLrtxTue8c4kNmPVgaAFNGSeCWvL4oOZfBnVXoQe2Ffp5rscXXAAhX50BaZEll8ZRtr2BlgD3Nk6QLOPGtjbGXYoCBL9Fn7QCu5CsMlRKDbtwSnUAfKEG30cIv8tdW',
// };
// const getToken = async () => {
//   const url = `${creds.baseURL}/api/o/token/`;
//
//   const body = `username=${creds.userName}&password=${creds.password}&client_id=${creds.clientID}&client_secret=${creds.clientSecret}&grant_type=password`;
//
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: body,
//     });
//
//     if (response.ok) {
//       const jsonResponse = await response.json();
//       return jsonResponse.access_token;
//     } else {
//       throw new Error('Failed to retrieve token');
//     }
//   } catch (error) {
//     console.error(error);
//     Alert.alert('Error', 'Could not generate token');
//     return null;
//   }
// };
//
// const App = (): JSX.Element => {
//   const [loading, setLoading] = useState(false);
//
//   const [loadingOCR, setLoadingOCR] = useState(false);
//   const [loadingLiveness, setLoadingLiveness] = useState(false);
//
//   const handleStartValify = async () => {
//     setLoading(true);
//
//     const token = await getToken();
//
//     if (token) {
//       // Start OCR Process
//       const ocrParams = {
//         access_token: token,
//         base_url: creds.baseURL,
//         bundle_key: creds.bundleKey,
//         language: 'en',
//         review_data: true
//       };
//
//       startOCR(ocrParams)
//         .then((ocrResponse) => {
//           console.log('OCR Result:', ocrResponse);
//
//           // Parse the OCR response if it’s a string
//           const parsedResponse = typeof ocrResponse === 'string' ? JSON.parse(ocrResponse) : ocrResponse;
//
//           // Check the OCR result state
//           if (parsedResponse.nameValuePairs?.state === "SUCCESS") {
//             const transactionIdFront = parsedResponse.nameValuePairs?.ocrResult?.ocrResult?.transactionIdFront;
//             console.log('Transaction ID Front:', transactionIdFront);
//             if(testLiveness){
//                            if (transactionIdFront) {
//
//                               // Wait 2 seconds before starting liveness experience
//                               setTimeout(() => {
//                                 const livenessParams = {
//                                   access_token: token,
//                                   base_url: creds.baseURL,
//                                   bundle_key: creds.bundleKey,
//                                   language: 'en',
//                                   facematch_ocr_transactionId: transactionIdFront, // Pass the transaction ID from OCR
//                                 };
//
//
//                                 startLiveness(livenessParams)
//                                   .then((livenessValue) => {
//                                     console.log('Liveness Result:', livenessValue);
//                                     Alert.alert('Success', 'Liveness completed successfully');
//                                   })
//                                   .catch((livenessError) => {
//                                     console.error('Liveness Error:', livenessError);
//                                     Alert.alert('Error', 'Liveness failed');
//                                   });
//                               }, 2000); // 2 seconds delay
//                             } else {
//                               Alert.alert('Error', 'Transaction ID not found in OCR response');
//                             }
//                         }
//
//
//           } else {
//             console.log('Current OCR state is not SUCCESS');
//           }
//         })
//         .catch((ocrError) => {
//           console.error('OCR Error:', ocrError);
//           Alert.alert('Error', 'OCR failed');
//         })
//         .finally(() => setLoading(false));
//     }
//   };
//     const handleStartLiveness = async () => {
//       setLoadingLiveness(true);
//
//           const token = await getToken();
//
//           if (token) {
//                       const livenessParams = {
//                         access_token: token,
//                         base_url: creds.baseURL,
//                         bundle_key: creds.bundleKey,
//                         language: 'en'
//                                         };
//
//                       startLiveness(livenessParams)
//                         .then((livenessValue) => {
//                           console.log('Liveness Result:', livenessValue);
//                           Alert.alert('Success', 'Liveness completed successfully');
//                         })
//                         .catch((livenessError) => {
//                           console.error('Liveness Error:', livenessError);
//                           Alert.alert('Error', 'Liveness failed');
//                         }).finally(() => setLoadingLiveness(false));
//           }else{
//                   Alert.alert('Error', 'Token failed');
//
//               }
//
//     };
//     const handleStartOCR = async () => {
//       setLoadingOCR(true);
//
//       const token = await getToken();
//
//       if (token) {
//         // Start OCR Process
//         const ocrParams = {
//           access_token: token,
//           base_url: creds.baseURL,
//           bundle_key: creds.bundleKey,
//           language: 'en',
//           review_data: true
//         };
//
//         startOCR(ocrParams)
//           .then((ocrResponse) => {
//             console.log('OCR Result:', ocrResponse);
//
//             // Parse the OCR response if it’s a string
//             const parsedResponse = typeof ocrResponse === 'string' ? JSON.parse(ocrResponse) : ocrResponse;
//
//             // Check the OCR result state
//             if (parsedResponse.nameValuePairs?.state === "SUCCESS") {
//               const transactionIdFront = parsedResponse.nameValuePairs?.ocrResult?.ocrResult?.transactionIdFront;
//               console.log('Transaction ID Front:', transactionIdFront);
//
//
//             } else {
//               console.log('Current OCR state is not SUCCESS');
//             }
//           })
//           .catch((ocrError) => {
//             console.error('OCR Error:', ocrError);
//             Alert.alert('Error', 'OCR failed');
//           })
//           .finally(() => setLoadingOCR(false));
//       }
//     };
//
//    return (
//      <SafeAreaView style={styles.container}>
//        <View style={styles.buttonContainer}>
//          {loading ? (
//            <ActivityIndicator size="large" color="#0000ff" />
//          ) : (
//            <Button title="Start Valify" onPress={handleStartValify} />
//          )}
//        </View>
//        <View style={styles.buttonContainer}>
//          {loadingOCR ? (
//            <ActivityIndicator size="large" color="#0000ff" />
//          ) : (
//            <Button title="Start OCR" onPress={handleStartOCR} />
//          )}
//        </View>
//        <View style={styles.buttonContainer}>
//          {loadingLiveness ? (
//            <ActivityIndicator size="large" color="#0000ff" />
//          ) : (
//            <Button title="Start Liveness" onPress={handleStartLiveness} />
//          )}
//        </View>
//      </SafeAreaView>
//    );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center', // Center the buttons vertically
//     alignItems: 'center', // Center the buttons horizontally
//   },
//   buttonContainer: {
//     marginBottom: 20, // Add space between buttons
//     width: '80%', // Optional: To set button width
//   },
// });
//
// export default App;
