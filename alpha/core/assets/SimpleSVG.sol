//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import '../../InfinityMintAsset.sol';

contract SimpleSVG is InfinityMintAsset {
    constructor(
        string memory _tokenName,
        address valuesContract
    ) InfinityMintAsset(valuesContract) {
        tokenName = _tokenName;
        assetsType = 'svg'; //returns scalable vector asset
    }

    function getNextPathId(
        RandomNumber randomNumberController
    ) public virtual override returns (uint32) {
        if (pathCount == 1 && disabledPaths[safeDefaultReturnPath])
            revert('No valid paths');

        if (valuesController.isTrue('incrementalMode')) {
            nextPath = lastPath++;
            if (nextPath >= pathCount) {
                lastPath = uint32(safeDefaultReturnPath);
                nextPath = uint32(safeDefaultReturnPath);
            }
            while (disabledPaths[nextPath]) {
                if (nextPath >= pathCount)
                    nextPath = uint32(safeDefaultReturnPath);
                nextPath++;
            }
            return nextPath;
        } else {
            uint32 pathId = uint32(
                randomNumberController.getMaxNumber(pathCount)
            );

            if (disabledPaths[pathId] || pathId >= pathCount)
                pathId = uint32(safeDefaultReturnPath);

            return pathId;
        }
    }
}
