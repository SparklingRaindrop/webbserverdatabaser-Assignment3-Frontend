import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '../../recoil/user/atom';
import { messageState } from '../../recoil/message/atom';

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
import { EnterRoomIcon } from '../Icon';

function PasswordPopUp(props) {
    const {
        isOpen,
        action,
        value,
        onClose,
        handleOnClick,
        handleInput,
    } = props;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enter a password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        type='text'
                        value={value}
                        bg='white'
                        onChange={handleInput} />
                    <Button
                        mt={4}
                        colorScheme='green'
                        onClick={handleOnClick}>
                        {action} the room
                    </Button>
                    <Button
                        ml={4}
                        mt={4}
                        colorScheme='green'
                        variant='outline'
                        onClick={onClose}>
                        Cancel
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

function ActionButtons(props) {
    const {
        name,
        roomDetails,
        isExpanded,
        onOpen,
        handleAction,
        handleDeleteRoom,
        handleEnterRoom,
        password,
    } = props;
    const user = useRecoilValue(userState);

    return (
        <Flex
            direction='row'
            alignItems='center'>
            {
                user.current_room === name ?
                    null :
                    <IconButton
                        variant='ghost'
                        colorScheme='black'
                        aria-label='Enter room'
                        justifySelf='flex-end'
                        onClick={(event) => {
                            handleAction('Enter');
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
                            handleAction('Delete');
                            if (password) {
                                onOpen();
                                return;
                            }
                            handleDeleteRoom(event);
                        }}
                        icon={<DeleteIcon />}
                    />
            }
        </Flex>
    );
}

export default function RoomMemberList(props) {
    const { name, members, socket, password } = props;

    const [roomDetails, setRoomDetails] = useState({
        name: name,
        password: '',
    });
    const [action, setAction] = useState(null);

    const [user, updateUserState] = useRecoilState(userState);
    const setInboxes = useSetRecoilState(messageState);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    function handleAction(action) {
        setAction(action);
    }

    function handleDeleteRoom(event) {
        event.stopPropagation();
        socket.emit('room:delete', roomDetails, (response) => {
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
        socket.emit('user:join_room', roomDetails, (response) => {
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
            <AccordionItem w='90%' m='auto' border={0} >
                {({ isExpanded }) => (
                    <>
                        <Heading
                            overflow='hidden'
                            bg='green.300'>
                            <Flex
                                direction='row'
                                flexWrap='nowrap'
                                w='100%'
                                justifyContent='space-between'
                                alignItems='center'>
                                <AccordionButton
                                    paddingRight={roomDetails.name === 'lobby' ? 'inherit' : '0'}
                                    w={roomDetails.name === 'lobby' ? '100%' : '70%'}>
                                    <Box
                                        flex='1'
                                        w='70%'
                                        textAlign='left'>
                                        {name} ({members.length}) {
                                            password ?
                                                <LockIcon /> :
                                                null
                                        }
                                    </Box>
                                    {isExpanded ?
                                        <IconButton
                                            variant='ghost'
                                            colorScheme='black'
                                            as='div'
                                            icon={<MinusIcon />}
                                        />
                                        :
                                        <IconButton
                                            variant='ghost'
                                            colorScheme='black'
                                            as='div'
                                            icon={<PlusSquareIcon />}
                                        />}
                                </AccordionButton>
                                {
                                    user.current_room === name ?
                                        null :
                                        <IconButton
                                            variant='ghost'
                                            colorScheme='black'
                                            aria-label='Enter room'
                                            justifySelf='flex-end'
                                            onClick={(event) => {
                                                handleAction('Enter');
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
                                                handleAction('Delete');
                                                if (password) {
                                                    onOpen();
                                                    return;
                                                }
                                                handleDeleteRoom(event);
                                            }}
                                            icon={<DeleteIcon />}
                                        />
                                }
                            </Flex>
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