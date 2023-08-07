import { getTelnetOptions } from '../telnet';
import { getInfinityMintVersion } from '../helpers';
import { InfinityMintWindow } from '../window';

const Login = new InfinityMintWindow(
    'Login',
    {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

Login.initialize = async (window, frame, bessed) => {
    if (!window.getInfinityConsole().isTelnet())
        throw new Error('Login window only for telnet mode');

    let telnetOptions = getTelnetOptions();
    let title =
        telnetOptions.title ||
        `InfinityMint ${getInfinityMintVersion()} {underline}Telnet Server{/underline}`;

    window.createElement('form', {
        width: 'shrink',
        height: 'shrink',
        left: 'center',
        top: 'center',
        padding: 2,
        tags: true,
        content: `${title}\n\n{white-fg}Please Login:{/white-fg}`,
        border: 'line',
        style: {
            fg: 'green',
            bg: 'black',
            border: {
                fg: 'green',
            },
        },
    });

    window.key('C-c', () => {
        //destroys the InfinityConsole
        window.getInfinityConsole().destroy();
    });
};

Login.setForcedOpen(true);
Login.setHideRefreshButton(true);
Login.setHideMinimizeButton(true);
Login.setHideCloseButton(true);
Login.setHiddenFromMenu(true);

export default Login;
