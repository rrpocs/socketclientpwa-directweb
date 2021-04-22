import Head from "next/head";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import userGen from "username-generator"

// const ENDPOINT = "http://127.0.0.1:3333";
const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const socket = socketIOClient(ENDPOINT);


export default function Home({ data }) {

  const [user, setUser] = useState({ usersList: null });
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({ listMsg: [] });
  const [loggedUser, setLoggedUser] = useState();


  useEffect(() => {
    console.log('data')
    // subscribe a new user
    socket.emit("login", userGen.generateUsername())
    console.log(userGen.generateUsername())

    // list of connected users
    socket.on("users", data => {
      setUser({ usersList: JSON.parse(data) })
    })

    // we get the messages
    socket.on("getMsg", data => {
      let listMessages = recMsg.listMsg
      listMessages.push(JSON.parse(data))
      setRecMsg({ listMsg: listMessages })
      playSound()
    })
  }, [])


  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: msg }));
  }


  socket.on("connecteduser", data => {
    setLoggedUser(JSON.parse(data));
  });


  const playSound = () => {
    let context = new AudioContext(),
      oscillator = context.createOscillator(),
      contextGain = context.createGain();

    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);

    contextGain.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + 3
    )
  }


  return (
    <>
      <Head>
        <title>All Peoples</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel='manifest' href='/manifest.json'></link>
      </Head>

      <div style={{ padding: '10px', fontSize: 'smaller' }}>

        <div style={{ padding: '0px' }}>
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
                  <span style={{ paddingLeft: '2px' }}>{user.connectionTime}</span>
                </div>
              )
            })
          }
        </div>
        <br />

        <div style={{ padding: '0px' }}>
          mensagens trocadas
        </div>
        <div style={{ padding: '0px' }}>
          {
            recMsg.listMsg?.map((msgInfo, index) => {
              return (
                <div key={index}>
                  -  {msgInfo.userName}:
                  <span style={{ paddingLeft: '2px' }}>{msgInfo.msg}</span>
                  <span style={{ paddingLeft: '2px' }}>{msgInfo.time}</span>
                </div>
              )
            })
          }
        </div>
        <br />
        <br />
        <br />

        <div>
          <span style={{ paddingLeft: '0px' }}>
            <input type="text" style={{ marginLeft: '0px' }} />
            <input type="button" style={{ marginLeft: '5px' }}
              value="enviar" onClick={() => { sendMessage(); }} />
          </span>
        </div>

      </div>

      <script type='javascript'>
        // This is the "Offline page" service worker

      // Add this below content to your HTML page inside a <script type="module"></script> tag, or add the js file to your page at the very top to register service worker
      // If you get an error about not being able to import, double check that you have type="module" on your <script /> tag

      /*
        This code uses the pwa-update web component https://github.com/pwa-builder/pwa-update to register your service worker,
        tell the user when there is an update available and let the user know when your PWA is ready to use offline.
      */

      import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';

      const el = document.createElement('pwa-update');
      document.body.appendChild(el);
      </script>
    </>
  );
}
