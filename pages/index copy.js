import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import userGen from "username-generator"

const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ }) {

  const [user, setUser] = useState({ usersList: null });
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({ listMsg: [] });
  const [loggedUser, setLoggedUser] = useState();

  // useEffect(() => {
  //   removeAllDivs('divMsg')
  // }, [])

  useEffect(() => {
    const _user = userGen.generateUsername()
    socket.emit("login", _user)

    socket.on("users", data => {
      console.log(data)
      setUser({ usersList: JSON.parse(data) })
    })

    removeAllDivs('divMsg')
    socket.on("getMsg", data => {
      let listMessages = recMsg.listMsg
      listMessages.push(JSON.parse(data))
      setRecMsg({ listMsg: listMessages })
      playSound(1)
    })

  }, [])

  useEffect(() => {
    if (user && user.usersList?.length > 0) {
      recMsg.listMsg?.map((msgInfo) => {
        socket.emit("sendMsg", JSON.stringify({
          id: loggedUser.id, msg: `${msgInfo.userName} conectado`
        }))
      })
    }
  }, [user.usersList?.length])

  socket.on("connecteduser", data => {
    setLoggedUser(JSON.parse(data))
  });

  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: msg }))
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

  function removeAllDivs(id) {
    // setRecMsg({ listMsg: [] })
    // var elemento = document.getElementById(id);
    // while (elemento.firstElementChild) {
    //   elemento.removeChild(elemento.firstElementChild);
    // }
  }

  return (
    <>
      <div style={{ padding: '10px', fontSize: 'smaller' }}>

        <div>
          conexões:
          <span style={{ paddingLeft: '0px' }}> {user.usersList?.length}</span>
        </div>
        <br />

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
        </div>
        <br />

        <div>
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
