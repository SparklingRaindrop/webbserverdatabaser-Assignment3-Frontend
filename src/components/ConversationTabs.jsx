import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/user/atom';
import ConversationWindow from './ConversationWindow';

export default function ConversationTabs() {
    const [user, setUser] = useRecoilState(userState);

    function handleOnClick(tabName) {
        setUser(prev => ({
            ...prev,
            active_tab: tabName
        }));
    }

    return (
        <Tabs variant='enclosed'>
            <TabList>
                <Tab onClick={() => handleOnClick(user.current_room)}>{user.current_room}</Tab>
                {
                    user.active_dm && Object.keys(user.active_dm).map(receiverName => (
                        <Tab
                            key={receiverName}
                            onClick={() => handleOnClick(receiverName)}>
                            {receiverName}
                        </Tab>
                    ))
                }
            </TabList>
            <TabPanels>
                <TabPanel>
                    <ConversationWindow
                        receiverId={undefined}
                        receiverName={user.current_room} />
                </TabPanel>
                {
                    user.active_dm && Object.keys(user.active_dm).map(receiverName => (
                        <TabPanel key={receiverName}>
                            <ConversationWindow
                                receiverName={receiverName}
                                receiverId={user.active_dm[receiverName]} />
                        </TabPanel>
                    ))
                }
            </TabPanels>
        </Tabs>
    )
}
