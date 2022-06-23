import React, { useState } from 'react';
import {
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input
} from '@chakra-ui/react';

export default function CreateNewRoomPopUp(props) {
    const { isOpen, onClose, socket } = props;
    const [input, setInput] = useState('');
    const toast = useToast();

    function handleCreateNewRoom() {
        socket.emit('create_room', input, (response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Could not create a room',
                    description: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                onClose();
            }
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new room</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        id='userName'
                        bg='white'
                        type='text' />
                    <Button
                        mt={4}
                        colorScheme='green'
                        onClick={handleCreateNewRoom}
                    >
                        Create
                    </Button>
                    <Button colorScheme='green' variant='outline' ml={4} mt={4} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}