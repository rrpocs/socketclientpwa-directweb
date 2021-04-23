import Head from "next/head";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import userGen from "username-generator"

const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ data }) {

  const [user, setUser] = useState({ usersList: null });
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({ listMsg: [] });
  const [loggedUser, setLoggedUser] = useState();


  useEffect(() => {
    const _user = userGen.generateUsername()
    // subscribe a new user
    socket.emit("login", _user)

    // list of connected users
    socket.on("users", data => {
      setUser({ usersList: JSON.parse(data) })
    })

    // we get the messages
    socket.on("getMsg", data => {
      let listMessages = recMsg.listMsg
      listMessages.push(JSON.parse(data))
      setRecMsg({ listMsg: listMessages })
      playSound(1)
    })
  }, [])

  useEffect(() => {
    if (user && user.usersList?.length > 0) {
      socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: `${loggedUser.userName} conectado` }))
    }
  }, [user.usersList?.length])


  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: msg }))
  }


  socket.on("connecteduser", data => {
    setLoggedUser(JSON.parse(data))
  });


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
    <>
      <Head>
        <title>All Peoples</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ padding: '10px', fontSize: 'smaller' }}>

        <div>
          conexões:
          <span style={{ paddingLeft: '0px' }}> {user.usersList?.length}</span>
        </div>
        <br />

        <div style={{ padding: '0px' }}>
          usuários conectados
        </div>
        <div style={{ padding: '0px' }}>
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
        </div>
        <br />

        <div>
          mensagens trocadas
        </div>
        <div>
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
        </div>
        <br />
        <br />
        <br />

        <div>
          <span>

            <input
              type="text"
              style={{ marginLeft: '0px' }}
              id="inputmsg"
              onChange={(event) => setMsg(event.target.value)}
            />

            <input
              type="button"
              style={{ marginLeft: '5px' }}
              value="enviar" onClick={() => { sendMessage() }}
            />

          </span>
        </div>

      </div>

    </>
  );
}
