import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoWhiteImg from '../assets/images/logoBranca.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import moonImg from '../assets/images/lua.svg';
import sunImg from '../assets/images/sol.svg';
import '../styles/auth.scss';

import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    const { theme, toggleTheme } = useTheme();

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() == ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()){
            alert('Room does not exists');
            return;
        }

        if(roomRef.val().endedAt){
            alert('Room alredy closed');
            return;
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth" className={theme}>
            <Toaster position="top-center"
            reverseOrder={false}/>

            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <button onClick={toggleTheme} className="change-theme">
                        {theme == 'dark' ? <img src={sunImg} alt="LogoDark" className="image-theme"/> : <img src={moonImg} alt="LogoDark" className="image-theme"/>}
                    </button>
                    { theme == 'dark' ? <img src={logoWhiteImg} alt="Letmeask" /> : <img src={logoImg} alt="Letmeask" /> }
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}