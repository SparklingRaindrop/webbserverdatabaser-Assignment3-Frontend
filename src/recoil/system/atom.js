import {atom} from 'recoil';

export const systemState = atom({
    key: 'systemState',
    default: {
        typingBy: null,
    },
});