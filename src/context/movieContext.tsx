import { Children, createContext,useContext,useEffect,useState } from "react";
import { getDoc , doc ,updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebase/config";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

type Movie = {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
}

type MovieContextType = {
    myList :Movie[];
    addToList:(movie:Movie)=> Promise<void>
    removeFromList :(movieId:number)=>Promise<void>
}

const MovieContext  = createContext<MovieContextType>({
    myList:[],
    addToList:async ()=>{},
    removeFromList :async ()=>{}
})

export const MovieProvider = ({children}:{children:ReactNode})=>{
    const {user}  = useAuth()
    const db = getFirestore(app)
    const [myList,setMyList] = useState<Movie[]>([])

    useEffect(() => {
    if (!user) return;

    const fetchList = async () => {
        const ref = doc(db, 'user', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            setMyList(snap.data().wishlist || []);
        }
    };

    fetchList(); 
}, [user]);

    const addToList = async (movie:Movie)=>{
        if(!user) return
        const ref  =  doc(db,'user',user.uid)
        await updateDoc(ref,{
            wishlist:arrayUnion(movie)
        })
        setMyList((prev)=>[...prev,movie])
    }

    const removeFromList = async(movieId:number)=>{
        if(!user) return
        const movieToRemove = myList.find((m) => m.id === movieId);
         if (!movieToRemove) return;

        const ref = doc(db,'user',user.uid)
        await updateDoc(ref,{
            wishlist:arrayRemove(movieToRemove)
        })

        setMyList((prev)=>prev.filter((m)=>m.id !== movieId))
    }
    
    return (
        <MovieContext.Provider value ={{myList , addToList ,removeFromList}}>
            {children}
        </MovieContext.Provider>
    )

}


export const useMovies  = () => useContext(MovieContext)