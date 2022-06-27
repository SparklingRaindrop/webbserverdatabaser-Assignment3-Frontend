import React, { useState } from 'react';
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Heading,
    Button,
    Flex,
    IconButton,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    useDisclosure
} from '@chakra-ui/react';
import { MinusIcon, PlusSquareIcon, DeleteIcon, LockIcon } from '@chakra-ui/icons';
import MemberList from './MemberList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user/atom';
import { messageState } from '../recoil/message/atom';
import { EnterRoomIcon } from './Icon';

export default function ListGroup(props) {
    const { name, members, socket, password } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [roomDetails, setRoomDetails] = useState({
        name: name,
        password: '',
    });
    const [action, setAction] = useState(null);
    const toast = useToast();
    const [user, updateUserState] = useRecoilState(userState);
    const setInboxes = useSetRecoilState(messageState);

    function handleDeleteRoom(event) {
        event.stopPropagation();
        socket.emit('remove_room', roomDetails, (response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Could not delete the room.',
                    description: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                if (isOpen) {
                    onClose();
                    setRoomDetails(prev => ({
                        ...prev,
                        password: ''
                    }));
                }
                toast({
                    title: 'Successfully deleted',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        });
    }

    function handleEnterRoom(event) {
        event.stopPropagation();
        socket.emit('join_room', roomDetails, (response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Could not enter the room',
                    description: response.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                if (isOpen) {
                    onClose();
                    setRoomDetails(prev => ({
                        ...prev,
                        password: ''
                    }));
                }
                toast({
                    title: `You are now in ${roomDetails.name}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                updateUserState(prev => ({
                    ...prev,
                    current_room: roomDetails.name,
                    active_tab: roomDetails.name, // TODO
                }));
                setInboxes(prev => ({
                    ...prev,
                    current_room: []
                }));
            }
        });
    }

    function handleInput(e) {
        setRoomDetails(prev => ({
            ...prev,
            password: e.target.value
        }));
    }

    return (
        <>
            <AccordionItem border={0}>
                {({ isExpanded }) => (
                    <>
                        <Heading>
                            <AccordionButton
                                as='div'
                                bg='green.300'>
                                <Box flex='1' textAlign='left'>
                                    {name} ({members.length}) {
                                        password ?
                                            <LockIcon /> :
                                            null
                                    }
                                </Box>
                                <Flex direction='row' gap={1} alignItems='center'>
                                    {
                                        user.current_room === name ?
                                            null :
                                            <IconButton
                                                variant='ghost'
                                                colorScheme='black'
                                                aria-label='Enter room'
                                                onClick={(event) => {
                                                    setAction('Enter');
                                                    if (password) {
                                                        onOpen();
                                                        return;
                                                    }
                                                    handleEnterRoom(event);
                                                }}
                                                icon={<EnterRoomIcon />}
                                            />
                                    }
                                    {
                                        roomDetails.name === 'lobby' ?
                                            null :
                                            <IconButton
                                                variant='ghost'
                                                colorScheme='black'
                                                aria-label='Delete room'
                                                onClick={(event) => {
                                                    setAction('Delete');
                                                    if (password) {
                                                        onOpen();
                                                        return;
                                                    }
                                                    handleDeleteRoom(event);
                                                }}
                                                icon={<DeleteIcon />}
                                            />
                                    }
                                    {isExpanded ?
                                        <IconButton
                                            variant='ghost'
                                            colorScheme='black'
                                            icon={<MinusIcon />}
                                        />
                                        :
                                        <IconButton
                                            variant='ghost'
                                            colorScheme='black'
                                            icon={<PlusSquareIcon />}
                                        />}
                                </Flex>
                            </AccordionButton>
                        </Heading>
                        <AccordionPanel pb={4} bg='green.200'>
                            <MemberList members={members} />
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
            <PasswordPopUp
                isOpen={isOpen}
                action={action}
                value={roomDetails.password}
                onClose={onClose}
                handleOnClick={
                    action && action === 'Delete' ?
                        handleDeleteRoom : handleEnterRoom
                }
                handleInput={handleInput} />
        </>
    );
}


function PasswordPopUp(props) {
    const { isOpen, action, value, onClose, handleOnClick, handleInput } = props;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enter a password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        value={value}
                        onChange={handleInput}
                        bg='white'
                        type='text' />
                    <Button
                        mt={4}
                        colorScheme='green'
                        onClick={handleOnClick}
                    >
                        {action} the room
                    </Button>
                    <Button colorScheme='green' variant='outline' ml={4} mt={4} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}