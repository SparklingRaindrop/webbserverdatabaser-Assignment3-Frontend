import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { messageState } from '../recoil/message/atom';
import { systemState } from '../recoil/system/atom';

import { Grid, Spinner } from '@chakra-ui/react';

import Sidebar from '../components/sidebar/Sidebar';
import MainSection from '../components/main/MainSection';
import UserInputSection from '../components/bottom/UserInputSection';

export default function Chat(props) {
    const { socket } = props;

    const [tabIndex, setTabIndex] = useState(0);

    const messages = useRecoilValue(messageState);
    const { typingBy } = useRecoilValue(systemState);

    useEffect(() => {
        const conversations = document.querySelector('.conversations');
        conversations.scrollTop = conversations.scrollHeight;
    }, [messages, typingBy]);

    function handleSwitchTab(index) {
        setTabIndex(index);
    }

    return (
        <Grid
            w='100vw'
            h='100vh'
            overflow='hidden'
            templateRows={'repeat(4, 1fr)'}
            templateColumns={['repeat(3, 1fr)', 'repeat(4, 1fr)']}>
            <Sidebar
                socket={socket}
                handleSwitchTab={handleSwitchTab} />
            <MainSection
                tabIndex={tabIndex}
                handleSwitchTab={handleSwitchTab} />
            <UserInputSection
                socket={socket} />
        </Grid >
    );
}