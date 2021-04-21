import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import userGen from "username-generator"
import { Button, Input } from 'reactstrap';

// const ENDPOINT = "http://127.0.0.1:3333";
const ENDPOINT = "https://push01.cloudrobot.com.br:3333/";
const socket = socketIOClient(ENDPOINT);

function App() {

  const [user, setUser] = useState({
    usersList: null
  });
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({
    listMsg: []
  });
  const [loggedUser, setLoggedUser] = useState();

  useEffect(() => {
    // subscribe a new user
    socket.emit("login", 'usuário-' + userGen.generateUsername())
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

  // to send a message
  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser.id, msg: msg }));
  }
  // get the logged user
  socket.on("connecteduser", data => {
    setLoggedUser(JSON.parse(data));
  });

  // to play a sond
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

    // let context = new AudioContext(),
    //   oscillator = context.createOscillator();

    // oscillator.type = 'sine';
    // oscillator.connect(context.destination);
    // oscillator.start();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 className="d-flex justify-content-center"> Usuários conectados : {user.usersList?.length} </h3>
      <table className="table">
        <thead>
          <tr>
            <th> Usuário </th>
            <th> Conexão </th>
          </tr>
        </thead>
        <tbody>
          {user.usersList?.map(user => {
            return (<tr key={user.id}>
              <td> {user.userName} </td>
              <td> {user.connectionTime} </td>
            </tr>)
          })}
        </tbody>
      </table>
      <h3 className="d-flex justify-content-center"> User : {loggedUser?.userName} </h3>
      <div style={{ borderStyle: "inset" }}>
        {recMsg.listMsg?.map((msgInfo, index) => { return (<div className="d-flex justify-content-center" key={index}> <b>{msgInfo.userName} </b> :  {msgInfo.msg} <small style={{ marginLeft: "18px", color: "blue", marginTop: "5px" }}> {msgInfo.time} </small> </div>) })}
      </div>
      <div className="d-flex justify-content-center">
        <h4 className="d-flex justify-content-center"> MENSAGEM </h4>
        <Input style={{ width: "300px", display: "inline", marginLeft: "10px" }} id="inputmsg" onChange={(event) => setMsg(event.target.value)} />
        <Button className="btn btn-info" id="btnmsg" onClick={() => { sendMessage(); }}> Enviar </Button>
      </div>
    </div >
  );
}
export default App;