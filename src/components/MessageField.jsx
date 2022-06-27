import React, { forwardRef, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user/atom';
import { messageState } from '../recoil/message/atom';
import { Button, HStack, IconButton, Textarea, useToast, VStack } from '@chakra-ui/react';
import Picker from 'emoji-picker-react';
import { SmileyIcon } from './Icon';

export default function MessageField(props) {
    const { socket } = props;
    const [userInput, setUserInput] = useState('');
    const [isHidden, setIsHidden] = useState(true);

    const { id, name, current_room, active_tab, active_dm } = useRecoilValue(userState);
    const setInboxes = useSetRecoilState(messageState);
    const toast = useToast();

    function handleSubmitMessage() {
        const outgoingMessage = {
            content: userInput,
            sender: id,
            sender_name: name,
            timestamp: new Date().toString(),
        };

        /* 
            active_dm: { name: id }
        */
        if (active_tab !== current_room) {
            outgoingMessage.receiver = active_dm[active_tab];
        }

        /*
            { content: string, receiver: string }
            If receiver is not provided, it'll sent to the room.
        */
        socket.emit('send_msg', outgoingMessage, (response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Could not send the message',
                    description: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            } else {
                /*
                    message = {current_room: [], id: [], id: []}
                */
                setInboxes(prev => {
                    // prev.hasOwnProperty(active_dm[active_tab]) has to be always true for DM
                    // When user click on the DM button in MemberList, it adds to active_dm
                    if (active_dm && prev.hasOwnProperty(active_dm[active_tab])) {
                        const receiverId = active_dm[active_tab];
                        return {
                            ...prev,
                            [receiverId]: [...prev[receiverId], {
                                ...outgoingMessage,
                                room_name: undefined,
                            }]
                        }
                    } else {
                        return {
                            ...prev,
                            current_room: [...prev.current_room, outgoingMessage]
                        }
                    }
                });
                setUserInput('');
            }

        });
    }

    function handleTypingStart() {
        const target = active_tab !== current_room ?
            { receiver: active_dm[active_tab] } :
            { room_name: current_room };

        socket.emit('typing_start', target, (response) => {
            //console.log(response);
        });
    }

    function handleTypingEnd() {
        socket.emit('typing_stop', {
            room_name: current_room,
            receiver: undefined, // TODO
        }, (response) => {
            console.log(response);
        });
    }

    function onEmojiClick(event, emojiObject) {
        setUserInput(prev => prev + emojiObject.emoji);
    }

    function handleOnClick() {
        setIsHidden(prev => !prev)
    }

    return (
        <VStack justifyItems='end' position='relative' width='100%'>
            <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{
                    maxWidth: '30rem',
                    display: isHidden ? 'none' : 'block',
                    position: 'absolute',
                    transform: 'translateY(-100%)'
                }} />

            <IconButton icon={<SmileyIcon />} onClick={handleOnClick} />

            <HStack>
                <Textarea
                    type='text'
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    onFocus={handleTypingStart}
                    onBlur={handleTypingEnd}
                    placeholder='Message' />
                <Button colorScheme='green' variant='solid' onClick={handleSubmitMessage}>
                    Send
                </Button>
            </HStack>
        </VStack>

    )
}
