import {
  useEffect,
  useState,
  useContext,
  createContext,
  FC,
} from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "./initFirebase";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";

initFirebase()

interface IAUthContext {
    user: firebase.User | null,
    logOut: () => void,
    authenticated: boolean
}

const AuthContext = createContext<IAUthContext>({
    user: null,
    logOut: () => null,
    authenticated: false
})

export const AuthProvider: FC = ({children}) => {

    const [user, setUser] = useState<firebase.User | null>(null)
    const router = useRouter()

    function logOut() {
        return firebase.auth()
                       .signOut()
                       .then(() => {
                           router.push('/')
                       })
                       .catch(err => console.log(err))
    }


    useEffect(() => {
        const cancelAuthListener = firebase.auth().onIdTokenChanged(async(user) => {
            if(user) {
                const token = await user.getIdToken()
                setTokenCookie(token)
                setUser(user)
            } else {
                removeTokenCookie()
                setUser(null)
            }
        })

        //runs when cancelAuthListener unmounts
        return function() {
            cancelAuthListener()
        }
    }, [])

    return(
        <AuthContext.Provider value={{user, logOut, authenticated: !!user}}>
            {children}
        </AuthContext.Provider>
    )
}

//function to get auth context anywhere in the app
export function useAuth() {
    return useContext(AuthContext)
}