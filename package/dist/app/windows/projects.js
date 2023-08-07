(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../window", "../helpers", "../projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const window_1 = require("../window");
    const helpers_1 = require("../helpers");
    const projects_1 = require("../projects");
    const Projects = new window_1.InfinityMintWindow('Projects', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    let buildProjectPreview = (window, preview, project) => {
        var _a;
        preview.content = `{bold}{underline}{cyan-fg}${project.name || ((_a = project.description) === null || _a === void 0 ? void 0 : _a.name)}{/underline}{/cyan-fg}{/bold}`;
    };
    Projects.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let list = window.createElement('form', {
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
        }, 'list');
        let preview = window.createElement('preview', {
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
        }, 'layout');
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
        if (window.data.currentProject)
            notice.hide();
        let scripts = Object.values(window.getInfinityConsole().getProjectPaths()).filter((project) => project.ext !== '.json');
        let projects = scripts.map((project) => `${project.ext === '.js'
            ? '{yellow-fg}js{/yellow-fg}'
            : '{blue-fg}ts{/blue-fg}'} {underline}${project.name}{/underline} {gray-fg}(${project.dir + '/' + project.base}){gray-fg}`);
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
            right: (0, helpers_1.calculateWidth)(compile),
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
            right: (0, helpers_1.calculateWidth)(compile, deploy),
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
        let onSelected = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let session = (0, helpers_1.readGlobalSession)();
            session.environment.project = window.data.currentPath;
            session.environment.defaultProject = window.data.currentProject;
            (0, helpers_1.saveGlobalSessionFile)(session);
            projectButton.hide();
            exportButton.show();
            deploy.show();
            compile.show();
            yield window.updateFrameTitle();
        });
        projectButton.on('click', onSelected);
        projectButton.focus();
        projectButton.hide();
        list.setItems(projects);
        list.on('select', (el, selected) => {
            let path = scripts[selected];
            let session = (0, helpers_1.readGlobalSession)();
            let project = (0, projects_1.requireProject)(path.dir + '/' + path.base, path.ext === '.js');
            window.data.currentPath = path;
            window.data.currentProject = project;
            (0, helpers_1.saveGlobalSessionFile)(session);
            buildProjectPreview(window, preview, project);
            projectButton.show();
            projectButton.enableMouse();
            projectButton.focus();
            notice.hide();
        });
        window.key('enter', () => {
            if (!window.isVisible())
                return;
            if (window.data.currentPath)
                onSelected();
        });
    });
    exports.default = Projects;
});
//# sourceMappingURL=projects.js.map