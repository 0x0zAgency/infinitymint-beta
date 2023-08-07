import { InfinityMintWindow } from '../window';
import {
    BlessedElement,
    calculateWidth,
    readGlobalSession,
    saveGlobalSessionFile,
} from '../helpers';
import {
    InfinityMintProject,
    InfinityMintProjectJavascript,
} from '../interfaces';
import { requireProject } from '../projects';

const Projects = new InfinityMintWindow(
    'Projects',
    {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

let buildProjectPreview = (
    window: InfinityMintWindow,
    preview: BlessedElement,
    project: InfinityMintProject
) => {
    preview.content = `{bold}{underline}{cyan-fg}${
        project.name || (project as any).description?.name
    }{/underline}{/cyan-fg}{/bold}`;
};

Projects.initialize = async (window, frame, blessed) => {
    let list = window.createElement(
        'form',
        {
            label: '{bold}(Enter/Double-Click to select){/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '50%',
            height: '100%-8',
            padding: 2,
            keys: true,
            vi: true,
            mouse: true,
            border: 'line',
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            style: {
                bg: 'black',
                fg: 'white',
                item: {
                    hover: {
                        bg: 'green',
                        fg: 'black',
                    },
                },
                selected: {
                    bg: 'grey',
                    fg: 'green',
                    bold: true,
                },
            },
        },
        'list'
    );

    let preview = window.createElement(
        'preview',
        {
            tags: true,
            top: 4,
            right: 0,
            width: '50%+2',
            height: '100%-8',
            padding: 2,
            border: 'line',
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            style: {
                bg: 'black',
                fg: 'white',
                item: {
                    hover: {
                        bg: 'green',
                        fg: 'black',
                    },
                },
                selected: {
                    bg: 'grey',
                    fg: 'green',
                    bold: true,
                },
            },
        },
        'layout'
    );

    let notice = window.createElement('noPreviewSelected', {
        top: 'center',
        left: '75%-19',
        width: 'shrink',
        height: 'shrink',
        tags: true,
        bold: true,
        padding: 2,
        style: {
            fg: 'black',
            bg: 'red',
            border: {
                fg: 'red',
            },
        },
        border: window.getBorder(),
        content: '{bold}Welcome!{/bold}\nPlease Select A Project To Preview',
        mouse: true,
    });

    if (window.data.currentProject) notice.hide();

    let scripts = Object.values(window.getInfinityConsole().getProjectPaths());
    let projects = scripts.map(
        (project) =>
            `${
                project.ext === '.js'
                    ? '{yellow-fg}js{/yellow-fg}'
                    : '{blue-fg}ts{/blue-fg}'
            } {underline}${project.name}{/underline} {gray-fg}(${
                project.dir + '/' + project.base
            }){gray-fg}`
    );

    let compile = window.createElement('scriptsButton', {
        width: 'shrink',
        bottom: 0,
        mouse: true,
        keys: true,
        height: 5,
        right: 0,
        padding: 1,
        content: 'Compile',
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: '#ffffff',
            },
            hover: {
                bg: 'grey',
            },
        },
        border: 'line',
    });
    compile.on('click', () => {
        window.getInfinityConsole().setCurrentWindow('Scripts');
    });

    let deploy = window.createElement('deployButton', {
        width: 'shrink',
        bottom: 0,
        height: 5,
        right: calculateWidth(compile),
        padding: 1,
        content: 'Deploy',
        mouse: true,
        keys: true,
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: '#ffffff',
            },
            hover: {
                bg: 'grey',
            },
        },
        border: 'line',
    });
    deploy.on('click', () => {
        window.getInfinityConsole().setCurrentWindow('Scripts');
    });

    let exportButton = window.createElement('exportButton', {
        width: 'shrink',
        bottom: 0,
        height: 5,
        right: calculateWidth(compile, deploy),
        padding: 1,
        mouse: true,
        keys: true,
        content: 'Export',
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: '#ffffff',
            },
            hover: {
                bg: 'grey',
            },
        },
        border: 'line',
    });

    exportButton.hide();
    deploy.hide();
    compile.hide();

    exportButton.on('click', () => {
        window.getInfinityConsole().setCurrentWindow('Scripts');
    });

    let projectButton = window.createElement('projectButton', {
        width: 'shrink',
        bottom: 0,
        height: 5,
        left: 0,
        mouse: true,
        keys: true,
        padding: 1,
        content: 'Set As Current Project',
        style: {
            fg: 'white',
            bg: 'green',
            border: {
                fg: '#ffffff',
            },
            hover: {
                bg: 'grey',
            },
        },
        border: 'line',
    });
    let onSelected = async () => {
        let session = readGlobalSession();
        session.environment.project = window.data.currentPath;
        session.environment.defaultProject = window.data.currentProject;
        saveGlobalSessionFile(session);
        projectButton.hide();
        exportButton.show();
        deploy.show();
        compile.show();
        await window.updateFrameTitle();
    };
    projectButton.on('click', onSelected);
    projectButton.focus();
    projectButton.hide();

    list.setItems(projects);
    list.on('select', (el: any, selected: any) => {
        let path = scripts[selected];
        let session = readGlobalSession();
        let project = requireProject(
            path.dir + '/' + path.base,
            path.ext === '.js'
        );

        window.data.currentPath = path;
        window.data.currentProject = project;
        saveGlobalSessionFile(session);
        buildProjectPreview(window, preview, project as any);
        projectButton.show();
        projectButton.enableMouse();
        projectButton.focus();
        notice.hide();
    });

    window.key('enter', () => {
        if (!window.isVisible()) return;
        if (window.data.currentPath) onSelected();
    });
};
export default Projects;
