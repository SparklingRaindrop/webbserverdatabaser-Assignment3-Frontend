import { useEffect, useState } from 'react';
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

function App() {
    const [socket, setSocket] = useState(null);
    const [userDetails, setUserDetails] = useRecoilState(userState);
    const [inboxes, setInboxes] = useRecoilState(messageState);
    const setRoomList = useSetRecoilState(roomState);
    const setMemberList = useSetRecoilState(membersState);
    const setSystemState = useSetRecoilState(systemState);
    const resetUserDetails = useResetRecoilState(userState);
    const resetInboxes = useResetRecoilState(messageState);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            forceNew: true
        });

        newSocket.on('reconnect', () => {
            console.info('reconnected');
            socket.emit('user-reconnected', userDetails.name);
        });

        newSocket.on('connect', () => {
            console.info('Connected');
            if (userDetails.id !== newSocket.id) {
                setUserDetails(prev => ({
                    ...prev,
                    id: newSocket.id,
                }));
            }
            if (userDetails.id === null) {
                navigate('/');
                resetUserDetails();
                resetInboxes();
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

            console.log(incomingMessage);
            if (
                userDetails.active_dm &&
                !userDetails.active_dm.hasOwnProperty(incomingMessage.sender_name)
            ) {
                // Add sender to active_dm
                setUserDetails(prev => ({
                    ...prev,
                    active_dm: {
                        ...prev.active_dm,
                        [incomingMessage.sender_name]: senderId
                    },
                }));
            }

            setInboxes(prev => {
                // when message obj has a receiver then it's DM.
                if (receiverData) {

                    // First message from this sender
                    if (!prev.hasOwnProperty(senderId)) {
                        const newInbox = [incomingMessage];
                        return {
                            ...prev,
                            [senderId]: newInbox,
                        }
                    } else {
                        // Not the first message. must be append to the existing inbox
                        const newInbox = [...prev[senderId], incomingMessage];
                        return {
                            ...prev,
                            [senderId]: newInbox,
                        }
                    }
                } else {
                    // If it's group message
                    const newInbox = [...prev.current_room, incomingMessage];
                    return {
                        ...prev,
                        current_room: newInbox
                    }
                }



            });
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
        /*
            data = {
                typingBy: user data,
                receiver: id or undefined,
                room_name: string or undefined,
            }
        */
        newSocket.on('user_typing_start', (data) => {
            setSystemState(prev => ({
                ...prev,
                typingNotification: data,
            }))
        });

        newSocket.on('user_typing_stop', () => {
            setSystemState(prev => ({
                ...prev,
                typingNotification: null,
            }))
        });

        // Fired when the client is going to be disconnected (but hasn't left its rooms yet).
        newSocket.on("disconnecting", (reason) => {
            console.log(newSocket.rooms);
        });

        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, []);

    console.log('inboxes: ', inboxes);
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