import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { useNavigate, Routes, Route } from "react-router-dom";

import { userState } from './recoil/user/atom';
import { roomState } from './recoil/room/atom';
import { messageState } from './recoil/message/atom';
import { membersState } from './recoil/members/atom';
import { systemState } from './recoil/system/atom';

import { ChakraProvider, useToast } from '@chakra-ui/react';
import Reception from './pages/Reception';
import Chat from './pages/Chat';

function App() {
    const [socket, setSocket] = useState(null);

    const setUserDetails = useSetRecoilState(userState);
    // inboxes = {current_room: [], id:[], id:[]}
    const [inboxes, setInboxes] = useRecoilState(messageState);
    const setRoomList = useSetRecoilState(roomState);
    const setMemberList = useSetRecoilState(membersState);
    const setSystemState = useSetRecoilState(systemState);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        navigate('/');
    }, [socket]);

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            forceNew: true,
        });

        /// Connection ///

        newSocket.on('connect_error', (error) => {
            console.log(error);
        });

        newSocket.on("disconnect", (reason) => {
            navigate('/');
        });

        /// User ///

        /* 
            data = {
                user,
                roomList,
                message: {
                    room_name: 'current_room',
                    messageList: messages,
                },
        }
        */
        newSocket.on('user:initialized', (data) => {
            setUserDetails(() => ({
                name: data.user.name,
                id: data.user.id,
                current_room: data.user.current_room,
                active_tab: data.user.current_room,
                active_dm: [],
            }));
            setRoomList(data.roomList);
            navigate('/chat');
        });

        newSocket.on('user:new_client', (data) => {
            setMemberList(data.users);
        });

        newSocket.on('user:new_room_entered', (data) => {
            setInboxes(prev => ({
                ...prev,
                current_room: data.message.messageList,
            }));
        });

        /* 
         data = {
            allMembers,
            roomList,
            user // The user who left the chat
         }
        */
        newSocket.on('user:left_chat', (data) => {
            setMemberList(data.allMembers);
            setRoomList(data.roomList);
            toast({
                title: `${data.user.name} has left the chat.`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        /* 
            data = {user}
        */
        newSocket.on('user:left_chat_room', (data) => {
            toast({
                title: `${data.user.name} has left ${data.user.current_room}.`,
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
        newSocket.on('user:typing_started', (data) => {
            setSystemState(prev => ({
                ...prev,
                typingNotification: data,
            }));
        });

        newSocket.on('user:typing_stopped', () => {
            setSystemState(prev => ({
                ...prev,
                typingNotification: null,
            }))
        });

        /// Message ///

        /*
            incomingMessage = {
                content: string
                receiver: obj or undefined 
                    {id: string, name: string, current_room_id: 1, current_room: string}
                room_name: string or undefined
                sender: "sender_id" string
                sender_name: string
                timestamp: string
            }
        */

        newSocket.on('msg:new', (incomingMessage) => {
            const senderId = incomingMessage.sender; // user this user is talking to
            const senderName = incomingMessage.sender_name;
            const receiverData = incomingMessage.receiver; // this user

            // Add sender to active_dm
            setUserDetails(prev => {
                if (
                    receiverData &&
                    //userDetails.active_dm.length &&
                    prev.active_dm.filter(data => (
                        data.hasOwnProperty(senderName))).length === 0
                ) {
                    return {
                        ...prev,
                        active_dm: [
                            ...prev.active_dm,
                            { [senderName]: senderId }
                        ],
                    }
                }
                return prev;
            });

            setInboxes(prev => {
                // when message obj has a receiver then it's DM.
                if (receiverData) {
                    // First message from this sender
                    if (!prev.hasOwnProperty(senderId)) {
                        const newInbox = [incomingMessage];

                        toast({
                            title: `New message from ${senderName}`,
                            status: 'info',
                            variant: 'left-accent',
                            position: 'bottom-left',
                            duration: 5000,
                            isClosable: true,
                        });

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

        /// Room ///

        newSocket.on('room:new_list', (data) => {
            setRoomList(data);
        });

        newSocket.on('room:deleted', (roomName) => {
            toast({
                title: `${roomName} was deleted.`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        newSocket.on('room:new_member', (data) => {
            toast({
                title: `${data.name} has joined ${data.current_room}`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        newSocket.on('room:created', (roomName) => {
            toast({
                title: `A room "${roomName}" has created.`,
                status: 'info',
                variant: 'left-accent',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
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

export default App;