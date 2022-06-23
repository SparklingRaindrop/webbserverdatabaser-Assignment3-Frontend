import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../recoil/user/atom';
import { messageState } from '../recoil/message/atom';

export default function MessageField(props) {
    const { socket } = props;
    const [userInput, setUserInput] = useState('');
    const userDetails = useRecoilValue(userState);
    const [messages, setMessages] = useRecoilState(messageState);

    function handleSubmitMessage() {
        setMessages(prev => [...prev, {
            content: userInput,
            sender: {
                userDetails
            },
            timestamp: new Date().toString(),
        }]);
        socket.emit('send_msg', {
            message: userInput, receiver: undefined
        }, (response) => {
            if (response.status !== 200) {
                // TODO deal error
                console.log(response);
                return;
            }
            setUserInput('');
        });
    }

    return (
        <div>
            <input type='text'
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)} />
            <button onClick={handleSubmitMessage}>Send</button>
        </div>
    )
}
