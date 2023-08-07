(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Whois = exports.Version = exports.UploadProject = exports.UpdateProject = exports.UnpackDeployments = exports.SetupProject = exports.SetProject = exports.SetNetwork = exports.SetLocation = exports.RestoreProject = exports.Report = exports.RebuildImports = exports.Project = exports.Network = exports.Mint = exports.MergeDeployments = exports.Make = exports.GetToken = exports.GenerateTypeExtensions = exports.FetchProject = exports.FetchImports = exports.ExportProject = exports.DownloadBundle = exports.DeployProject = exports.DeployContract = exports.ConvertProject = exports.CompileProject = exports.Call = void 0;
    exports.Call = {
        "name": "Call Contract Method",
        "description": "Calls a method on a contract",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "contract",
                "type": "string",
                "optional": true
            },
            {
                "name": "method",
                "type": "string",
                "optional": true
            },
            {
                "name": "module",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "call.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/call.ts"
    };
    exports.CompileProject = {
        "name": "Compile",
        "description": "Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "uploadBundle",
                "type": "boolean",
                "value": true,
                "optional": true
            },
            {
                "name": "continuePrevious",
                "type": "boolean",
                "value": true,
                "optional": true
            },
            {
                "name": "recompile",
                "type": "boolean",
                "value": false,
                "optional": true
            }
        ],
        "fileName": "compileProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/compileProject.ts"
    };
    exports.ConvertProject = {
        "name": "Convert Project",
        "description": "Converts a deployed project to a source file",
        "arguments": [],
        "fileName": "convertProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/convertProject.ts"
    };
    exports.DeployContract = {
        "name": "DeployContract",
        "description": "Deploy a contract to the current network, the deployment will be saved in the __@any folder in the deployments folder (relative to your network)",
        "arguments": [
            {
                "name": "contractName",
                "type": "string",
                "optional": false
            }
        ],
        "fileName": "deployContract.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/deployContract.ts"
    };
    exports.DeployProject = {
        "name": "Deploy",
        "description": "Deploys InfinityMint or a specific InfinityMint contract related to the current project",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "redeploy",
                "type": "boolean",
                "value": false,
                "optional": true
            },
            {
                "name": "setPipe",
                "type": "boolean",
                "optional": true,
                "value": true
            }
        ],
        "fileName": "deployProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/deployProject.ts"
    };
    exports.DownloadBundle = {
        "name": "Download Bundle",
        "description": "Attempts to pull information from an address about an InfinityMint",
        "arguments": [],
        "fileName": "downloadBundle.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/downloadBundle.ts"
    };
    exports.ExportProject = {
        "name": "Export",
        "description": "Exports a project to the specified location, will copy over styles, gems and anything else relating to the project",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "location",
                "type": "string",
                "optional": true
            },
            {
                "name": "exportScript",
                "type": "string",
                "optional": true
            },
            {
                "name": "useBundle",
                "type": "boolean",
                "value": true,
                "optional": true
            },
            {
                "name": "requireInClient",
                "type": "boolean",
                "value": true,
                "optional": true
            },
            {
                "name": "setAsDefault",
                "type": "boolean",
                "value": false,
                "optional": true
            },
            {
                "name": "useGems",
                "type": "boolean",
                "optional": true
            },
            {
                "name": "publicFolder",
                "type": "string",
                "optional": true,
                "value": "public"
            },
            {
                "name": "ignorePublic",
                "type": "boolean",
                "optional": true
            }
        ],
        "fileName": "exportProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/exportProject.ts"
    };
    exports.FetchImports = {
        "name": "Fetch Imports Using IPFS",
        "description": "Fetches imports relating to a project  and write them to a destination or your current repository. The project must have uploaded its resources to IPFS",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "network",
                "type": "string",
                "optional": true
            },
            {
                "name": "version",
                "type": "string",
                "optional": true
            },
            {
                "name": "force",
                "type": "boolean",
                "optional": true
            },
            {
                "name": "destination",
                "type": "string",
                "optional": true
            },
            {
                "name": "useCompiled",
                "type": "boolean",
                "optional": true
            }
        ],
        "fileName": "fetchImports.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/fetchImports.ts"
    };
    exports.FetchProject = {
        "name": "Fetch Project",
        "description": "Attempts to fetch a project from an InfinityMint project contract",
        "arguments": [
            {
                "name": "contractDestination",
                "type": "string",
                "optional": false
            },
            {
                "name": "force",
                "type": "boolean",
                "optional": true
            }
        ],
        "fileName": "fetchProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/fetchProject.ts"
    };
    exports.GenerateTypeExtensions = {
        "name": "Generate Type Extensions",
        "description": "Generates type extensions for the current InfinityMint",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "generateTypeExtensions.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/generateTypeExtensions.ts"
    };
    exports.GetToken = {
        "name": "Get Token",
        "description": "Pulls information about a token from the blockchain and displays it",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "tokenId",
                "type": "number",
                "optional": false
            }
        ],
        "fileName": "getToken.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/getToken.ts"
    };
    exports.Make = {
        "name": "Make",
        "description": "Will compile and deploy your project to the current network and then export it",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "enableMinter",
                "type": "boolean",
                "optional": true
            },
            {
                "name": "recompile",
                "type": "boolean",
                "optional": true,
                "value": false
            },
            {
                "name": "dontExport",
                "type": "boolean",
                "optional": true
            },
            {
                "name": "report",
                "type": "boolean",
                "optional": true,
                "value": false
            },
            {
                "name": "recompile",
                "type": "boolean",
                "optional": true,
                "value": false
            },
            {
                "name": "publicFolder",
                "type": "string",
                "optional": true,
                "value": "public"
            },
            {
                "name": "redeploy",
                "type": "boolean",
                "optional": true,
                "value": false
            },
            {
                "name": "location",
                "type": "string",
                "optional": true
            },
            {
                "name": "exportScript",
                "type": "string",
                "optional": true,
                "value": "default"
            },
            {
                "name": "useBundle",
                "type": "boolean",
                "optional": true,
                "value": true
            },
            {
                "name": "useGems",
                "type": "boolean",
                "optional": true
            }
        ],
        "fileName": "make.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/make.ts"
    };
    exports.MergeDeployments = {
        "name": "Merge Deployments",
        "description": "Merges a directory of deployments into a new deployed project.",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "target",
                "type": "string",
                "optional": false
            },
            {
                "name": "network",
                "type": "string",
                "optional": true
            },
            {
                "name": "chainId",
                "type": "string",
                "optional": true
            },
            {
                "name": "newVersion",
                "type": "boolean",
                "optional": true
            }
        ],
        "fileName": "mergeDeployments.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/mergeDeployments.ts"
    };
    exports.Mint = {
        "name": "Mint",
        "description": "Mints a new InfinityMint NFT",
        "config": {
            "mint": {
                "mintChunkSize": 8
            }
        },
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "useImplicitMint",
                "type": "boolean",
                "optional": true,
                "value": false
            },
            {
                "name": "gasLimit",
                "type": "number",
                "optional": true
            },
            {
                "name": "count",
                "type": "number",
                "optional": true,
                "value": 1
            },
            {
                "name": "to",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "mint.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/mint.ts"
    };
    exports.Network = {
        "name": "Network",
        "description": "Displays the current working network",
        "arguments": [],
        "fileName": "network.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/network.ts"
    };
    exports.Project = {
        "name": "Project",
        "description": "Displays the current working project",
        "arguments": [],
        "fileName": "project.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/project.ts"
    };
    exports.RebuildImports = {
        "name": "Rebuild Imports",
        "description": "Rebuilds your import cache which contains references to all the files you are using through out InfinityMint",
        "arguments": [],
        "fileName": "rebuildImports.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/rebuildImports.ts"
    };
    exports.Report = {
        "name": "View Report",
        "description": "View a report of your project deployment",
        "arguments": [
            {
                "name": "project",
                "optional": true
            },
            {
                "name": "network",
                "optional": true
            }
        ],
        "fileName": "report.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/report.ts"
    };
    exports.RestoreProject = {
        "name": "Restore Project",
        "description": "Takes a source project file. Will attempt to fetch the project from a contract location, then unpack its deployments to your deployments folder",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "restoreProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/restoreProject.ts"
    };
    exports.SetLocation = {
        "name": "Set Export Location",
        "description": "Sets the export location of the current working project",
        "arguments": [
            {
                "name": "location",
                "type": "string",
                "optional": true
            },
            {
                "name": "project",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "setLocation.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/setLocation.ts"
    };
    exports.SetNetwork = {
        "name": "Set Current Target Network",
        "description": "Sets the current target network, this is the default network which you will deploy too and read information from",
        "arguments": [
            {
                "name": "network",
                "type": "string",
                "optional": false
            }
        ],
        "fileName": "setNetwork.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/setNetwork.ts"
    };
    exports.SetProject = {
        "name": "Set Current Project",
        "description": "Sets the current working project",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": false
            }
        ],
        "fileName": "setProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/setProject.ts"
    };
    exports.SetupProject = {
        "name": "Setup/Relaunch Project",
        "description": "Will resetup your project, calling clean up methods on all the deployments contained in the project and then reinitializing them on the block chain",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "setupProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/setupProject.ts"
    };
    exports.UnpackDeployments = {
        "name": "Unpack Deployments",
        "description": "Attempts to unpack all deployments in the project to a folder",
        "arguments": [
            {
                "name": "project",
                "type": "string",
                "optional": true
            },
            {
                "name": "destination",
                "type": "string",
                "optional": true
            },
            {
                "name": "network",
                "type": "string",
                "optional": true
            },
            {
                "name": "version",
                "type": "string",
                "optional": true
            }
        ],
        "fileName": "unpackDeployments.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/unpackDeployments.ts"
    };
    exports.UpdateProject = {
        "name": "Update",
        "description": "Updates a project by reading any changes which have occured and then setting them on chain",
        "arguments": [
            {
                "name": "project",
                "optional": true
            }
        ],
        "fileName": "updateProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/updateProject.ts"
    };
    exports.UploadProject = {
        "name": "Upload",
        "description": "Builds and then uploads to IPFS directory an InfinityMint build ready to be set as a the content record of an ENS",
        "arguments": [
            {
                "name": "project",
                "optional": true
            }
        ],
        "fileName": "uploadProject.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/uploadProject.ts"
    };
    exports.Version = {
        "name": "Version",
        "description": "Displays the current infinitymint version",
        "arguments": [],
        "fileName": "version.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/version.ts"
    };
    exports.Whois = {
        "name": "WHOIS",
        "description": "Attempts to pull information from an address about an InfinityMint",
        "arguments": [],
        "fileName": "whois.ts",
        "path": "/Users/llydiacross/Sources/infinitymint-beta/scripts/whois.ts"
    };
});
//# sourceMappingURL=scripts.js.map