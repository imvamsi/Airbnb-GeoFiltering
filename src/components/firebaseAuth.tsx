import { FC, useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";

const firebaseAuthConfig = {
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ],
    signInSuccessfulUrl: '/'
}

const FirebaseAuth: FC = () => {
    return (
        <div className='mt-16'>
            <StyledFirebaseAuth
                uiConfig={firebaseAuthConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    )
}

export default FirebaseAuth