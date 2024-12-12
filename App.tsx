import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
//import liveness & OCR Plugins
import { startOCR } from '@valifysolutions/react-native-vidvocr';
import { startLiveness } from '@valifysolutions/react-native-vidvliveness';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  const bundleKey = "Enter your bundle key";
  //Defining variables needed to get access token
  const baseUrl = "Enter base URL";
  const username = "Enter your user name";
  const password = "Enter your password";
  const clientId = "Enter your client Id";
  const clientSecret = "Enter your client Secret";

  //Defining Plugins configurations
  const documentVerificationPlus  = false;

//start OCR Plugin
  const runOCR = async () => {
    try {
      console.log("Starting OCR...");
      //Get token from async function
      const token = await getAccessToken();
      if (token) {
        console.log("Access Token:", token);
        //Define OCR Plugin configurations
        const params = {
          //These are mandatory configurations
          access_token: token,
          base_url: baseUrl,
          bundle_key: bundleKey,
          //These are optional configurations
          document_verification_plus: documentVerificationPlus
        };
        //Start the OCR with the given configurations
        startOCR(params).then(
          (value)=> {
            console.log("OCR response:", value); // Log the full response
            //Handling the json repsonse
            const s = value.toString();
            const json = JSON.parse(s);
            const state = json?.nameValuePairs?.state;
            const step = json?.nameValuePairs?.step;
            const errorMessage = json?.nameValuePairs?.errorMessage;
            const errorCode = json?.nameValuePairs?.errorCode;
            //This how to get the transactionIdFront to be used in face match
            const transactionIdFront = json?.nameValuePairs?.ocrResult?.ocrResult?.transactionIdFront;
            //This is an example of how to access documentverificationplus fields if you set this configuration to be true
            const frontValidity = json?.nameValuePairs?.ocrResult?.ocrResult?.documentVerificationPlus?.front_data_validity;
            const backValidity = json?.nameValuePairs?.ocrResult?.ocrResult?.documentVerificationPlus?.back_data_validity;
            const reviewRequired = json?.nameValuePairs?.ocrResult?.ocrResult?.documentVerificationPlus?.review_required;
            // Use setTimeout to delay the alert
            setTimeout(() => {
              if (state === "SUCCESS") {
                  //Process finished successfully
                Alert.alert("Success", "OCR completed successfully!");
                console.log("Response :", json?.nameValuePairs?.ocrResult?.ocrResult);
                console.log("Front Validity:", frontValidity);
                console.log("Back Validity:", backValidity);
                console.log("Review Required:", reviewRequired);
                // Call Livenesss plugin after OCR Success giving it transactionIdFront for face match to work
                setTimeout(() => {
                  runLiveness(transactionIdFront, token);
                }, 500);
              } else if (state === "ERROR") {
                  // Process terminated due to an error in the builde
                Alert.alert("Builder Error", `Error Code: ${errorCode}, Error Message: ${errorMessage}`);
              } else if (state === "FAILURE") {
                  //Process finished with the user's failure to pass the service requirements
                Alert.alert("Service Failure", `Error Code: ${errorCode}, Error Message: ${errorMessage}`);
              } else if (state === "EXIT") {
                  //Process terminated by the user with no errors
                Alert.alert("Exit", `OCR exited at step: ${step}`);
              } else {
                Alert.alert("Unexpected Response", "Received an unrecognized state.");
              }
            }, 500); // Delay for 500 milliseconds (adjust as necessary)
          },
          function (error) {
            console.error("startOCR error:", error);
            Alert.alert("Error", error.message || "OCR failed with an unknown error");
          }
        );
      }
    } catch (error) {
      console.error("runOCR error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  //function to run liveness
const runLiveness = async () => {

            const token = await getAccessToken();
           const livenessParams = {
               //These are required parameters
             access_token: token,
             base_url: baseUrl,
             bundle_key: bundleKey,
             //This is an option of required parameters
             language: 'en'
            };

           startLiveness(livenessParams)
             .then((livenessValue) => {
                 //Handling json response
                 const s = livenessValue.toString();
                 const json = JSON.parse(s);
                 const state = json?.nameValuePairs?.state;
                const step = json?.nameValuePairs?.step;
                const errorMessage = json?.nameValuePairs?.errorMessage;
                const errorCode = json?.nameValuePairs?.errorCode;
                // Use setTimeout to delay the alert
                setTimeout(() => {
                  if (state === "SUCCESS") {
                      // Process finished successfully
                    Alert.alert("Success", "OCR completed successfully!");

                  } else if (state === "ERROR") {
                      //Process terminated due to an error in the builder
                    Alert.alert("Builder Error", `Error Code: ${errorCode}, Error Message: ${errorMessage}`);
                  } else if (state === "FAILURE") {
                      //Process finished with the user's failure to pass the service requirements
                    Alert.alert("Service Failure", `Error Code: ${errorCode}, Error Message: ${errorMessage}`);
                  } else if (state === "EXIT") {
                      //Process terminated by the user with no errors
                    Alert.alert("Exit", `OCR exited at step: ${step}`);
                  } else {
                    Alert.alert("Unexpected Response", "Received an unrecognized state.");
                  }
                }, 500); // Delay for 500 milliseconds (adjust as necessary)
             })
             .catch((livenessError) => {
               console.error('Liveness Error:', livenessError);
               Alert.alert('Error', 'Liveness failed');
             });
     };

//Getting access token for the sdk to work
  const getAccessToken = async () => {
      //Request url
    const url = baseUrl+"api/o/token/";
    //Request body data
    const data = {
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "password",
    };

    try {
        //Sending Api request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      });
      //Handling API response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const token = responseData.access_token;
      setAccessToken(token); // Save token in state
      return token; // Return token for use
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Could not generate token");
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCR & Liveness Integration</Text>
      <Button title="Scan" onPress={runOCR} />
      {accessToken && <Text style={styles.token}>Token: {accessToken}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  token: {
    marginTop: 20,
    fontSize: 12,
    color: '#555555',
  },
});

export default App;
