import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {SocketClient} from './socket-client/SocketClient'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SocketClient/>
    </>
  )
}

export default App
