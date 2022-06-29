import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { userState } from '../recoil/user/atom';

import {
    useToast,
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    Center,
} from '@chakra-ui/react';

export default function Reception(props) {
    const { socket } = props;

    return (
        <Center bg='teal.700' h='100vh' color='white'>
            <LoginField socket={socket} />
        </Center>
    )
}

function LoginField(props) {
    const { socket } = props;
    const [input, setInput] = useState('');
    const setUserDetails = useSetRecoilState(userState);
    const toast = useToast();

    function handleSendUserName() {
        if (input === '') {
            toast({
                title: 'Enter your chat name',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        socket.emit('user:ready', { userName: input }, (response) => {
            if (response.status !== 200) {
                toast({
                    title: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
        });
        setUserDetails(() => ({
            name: input,
        }));
        setInput('');
    }

    return (
        <Box bg='teal.100' p='2rem' borderRadius='lg' color='teal.900'>
            <FormControl>
                <FormLabel htmlFor='userName'>What's your nickname?</FormLabel>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    id='userName'
                    bg='white'
                    type='text' />
            </FormControl>
            <Button
                mt={4}
                colorScheme='teal'
                onClick={handleSendUserName}
            >
                Enter
            </Button>
        </Box>
    );
}