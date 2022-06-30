import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { GridItem, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import { userState } from '../../recoil/user/atom';
import ConversationWindow from './ConversationWindow';
import { membersState } from '../../recoil/members/atom';

function TabButton(props) {
    const { label } = props;
    const setUser = useSetRecoilState(userState);

    function handleOnClick(tabName) {
        setUser(prev => ({
            ...prev,
            active_tab: tabName
        }));
    }

    return (
        <Tab
            _selected={{ color: 'green.900', bg: 'green.300' }}
            onClick={() => handleOnClick(label)}>
            {label}
        </Tab>
    );
}

export default function ConversationTabs(props) {
    const { tabIndex, handleSwitchTab } = props;
    const [{ active_dm, current_room }, setUserDetails] = useRecoilState(userState);
    const memberList = useRecoilValue(membersState);

    useEffect(() => {
        const goingAwayUserIndex = active_dm.findIndex(data => {
            const userId = Object.values(data)[0];
            return memberList.some(member => member.id !== userId)
        });
        const newActiveDM = active_dm.filter(data => {
            const userId = Object.values(data)[0];
            return memberList.some(member => member.id === userId)
        });
        if (goingAwayUserIndex > -1) {
            handleSwitchTab(prev => prev - 1);
        }

        setUserDetails(prev => ({
            ...prev,
            active_dm: newActiveDM,
        }));
    }, [memberList]);

    return (
        <Tabs
            h='100%'
            gridTemplateRows='auto 1fr'
            gridTemplateColumns='1fr'
            isLazy
            variant='enclosed'
            size='md'
            display='grid'
            colorScheme='green'
            onChange={(index) => handleSwitchTab(index)}
            index={tabIndex}>
            <GridItem>
                <TabList
                    pl='2rem' gap='1rem'>
                    <TabButton
                        label={current_room} />
                    {
                        active_dm &&
                        active_dm.map(receiverData => {
                            const receiverName = Object.keys(receiverData)[0];
                            return (
                                <TabButton
                                    key={receiverName}
                                    label={receiverName}
                                />
                            )
                        })
                    }
                </TabList>
            </GridItem>

            <GridItem
                maxH='100%'
                className='conversations'
                overflowY='scroll'>
                <TabPanels>
                    <TabPanel>
                        <ConversationWindow
                            receiverId={undefined}
                            receiverName={current_room} />
                    </TabPanel>
                    {
                        active_dm &&
                        active_dm.map(receiverData => {
                            // receiverData = { name: id }
                            const receiverName = Object.keys(receiverData)[0];
                            return (
                                <TabPanel key={receiverName}>
                                    <ConversationWindow
                                        receiverName={receiverName}
                                        receiverId={active_dm.find(receiverData =>
                                            receiverData.hasOwnProperty(receiverName))[receiverName]
                                        } />
                                </TabPanel>
                            );
                        })
                    }
                </TabPanels>
            </GridItem>
        </Tabs>
    )
}