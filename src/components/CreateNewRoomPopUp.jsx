import React, { useState } from 'react';
import {
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    Checkbox
} from '@chakra-ui/react';

export default function CreateNewRoomPopUp(props) {
    const { isOpen, onClose, socket } = props;
    const [isChecked, setIsChecked] = useState(false);
    const [input, setInput] = useState({
        name: '',
        password: '',
    });
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
                });
            } else {
                setInput({
                    name: '',
                    password: '',
                });
                setIsChecked(false);
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
                        value={input.name}
                        onChange={(e) => setInput(prev => ({
                            ...prev,
                            name: e.target.value,
                        }))}
                        bg='white'
                        type='text' />
                    <Checkbox
                        colorScheme='green'
                        checked={isChecked}
                        onChange={() => setIsChecked(prev => !prev)}>
                        set Password
                    </Checkbox>
                    {
                        isChecked ?
                            <Input
                                value={input.password}
                                onChange={(e) => setInput(prev => ({
                                    ...prev,
                                    password: e.target.value,
                                }))}
                                bg='white'
                                type='text' /> :
                            null
                    }
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