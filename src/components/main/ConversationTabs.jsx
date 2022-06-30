import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { GridItem, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import { userState } from '../../recoil/user/atom';
import ConversationWindow from './ConversationWindow';
import { membersState } from '../../recoil/members/atom';

function TabButton(props) {
    const { label } = props;

    return (
        <Tab _selected={{ color: 'green.900', bg: 'green.300' }}>
            {label}
        </Tab>
    );
}

export default function ConversationTabs(props) {
    const { tabIndex, handleSwitchTab } = props;
    const [{ active_dm, current_room, active_tab }, setUserDetails] = useRecoilState(userState);
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

        setUserDetails(prev => {
            // when current tab was the user that left the chat
            // So need to move tab and set active tab value to the new tab
            // tabIndex is +1 for activeDM because index 0 is reserved for room chat 
            if (goingAwayUserIndex > -1 && active_dm[tabIndex - 1] && Object.keys(active_dm[tabIndex - 1])[0] === active_tab) {
                handleSwitchTab(prev => {
                    return prev - 1;
                });

                return {
                    ...prev,
                    active_dm: newActiveDM,
                    active_tab: newActiveDM.length > 0 ?
                        Object.keys(active_dm[tabIndex - 1])[0] :
                        prev.current_room
                }
            }

            return {
                ...prev,
                active_dm: newActiveDM,
            }
        });
    }, [memberList]);

    function handleOnchange(index) {
        const tabList = active_dm.length > 0 ? active_dm.map(receiverData => Object.keys(receiverData)[0]) : [];
        tabList.unshift(current_room);

        handleSwitchTab(index);
        setUserDetails(prev => ({
            ...prev,
            active_tab: tabList[index]
        }));
    }

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
            onChange={handleOnchange}
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
                            tabIndex={tabIndex}
                            receiverId={undefined} />
                    </TabPanel>
                    {
                        active_dm &&
                        active_dm.map(receiverData => {
                            // receiverData = { name: id }
                            const receiverName = Object.keys(receiverData)[0];
                            return (
                                <TabPanel key={receiverName}>
                                    <ConversationWindow
                                        tabIndex={tabIndex}
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