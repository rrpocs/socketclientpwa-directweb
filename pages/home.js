import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const DENDPOINT = "https://localhost:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ query }) {

  const router = useRouter()
  const { username } = router.query
  const [userLogged, setUserLogged] = useState()
  const [loggedUser, setLoggedUser] = useState()
  const [user, setUser] = useState({ usersList: null })

  useEffect(() => {
    socket.emit("login", username)
    setUserLogged(username)
    socket.on("users", data => {
      setUser({ usersList: JSON.parse(data) })
    })
    socket.on("getMsg", data => {
      playSound(1)
    })
  }, [])

  socket.on("connecteduser", data => {
    console.log(data)
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
        conexões: {' '} {user.usersList?.length}
      </div><br />
      <div>
        usuário: {' '} {userLogged}
      </div><br />
      <div>
        <input
          type="button"
          value="notificar" onClick={() => { sendMessage('NOTE') }}
        />
      </div><br /><br />
      <div style={{ padding: '0px' }}>
        usuários conectados
      </div>
      <div id="divUsr" style={{ padding: '0px' }}>
        {
          user.usersList?.filter(p => p.id !== null)
            .map(user => {
              return (
                <div key={user.id}>
                  -  {user.id}
                </div>
              )
            })
        }
      </div>
    </div>
  );
}
