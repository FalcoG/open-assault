import React, { Dispatch, SetStateAction, useState } from 'react'

interface GameState {
  pointerLock: boolean
}

export const GameStateContext = React.createContext<{
  pointerLock: GameState['pointerLock']
  setPointerLock: Dispatch<SetStateAction<GameState['pointerLock']>>
}>({ pointerLock: false, setPointerLock: () => {} })

export const GameStateProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [pointerLock, setPointerLock] = useState<GameState['pointerLock']>(false)

  return (
    <GameStateContext.Provider value={{ pointerLock, setPointerLock }}>
      {children}
    </GameStateContext.Provider>
  )
}
