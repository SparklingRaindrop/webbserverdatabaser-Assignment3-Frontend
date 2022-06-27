import { useEffect, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
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
    const [userDetails, setUserDetails] = useRecoilState(userState);
    const [inboxes, setInboxes] = useRecoilState(messageState);
    const setRoomList = useSetRecoilState(roomState);
    const setMemberList = useSetRecoilState(membersState);
    const setSystemState = useSetRecoilState(systemState);
    const resetUserDetails = useResetRecoilState(userState);

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
            console.log('connect_error', error);
        });

        // data = {user, current}
        newSocket.on('user_initialized', (data) => {
            setUserDetails(prev => ({
                ...prev,
                name: data.user.name,
                id: data.user.id,
                current_room: data.user.current_room,
                active_tab: data.user.current_room,
            }));
            setRoomList(data.roomList);
            navigate('/chat');
        });

        /* incomingMessage = {
            content: string
            receiver: obj or undefined 
                {id: string, name: string, current_room_id: 1, current_room: string}
            room_name: string or undefined
            sender: "sender_id" string
            sender_name: string
            timestamp: string
        }
        */
        /*
            message = {current_room: [], id:[], id:[]}
            message[0] is reserved for a room chat.
        */
        newSocket.on('new_msg', (incomingMessage) => {
            const senderId = incomingMessage.sender; // user this user is talking to
            const receiverData = incomingMessage.receiver; // this user
            // when message obj has a receiver then it's DM.
            if (receiverData) {

                // First message from this sender
                if (!inboxes.hasOwnProperty(senderId)) {
                    // Add sender to active_dm
                    setUserDetails(prev => ({
                        ...prev,
                        active_dm: {
                            ...prev.active_dm,
                            [incomingMessage.sender_name]: senderId
                        },
                    }));
                    setInboxes(prev => {
                        const newInbox = [incomingMessage];
                        return {
                            ...prev,
                            [senderId]: newInbox,
                        }
                    });
                } else {
                    // Not the first message. must be append to the existing inbox
                    setInboxes(prev => {
                        const newInbox = [...prev[senderId], incomingMessage];
                        return {
                            ...prev,
                            [senderId]: newInbox,
                        }
                    });
                }
            } else {
                // If it's group message
                setInboxes(prev => {
                    const newInbox = [...prev.current_room, incomingMessage];
                    return {
                        ...prev,
                        current_room: newInbox
                    }
                });
            }

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
            setSystemState(prev => ({
                ...prev,
                typingBy: typingBy,
            }))
        });

        newSocket.on('user_typing_stop', () => {
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
        return () => {
            newSocket.close();
            resetUserDetails();
        };
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