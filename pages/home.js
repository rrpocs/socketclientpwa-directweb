import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const DENDPOINT = "https://localhost:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ query }) {

  const router = useRouter()
  const { userLogged } = router.query
  const [loggedUser, setLoggedUser] = useState()
  const [user, setUser] = useState({ usersList: null })

  useEffect(() => {
    socket.emit("login", userLogged)
    socket.on("users", data => {
      setUser({ usersList: JSON.parse(data) })
    })
    socket.on("getMsg", data => {
      playSound(1)
    })
  }, [])

  socket.on("connecteduser", data => {
    setLoggedUser(JSON.parse(data))
  });

  const sendMessage = (par) => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: par }))
  }

  const playSound = (times) => {
    let context = new AudioContext(),
      oscillator = context.createOscillator(),
      contextGain = context.createGain();

    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);

    contextGain.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + times
    )
  }

  return (
    <div style={{ padding: '10px', fontSize: 'smaller' }}>
      <div>
        conexões:
          <span style={{ paddingLeft: '0px' }}> {user.usersList?.length}</span>
      </div>
      <br />
      <div>
        <input
          type="button"
          value="notificar" onClick={() => { sendMessage('NOTE') }}
        />
      </div>
    </div>
  );
}
