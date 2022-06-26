import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { io } from 'socket.io-client';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { messageState } from './recoil/message/atom';
import { Routes, Route } from 'react-router-dom';
import Reception from '../pages/Reception';
import Chat from '../pages/Chat';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import { userState } from './recoil/user/atom';
import { roomState } from './recoil/room/atom';
import { useNavigate } from "react-router-dom";
import { membersState } from './recoil/members/atom';
import { systemState } from './recoil/system/atom';



/* function Chat({ socket, currentRoom, updateCurrentRoom, userName, roomList }) {
    const [userInput, setUserInput] = useState('');
    const [roomName, setRoomName] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [directMessage, setDirectMessage] = useState('');
    const [receiver, setReceiver] = useState('');
    const [messages, setMessages] = useRecoilState(messageState);

    //TODO userName is not shown
    

    function handleDirectMessage() {
        setMessages(prev => [...prev, {
            content: directMessage,
            sender: {
                userName: userName
            },
            timestamp: new Date().toString(),
        }]);
        socket.emit('send_msg', {
            message: directMessage,
            receiver: receiver
        }, (response) => {
            if (response.status !== 200) {
                // TODO deal error
                console.log(response);
                return;
            }
            setDirectMessage('');
            setReceiver('');
        });
    }

    function handleJoinRoom() {
        socket.emit('join_room', roomName, (response) => {
            if (response.status !== 200) {
                // TODO deal error
                console.log(response);
                return;
            }
            updateCurrentRoom(roomName);
            setRoomName('');
        });
    }
    function handleCreateRoom() {
        socket.emit('create_room', newRoomName, (response) => {
            if (response.status !== 200) {
                // TODO deal error
                console.log(response);
                return;
            }
            setNewRoomName('');
        });
    }

    return (
        <>
            <div>You are in {currentRoom}</div>
            <div>
                <input type='text'
                    value={roomName}
                    onChange={(event) => setRoomName(event.target.value)} />
                <button onClick={handleJoinRoom}>JOIN</button>
            </div>
            <div>
                <input type='text'
                    value={newRoomName}
                    onChange={(event) => setNewRoomName(event.target.value)} />
                <button onClick={handleCreateRoom}>Create</button>
            </div>
            <ul>{roomList.map((room) => <li key={room.id}>{room.name}</li>)}</ul>
            <div>
                <input type='text'
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)} />
                <button onClick={handleSubmitMessage}>Send</button>
            </div>
            <div>
                <input type='text'
                    placeholder='Message'
                    value={directMessage}
                    onChange={(event) => setDirectMessage(event.target.value)} />
                <input type='text'
                    placeholder='Message to'
                    value={receiver}
                    onChange={(event) => setReceiver(event.target.value)} />
                <button onClick={handleDirectMessage}>Send</button>
            </div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index} > {msg.content} by {msg.sender.userName} at {msg.timestamp}</li>
                ))}
            </ul>
        </>
    );
} */

function App() {
    const [socket, setSocket] = useState(null);
    const [userDetails, setUserState] = useRecoilState(userState);
    const setMessages = useSetRecoilState(messageState);
    const setRoomList = useSetRecoilState(roomState);
    const setMemberList = useSetRecoilState(membersState);
    const setSystemState = useSetRecoilState(systemState);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            forceNew: true
        });
        newSocket.on('connect', () => {
            console.info('Connected');
            if (userDetails.id === null) {
                navigate('/');
            }
        });

        newSocket.on('connect_error', (error) => {
            console.log(error);
        });

        // data = {user, current}
        newSocket.on('user_initialized', (data) => {
            console.log('user_initialized', data);
            setUserState(data.user);
            setRoomList(data.roomList);
            navigate('/chat');
        });

        newSocket.on('new_msg', (data) => {
            setMessages(prev => [...prev, data]);
        });

        newSocket.on('update_room_list', (data) => {
            setRoomList(data);
        });

        newSocket.on('new_client', (data) => {
            setMemberList(data.users);
        });

        newSocket.on('room_deleted', (roomName) => {
            toast({
                title: `${roomName} was deleted.`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        newSocket.on('room_new_member', (data) => {
            toast({
                title: `${data.name} has joined ${data.current_room}`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        newSocket.on('room_created', (roomName) => {
            toast({
                title: `A room "${roomName}" has created.`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        newSocket.on('user_typing_start', (typingBy) => {
            console.log('start detected', typingBy);
            setSystemState(prev => ({
                ...prev,
                typingBy: typingBy,
            }))
        });

        newSocket.on('user_typing_stop', () => {
            console.log('stop detected');
            setSystemState(prev => ({
                ...prev,
                typingBy: null,
            }))
        });

        // Fired when the client is going to be disconnected (but hasn't left its rooms yet).
        newSocket.on("disconnecting", (reason) => {
            console.log(newSocket.rooms);
        });

        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    return (
        <div className="App">
            <ChakraProvider>
                <Routes>
                    <Route path='/' element={<Reception socket={socket} />} />
                    <Route path='/chat' element={<Chat socket={socket} />} />
                </Routes>
            </ChakraProvider>
        </div>
    )
}

export default App


/* 

            {
                !currentRoom ?
                    { <LoginField
                        userName={input}
                        handleSendUserName={handleSendUserName}
                        handleInput={handleInput} /> } :
                        <Chat
                        socket={socket}
                        roomList={roomList}
                        userName={userName}
                        currentRoom={currentRoom}
                        updateCurrentRoom={updateCurrentRoom} />
            }
*/