import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '../../recoil/user/atom';
import { messageState } from '../../recoil/message/atom';

import { Button, Flex, IconButton, Textarea, useToast, VStack } from '@chakra-ui/react';
import { SmileyIcon } from '../Icon';

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
            active_dm: [{ name: id }, { name: id }]
        */
        if (active_tab !== current_room) {
            const receiverData = active_dm.find(data => data.hasOwnProperty(active_tab));
            outgoingMessage.receiver = receiverData[active_tab];
        }

        /*
            { content: string, receiver: string }
            If receiver is not provided, it'll sent to the room.
        */
        socket.emit('msg:send', outgoingMessage, (response) => {
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
                    // When user click on the DM button in MemberList,
                    // the user will be added to active_dm
                    const receiverData = active_dm.find(data => data.hasOwnProperty(active_tab));
                    if (active_dm && receiverData) {
                        const receiverId = receiverData[active_tab];
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
            { receiver: active_dm.find(data => data.hasOwnProperty(active_tab))[active_tab] } :
            { room_name: current_room };

        socket.emit('user:typing_start', target, (response) => {
            if (response.status !== 200) {
                console.log(response);
            }
        });
    }

    function handleTypingEnd() {
        const target = active_tab !== current_room ?
            { receiver: active_dm.find(data => data.hasOwnProperty(active_tab))[active_tab] } :
            { room_name: current_room };

        socket.emit('user:typing_stop', target, (response) => {
            if (response.status !== 200) {
                console.log(response);
            }
        });
    }

    function onEmojiClick(event, emojiObject) {
        setUserInput(prev => prev + emojiObject.emoji);
    }

    function handleOnClick() {
        setIsHidden(prev => !prev)
    }

    return (
        <VStack justifyItems='end' position='relative'>
            {/*             <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{
                    maxWidth: '30rem',
                    display: isHidden ? 'none' : 'block',
                    position: 'absolute',
                    transform: 'translateY(-100%)'
                }} /> */}

            {/* <IconButton icon={<SmileyIcon />} onClick={handleOnClick} /> */}

            <Flex
                width={['100%', '70%']}
                direction='row'
                alignItems='flex-end'
                gap='1rem'>
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
            </Flex>
        </VStack>

    )
}
