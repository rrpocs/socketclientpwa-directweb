import { useState } from "react"
import Link from 'next/link'

export default function Index({ }) {
  const [user, setUser] = useState('');

  return (
    <div style={{ padding: '10px', fontSize: 'smaller' }}>
      <div>
        Usuário:
          <span style={{ paddingLeft: '10px' }}>
          <input
            type="text"
            style={{ marginLeft: '0px' }}
            id="inputusr"
            onChange={(event) => setUser('/home?username=' + event.target.value)}
          />
        </span>
      </div>
      <br />
      <div>
        <Link href={user}>
          <a>ENTRAR</a>
        </Link>
      </div>
    </div>
  )
}
'/home?user=${user}'