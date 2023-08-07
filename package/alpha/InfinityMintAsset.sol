//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './Asset.sol';
import './Authentication.sol';
import './RandomNumber.sol';

abstract contract InfinityMintAsset is Asset, Authentication {
    mapping(uint256 => bool) internal disabledPaths; //disabled paths which are not picked
    mapping(uint256 => uint256[]) internal pathSections; //what sections are to what path

    //user values
    InfinityMintValues internal valuesController;

    //the token name
    string internal tokenName = 'asset';
    string public assetsType = 'default'; //the type of assetId is default

    //path stuff
    uint256 internal pathCount;
    uint32[] internal pathSizes; //the amount of points in a path (used in random colour generation with SVG things)
    uint256 internal safeDefaultReturnPath; //used in the case we cannot decide what path to randomly select we will return the value of this

    uint256[][] internal assetsSections; //the sections to an asset
    uint256[] internal assetRarity; //a list of asset rarity
    uint32 internal nextPath = 0; //the next path to be minted
    uint32 internal lastPath = 0;

    //the names to pick from when generating
    uint256 public nameCount; //sets the number of names, the length of the project.names array
    uint256 public assetId; //

    //if all paths are for all sections
    bool private flatSections = false;

    constructor(address valuesContract) {
        valuesController = InfinityMintValues(valuesContract);
        assetRarity.push(0); //so assetId start at 1 not zero so zero can be treat as a
    }

    function setNameCount(uint256 _nameCount) public onlyApproved {
        nameCount = _nameCount;
    }

    function resetNames() public onlyApproved {
        nameCount = 0;
    }

    function resetAssets() public onlyApproved {
        delete assetRarity;
        delete assetsSections;
        assetRarity.push(0);
        assetId = 0;
        flatSections = false;
    }

    function resetPaths() public onlyApproved {
        delete pathSizes;
        pathCount = 0;
        safeDefaultReturnPath = 0;
    }

    function setNextPathId(uint32 pathId) public virtual override onlyApproved {
        nextPath = pathId;
    }

    function setLastPathId(uint32 pathId) public virtual override onlyApproved {
        lastPath = pathId;
    }

    function getNextPath() external view virtual override returns (uint32) {
        return nextPath;
    }

    function getPathSections(
        uint256 pathId
    ) external view virtual returns (uint256[] memory) {
        return pathSections[pathId];
    }

    function getSectionAssets(
        uint256 sectionId
    ) external view returns (uint256[] memory) {
        return assetsSections[sectionId];
    }

    function setPathSize(uint32 pathId, uint32 pathSize) public onlyApproved {
        pathSizes[pathId] = pathSize;
    }

    function setPathSizes(uint32[] memory newPathSizes) public onlyApproved {
        pathSizes = newPathSizes;
    }

    function getPathSize(uint32 pathId) public view override returns (uint32) {
        if (pathId >= pathSizes.length) return 1;

        return pathSizes[pathId];
    }

    function getNextPathId(
        RandomNumber randomNumberController
    ) public virtual override returns (uint32) {
        uint256 result = randomNumberController.getMaxNumber(pathCount);

        //path is greather than token Paths
        if (result >= pathCount) return uint32(safeDefaultReturnPath);

        //count up until a non disabled path is found
        while (disabledPaths[result]) {
            if (result + 1 >= pathCount) result = 0;
            result++;
        }

        return uint32(result);
    }

    function getNames(
        uint256 _nameCount,
        RandomNumber randomNumberController
    ) public view virtual override returns (uint32[] memory results) {
        // matched and incremental use nextPath to get their name
        if (!valuesController.isTrue('matchedMode')) {
            if (_nameCount <= 0 && valuesController.isTrue('mustGenerateName'))
                _nameCount = 1;

            if (_nameCount <= 0 || nameCount == 0) {
                results = new uint32[](1);
                results[0] = 0;
                return results;
            }

            results = new uint32[](nameCount + 1);

            for (uint32 i = 0; i < nameCount; ) {
                uint256 result = randomNumberController.unsafeNumber(
                    nameCount,
                    randomNumberController.salt() + block.timestamp + 6
                );

                if (result >= nameCount) result = 1;
                results[i] = uint32(result);
                unchecked {
                    ++i;
                }
            }
            results[nameCount] = 0;
        } else {
            if (nameCount <= 1) {
                results = new uint32[](1);
                results[0] = 0;
            } else {
                results = new uint32[](2);
                if (nextPath < nameCount) results[0] = 1 + nextPath;
                else results[0] = 1;
                results[1] = 0;
            }
        }
    }

    function getMintData(
        uint32,
        uint32,
        RandomNumber
    ) public virtual override returns (bytes memory) {
        return '{}'; //returns a blank json array
    }

    function isValidPath(uint32 pathId) public view override returns (bool) {
        return (pathId >= 0 && pathId < pathCount && !disabledPaths[pathId]);
    }

    function pickPath(
        uint32 pathId,
        uint32 currentTokenId,
        RandomNumber randomNumberController
    ) public virtual override returns (PartialStruct memory) {
        setNextPathId(pathId);

        return
            PartialStruct(
                pathId,
                getRandomAsset(pathId, randomNumberController),
                getNames(
                    randomNumberController.getMaxNumber(
                        valuesController.tryGetValue('nameCount')
                    ),
                    randomNumberController
                ),
                getColours(pathId, randomNumberController),
                getMintData(pathId, currentTokenId, randomNumberController)
            );
    }

    function pickPath(
        uint32 currentTokenId,
        RandomNumber randomNumberController
    ) public virtual override returns (PartialStruct memory) {
        return
            pickPath(
                getNextPathId(randomNumberController),
                currentTokenId,
                randomNumberController
            );
    }

    function getRandomAsset(
        uint32 pathId,
        RandomNumber randomNumberController
    ) public view virtual override returns (uint32[] memory assetsId) {
        if (assetId == 0) {
            return assetsId;
        }

        uint256[] memory sections;
        if (flatSections) sections = pathSections[0];
        else sections = pathSections[pathId];

        //index position of sections
        uint256 indexPosition = 0;
        //current random number salt
        uint256 salt = randomNumberController.salt();

        if (sections.length == 0) {
            return assetsId;
        } else {
            assetsId = new uint32[](sections.length);
            uint32[] memory selectedPaths;
            uint256[] memory section;
            for (uint256 i = 0; i < sections.length; ) {
                section = assetsSections[sections[i]];

                if (section.length == 0) {
                    assetsId[indexPosition++] = 0;
                    unchecked {
                        ++i;
                    }
                    continue;
                }

                if (section.length == 1 && assetRarity[section[0]] == 100) {
                    assetsId[indexPosition++] = uint32(section[0]);
                    unchecked {
                        ++i;
                    }
                    continue;
                }

                selectedPaths = new uint32[](section.length);
                //repeat filling array with found values
                uint256 count = 0;

                for (uint256 index = 0; index < section.length; ) {
                    if (count == selectedPaths.length) break;
                    if (section[index] == 0) {
                        unchecked {
                            ++index;
                        }
                        continue;
                    }

                    uint256 rarity = 0;

                    if (assetRarity.length > section[index])
                        rarity = assetRarity[section[index]];

                    if (
                        (rarity == 100 ||
                            rarity >
                            randomNumberController.unsafeNumber(
                                100,
                                i +
                                    index +
                                    rarity +
                                    count +
                                    salt +
                                    indexPosition
                            ))
                    ) selectedPaths[count++] = uint32(section[index]);

                    unchecked {
                        ++index;
                    }
                }

                //pick an asset
                uint256 result = 0;

                if (count <= 1) assetsId[indexPosition++] = selectedPaths[0];
                else if (count >= 2) {
                    result = randomNumberController.unsafeNumber(
                        count,
                        selectedPaths.length + count + indexPosition + salt
                    );
                    if (result < selectedPaths.length)
                        assetsId[indexPosition++] = selectedPaths[result];
                    else assetsId[indexPosition++] = 0;
                }

                unchecked {
                    ++i;
                }
            }
        }
    }

    function setSectionAssets(
        uint32 sectionId,
        uint256[] memory _assets
    ) public onlyDeployer {
        assetsSections[sectionId] = _assets;
    }

    function pushSectionAssets(uint256[] memory _assets) public onlyDeployer {
        assetsSections.push(_assets);
    }

    function flatPathSections(uint32[] memory pathIds) public onlyDeployer {
        pathSections[0] = pathIds;
        flatSections = true;
    }

    function setPathSections(
        uint32[] memory pathIds,
        uint256[][] memory _sections
    ) public onlyDeployer {
        require(pathIds.length == _sections.length);

        for (uint256 i = 0; i < pathIds.length; i++) {
            pathSections[pathIds[i]] = _sections[i];
        }
    }

    function addAssets(uint256[] memory rarities) public onlyDeployer {
        for (uint256 i = 0; i < rarities.length; ) {
            if (rarities[i] > 100) revert('one of more rarities are above 100');
            assetRarity.push(rarities[i]);
            //increment asset counter
            assetId += 1;
            unchecked {
                ++i;
            }
        }
    }

    function addAsset(uint256 rarity) public virtual override onlyDeployer {
        if (rarity > 100) revert();

        //increment asset counter
        assetRarity.push(rarity);
        assetId += 1;
    }

    //returns randomised colours for SVG Paths
    function getColours(
        uint32 pathId,
        RandomNumber randomNumberController
    ) public view virtual override returns (uint32[] memory result) {
        uint32 pathSize = getPathSize(pathId);
        uint256 div = valuesController.tryGetValue('colourChunkSize');

        if (div <= 0) div = 4;

        if (pathSize <= div) {
            result = new uint32[](4);
            result[0] = uint32(
                randomNumberController.unsafeNumber(
                    0xFFFFFF,
                    randomNumberController.salt() + block.timestamp + 3
                )
            );
            result[1] = pathSize;
            result[2] = uint32(
                randomNumberController.unsafeNumber(
                    0xFFFFFF,
                    randomNumberController.salt() + block.timestamp + 6
                )
            );
            result[3] = uint32(valuesController.tryGetValue('extraColours'));
            return result;
        }

        uint32 groups = uint32(1 + (pathSize / div));
        uint32 size = (groups * 2);
        uint32 tempPathSize = (pathSize);
        uint256 count = 0;
        result = new uint32[](size + 2);
        for (uint256 i = 0; i < size; ) {
            if (i == 0 || i % 2 == 0)
                result[i] = uint32(
                    randomNumberController.unsafeNumber(
                        0xFFFFFF,
                        randomNumberController.salt() + block.timestamp + i + 9
                    )
                );
            else {
                uint256 tempResult = tempPathSize - (div * count++);
                result[i] = uint32(tempResult > div ? div : tempResult);
            }

            unchecked {
                ++i;
            }
        }

        result[result.length - 2] = uint32(
            randomNumberController.unsafeNumber(
                0xFFFFFF,
                randomNumberController.salt() + block.timestamp + 24
            )
        );
        result[result.length - 1] = uint32(
            valuesController.tryGetValue('extraColours')
        );
    }

    function setPathDisabled(uint32 pathId, bool value) public onlyApproved {
        //if path zero is suddenly disabled, we need a new safe path to return
        if (pathId == safeDefaultReturnPath && value) {
            uint256 val = (safeDefaultReturnPath);
            while (disabledPaths[val]) {
                if (val >= pathCount) val = safeDefaultReturnPath;
                val++;
            }
            safeDefaultReturnPath = val;
        }

        //if we enable zero again then its safe to return 0
        if (pathId <= safeDefaultReturnPath && value)
            safeDefaultReturnPath = pathId;

        disabledPaths[pathId] = value;
    }

    function setPathCount(uint256 newPathCount) public onlyApproved {
        pathCount = newPathCount;
    }
}
