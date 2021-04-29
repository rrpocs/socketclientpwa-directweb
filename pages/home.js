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

  useEffect(() => {

    socket.emit("login", username)
    console.log(username)

    socket.on("users", data => {
      console.log(data)
      setUser({ usersList: JSON.parse(data) })
    })

  }, [])


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
      </div>

      <div>
        <Link href="/">
          <a>VOLTAR</a>
        </Link>
      </div>

    </div>
  );
}
