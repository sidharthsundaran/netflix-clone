import {useState} from 'react';

import type {Movie} from '../components/movieRow'

import {Play,Plus} from 'lucide-react'

type Props ={
    movie:Movie
}

export default function MovieCard({movie}:Props){
    const [isHovered,setIsHovered] =useState(false)
    const imageBase = "https://image.tmdb.org/t/p/w500"

    return (
        <div
      className="relative w-[150px] sm:w-[180px] lg:w-[220px] h-[8rem] sm:h-[10rem] lg:h-[12rem] bg-zinc-900 overflow-hidden rounded-md cursor-pointer transition-transform duration-300 hover:z-20"
      onMouseEnter ={()=> setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
      <img
        src={imageBase + movie.poster_path}
        alt={movie.title || movie.name}
        className={`object-cover w-full h-full transition-opacity duration-200 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      />
       {
        isHovered && (
        <div className="absolute inset-0 z-10 bg-zinc-950 p-3 text-white shadow-xl animate-fadeIn rounded-md">
            <img
            src={imageBase + movie.backdrop_path}
            alt="Backdrop"
            className="w-full h-24 object-cover rounded-md mb-2"
          />
          <h3 className="text-sm font-bold mb-1 truncate">
            {movie.title || movie.name}
          </h3>
          <div className="flex gap-2 text-xs mb-1">
            <button className="bg-white text-black px-2 py-1 rounded hover:bg-gray-300 flex items-center gap-1">
              <Play size={14} />
              Play
            </button>
            <button className="bg-gray-800 px-2 py-1 rounded hover:bg-gray-700">
              <Plus size={14} />
            </button>
          </div>
            </div>
        )
       }  
    

        </div>

    )
}