import React, { useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user/atom';
import { messageState } from '../recoil/message/atom';
import { Button, HStack, Textarea, useToast } from '@chakra-ui/react';

export default function MessageField(props) {
    const { socket } = props;
    const [userInput, setUserInput] = useState('');
    const { id, name, current_room } = useRecoilValue(userState);
    const setMessages = useSetRecoilState(messageState);
    const toast = useToast();

    function handleSubmitMessage() {
        socket.emit('send_msg', {
            message: userInput,
            receiver: undefined // TODO
        }, (response) => {
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
                setMessages(prev => [...prev, {
                    content: userInput,
                    room_name: current_room,
                    receiver: undefined, // TODO
                    sender: id,
                    sender_name: name,
                    timestamp: new Date().toString(),
                }]);
            }
            setUserInput('');
        });
    }

    function handleTypingStart() {
        socket.emit('typing_start', {
            room_name: current_room,
            receiver: undefined, // TODO
        }, (response) => {
            console.log(response);
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

    return (
        <HStack justifyItems='end'>
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
    )
}
