import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ query }) {

  const router = useRouter()
  const { username } = router.query
  const [user, setUser] = useState({ usersList: null });
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({ listMsg: [] });
  const [loggedUser, setLoggedUser] = useState();


  useEffect(() => {

    socket.emit("login", username)

    socket.on("connecteduser", data => {
      setLoggedUser(JSON.parse(data))
    });


    socket.on("users", data => {
      setUser({ usersList: JSON.parse(data) })
      socket.emit("sendMsg", JSON.stringify({ id: data.id, msg: 'NOTIFY' }))
    })

    socket.on("getMsg", data => {
      let listMessages = recMsg.listMsg
      listMessages.push(JSON.parse(data))
      setRecMsg({ listMsg: listMessages })
    })

  }, [])

  useEffect(() => {
    playSound(1)
  }, [recMsg])



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

  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: msg }))
  }

  const sendNotify = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: 'NOTIFY' }))
  }

  return (
    <div style={{ padding: '10px', fontSize: 'smaller' }}>

      <div>
        conexões: {' '}  {user.usersList?.length}
      </div><br />

      <div>
        usuário: {' '} {username}
      </div><br /><br />

      <div style={{ padding: '0px' }}>
        usuários conectados
      </div>
      <div id="divUsr" style={{ padding: '0px' }}>
        {
          user.usersList?.map(user => {
            return (
              <div key={user.id}>
                -  {user.userName}:
                {/* <span style={{ paddingLeft: '2px' }}>{user.connectionTime}</span> */}
              </div>
            )
          })
        }
      </div><br /><br />

      {/* <div>
        mensagens trocadas
        </div>
      <div id="divMsg">
        {
          recMsg.listMsg?.map((msgInfo, index) => {
            return (
              <div key={index}>
                -  {msgInfo.userName}:
                <span style={{ paddingLeft: '2px', fontSize: 'smaller' }}>{msgInfo.msg}</span>
                <span style={{ paddingLeft: '2px', fontSize: 'smaller' }}>{msgInfo.time}</span>
              </div>
            )
          })
        }
      </div><br /><br /> */}


      <div>
        <Link href="#">
          <a onClick={sendNotify}>NOTIFICAR</a>
        </Link>
      </div><br /><br />


      <div>
        <Link href="/">
          <a>VOLTAR</a>
        </Link>
      </div><br /><br />

    </div>
  );
}
