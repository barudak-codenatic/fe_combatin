'use client'
import { MultiplayerBoxingGame } from "@/components/game/multiplayer"


const MultiplayerPage = () => { 
    const name = localStorage.getItem('name')
    return <MultiplayerBoxingGame name={name}/>
 }

export default MultiplayerPage