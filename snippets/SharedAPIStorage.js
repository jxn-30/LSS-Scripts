const CURRENT_DB_VERSION = 3;

const ONE_MINUTE = 60 * 1000;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;

const TABLES = {
    lastUpdates: 'lastUpdates',
    missionTypes: 'missionTypes',
    allianceEventTypes: 'allianceEventTypes',
    userInfo: 'userinfo',
    allianceInfo: 'allianceinfo',
    settings: 'settings',
    allianceMembers: 'allianceMembers',
    vehicles: 'vehicles',
    buildings: 'buildings',
};

const INDEXES = {
    allianceMembers: {
        name: 'name',
    },
    allianceEventTypes: {
        name: 'caption',
    },
    vehicles: {
        building: 'building_id',
        vehicleType: 'vehicle_type',
    },
    buildings: {
        dispatchCenter: 'leitstelle_building_id',
        buildingType: 'building_type',
    },
};

/**
 * @typedef {Object} Mission
 */

class SharedAPIStorage {
    #DB_NAME = `shared-api-storage`;

    /** @type {IDBDatabase | null} */
    #db = null;
    #connections = 0;

    /**
     * @param {IDBVersionChangeEvent} event
     */
    async #upgradeDB({ oldVersion }) {
        if (!this.#db) return;

        /** @type {Promise<void>[} */
        const transactions = [];

        /**
         * @param {IDBTransaction} transaction
         */
        const addTransaction = transaction =>
            transactions.push(
                new Promise(resolve =>
                    transaction.addEventListener('complete', () => resolve())
                )
            );

        const createTable = (table, keyPath = undefined) =>
            this.#db.createObjectStore(table, { keyPath });
        const createIndex = (store, index, unique = true) =>
            store.createIndex(index, index, { unique });

        // In version 1, we introduced:
        // * a table for lastUpdates
        // * storing missionTypes
        // * storing simple APIs such as userinfo, allianceinfo and settings
        if (oldVersion < 1) {
            addTransaction(createTable(TABLES.lastUpdates).transaction);
            addTransaction(createTable(TABLES.missionTypes, 'id').transaction);
            addTransaction(createTable(TABLES.userInfo).transaction);
            addTransaction(createTable(TABLES.allianceInfo).transaction);
            addTransaction(createTable(TABLES.settings).transaction);
            addTransaction(
                (() => {
                    const store = createTable(TABLES.allianceMembers, 'id');
                    createIndex(store, INDEXES.allianceMembers.name);

                    return store.transaction;
                })()
            );
        }

        // In version 2, we introduced:
        // * storing allianceEventTypes
        if (oldVersion < 2) {
            addTransaction(
                (() => {
                    const store = createTable(TABLES.allianceEventTypes, 'id');
                    createIndex(store, INDEXES.allianceEventTypes.name);

                    return store.transaction;
                })()
            );
        }

        // In version 3, we introduced:
        // * storing vehicles
        // * storing buildings
        if (oldVersion < 3) {
            addTransaction(
                (() => {
                    const store = createTable(TABLES.vehicles, 'id');
                    createIndex(store, INDEXES.vehicles.building, false);
                    createIndex(store, INDEXES.vehicles.vehicleType, false);

                    return store.transaction;
                })()
            );
            addTransaction(
                (() => {
                    const store = createTable(TABLES.buildings, 'id');
                    createIndex(store, INDEXES.buildings.dispatchCenter, false);
                    createIndex(store, INDEXES.buildings.buildingType, false);

                    return store.transaction;
                })()
            );
        }

        await Promise.all(transactions);
    }

    /**
     * @param {IDBDatabase} db
     */
    #setDB(db) {
        if (this.#db) return;
        this.#db = db;
    }

    /**
     * @param {(db: IDBDatabase) => void|Promise<void>} callback
     */
    #openDB(callback) {
        this.#connections++;
        const promise =
            this.#db ?
                Promise.resolve(this.#db)
            :   new Promise((resolve, reject) => {
                    const request = indexedDB.open(
                        this.#DB_NAME,
                        CURRENT_DB_VERSION
                    );

                    let upgradeNeeded = false;

                    request.addEventListener('success', () => {
                        if (upgradeNeeded) return;
                        this.#setDB(request.result);
                        return resolve(request.result);
                    });
                    request.addEventListener('error', () =>
                        reject(request.error)
                    );

                    request.addEventListener('upgradeneeded', async event => {
                        upgradeNeeded = true;
                        this.#setDB(request.result);
                        await this.#upgradeDB(event);
                        return resolve(request.result);
                    });
                });

        return promise
            .then(async () => await callback(this.#db))
            .finally(() => this.#closeDB());
    }

    #closeDB(connection) {
        this.#connections--;
        if (this.#connections > 0) return;
        if (this.#db) this.#db.close();
        this.#db = null;
    }

    #getEntry(table, key, index) {
        return this.#openDB(db => {
            const tx = db.transaction(table, 'readonly');
            const store = tx.objectStore(table);
            const storeIndex = index ? store.index(index) : null;
            const request =
                storeIndex?.unique ?
                    storeIndex.get(key)
                :   (storeIndex?.getAll(key) ?? store.get(key));
            return new Promise((resolve, reject) => {
                request.addEventListener('success', () =>
                    resolve(request.result)
                );
                request.addEventListener('error', () => reject(request.error));
            });
        });
    }

    #getKeys(table) {
        return this.#openDB(db => {
            const tx = db.transaction(table, 'readonly');
            const store = tx.objectStore(table);
            const request = store.getAllKeys();
            return new Promise((resolve, reject) => {
                request.addEventListener('success', () =>
                    resolve(new Set(request.result))
                );
                request.addEventListener('error', () => reject(request.error));
            });
        });
    }

    #getTable(table, object = false) {
        return this.#openDB(db => {
            const tx = db.transaction(table, 'readonly');
            const store = tx.objectStore(table);
            if (!object) {
                const request = store.getAll();
                return new Promise((resolve, reject) => {
                    request.addEventListener('success', () =>
                        resolve(request.result)
                    );
                    request.addEventListener('error', () =>
                        reject(request.error)
                    );
                });
            }
            const request = store.openCursor();
            const result = {};
            return new Promise((resolve, reject) => {
                request.addEventListener('success', event => {
                    const cursor = event.target.result;
                    if (!cursor) return resolve(result);
                    result[cursor.key] = cursor.value;
                    cursor.continue();
                });
                request.addEventListener('error', () => reject(request.error));
            });
        });
    }

    // region lastUpdates
    #setLastUpdate(table) {
        return this.#openDB(db => {
            const tx = db.transaction(TABLES.lastUpdates, 'readwrite');
            const store = tx.objectStore(TABLES.lastUpdates);
            store.put(Date.now(), table);
        });
    }

    #getLastUpdate(table) {
        return this.#getEntry(TABLES.lastUpdates, table).then(res => res || 0);
    }

    async #needsUpdate(table, treshhold) {
        return Date.now() - (await this.#getLastUpdate(table)) > treshhold;
    }
    // endregion

    // region missionTypes
    async #updateMissionTypes() {
        const table = TABLES.missionTypes;

        if (!(await this.#needsUpdate(table, ONE_HOUR))) return;

        return fetch('/einsaetze.json')
            .then(res => res.json())
            .then(missionTypes =>
                this.#openDB(async db => {
                    const storedMissionTypes = await this.#getKeys(table);
                    const tx = db.transaction(table, 'readwrite');
                    const store = tx.objectStore(table);
                    const currentMissionTypes = new Set();
                    missionTypes.forEach(missionType => {
                        currentMissionTypes.add(missionType.id);
                        store.put(missionType);
                    });
                    storedMissionTypes
                        .difference(currentMissionTypes)
                        .forEach(id => store.delete(id));
                    return new Promise((resolve, reject) => {
                        tx.addEventListener('complete', () => resolve());
                        tx.addEventListener('error', () => reject(tx.error));
                    });
                }).then(() => this.#setLastUpdate(table))
            );
    }

    /**
     * @returns {Promise<Record<string, Mission>>}
     */
    async getMissionTypes(id) {
        await this.#updateMissionTypes();

        if (void 0 !== id)
            return this.#getEntry(TABLES.missionTypes, id.toString());
        return this.#getTable(TABLES.missionTypes).then(missionTypes => {
            // indexedDB returns an array, so we need to convert it to an object
            /** @type {Record<string, Mission>} */
            const missionTypesObject = {};
            missionTypes.forEach(
                missionType =>
                    (missionTypesObject[missionType.id] = missionType)
            );
            return missionTypesObject;
        });
    }
    // endregion

    // region simple APIs (userinfo, allianceinfo, settings)
    async #updateSimpleAPI(table, endpoint) {
        if (!(await this.#needsUpdate(table, FIVE_MINUTES))) return;

        return fetch(`/api/${endpoint}`)
            .then(res => res.json())
            .then(result =>
                this.#openDB(db => {
                    const tx = db.transaction(table, 'readwrite');
                    const store = tx.objectStore(table);
                    Object.entries(result).forEach(([key, value]) =>
                        store.put(value, key)
                    );
                    return new Promise((resolve, reject) => {
                        tx.addEventListener('complete', () => resolve(result));
                        tx.addEventListener('error', () => reject(tx.error));
                    });
                }).then(result => this.#setLastUpdate(table).then(() => result))
            );
    }

    #updateAllianceInfo() {
        const membersTable = TABLES.allianceMembers;
        return this.#updateSimpleAPI(TABLES.allianceInfo, 'allianceinfo').then(
            result =>
                result ?
                    this.#openDB(async db => {
                        const storedUserIDs = await this.#getKeys(membersTable);
                        const tx = db.transaction(membersTable, 'readwrite');
                        const store = tx.objectStore(membersTable);
                        const currentUserIDs = new Set();
                        result.users.forEach(user => {
                            currentUserIDs.add(user.id);
                            store.put(user);
                        });
                        storedUserIDs
                            .difference(currentUserIDs)
                            .forEach(id => store.delete(id));
                        return new Promise((resolve, reject) => {
                            tx.addEventListener('complete', () => resolve());
                            tx.addEventListener('error', () =>
                                reject(tx.error)
                            );
                        });
                    })
                :   void 0
        );
    }

    async getUserInfo(key) {
        const table = TABLES.userInfo;
        await this.#updateSimpleAPI(table, 'userinfo');
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }

    async getAllianceInfo(key) {
        const table = INDEXES.allianceMembers.name;
        await this.#updateAllianceInfo();
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }

    async getSettings(key) {
        const table = TABLES.settings;
        await this.#updateSimpleAPI(table, 'settings');
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }

    async getAllianceMembers(nameOrId) {
        await this.#updateAllianceInfo();
        const table = TABLES.allianceMembers;
        if (typeof nameOrId === 'number')
            return this.#getEntry(table, nameOrId);
        else if (typeof nameOrId === 'string')
            return this.#getEntry(
                table,
                nameOrId,
                INDEXES.allianceMembers.name
            );
        else return this.#getTable(table);
    }
    // endregion

    // region allianceEventTypes
    async #updateAllianceEventTypes() {
        const table = TABLES.allianceEventTypes;

        if (!(await this.#needsUpdate(table, ONE_HOUR))) return;

        return fetch('/alliance_event_types.json')
            .then(res => res.json())
            .then(allianceEventTypes =>
                this.#openDB(db => {
                    const tx = db.transaction(table, 'readwrite');
                    const store = tx.objectStore(table);
                    allianceEventTypes.forEach(eventType =>
                        store.put(eventType)
                    );
                    return new Promise((resolve, reject) => {
                        tx.addEventListener('complete', () => resolve());
                        tx.addEventListener('error', () => reject(tx.error));
                    });
                })
            )
            .then(() => this.#setLastUpdate(table));
    }

    async getAllianceEventTypes(nameOrId) {
        await this.#updateAllianceEventTypes();
        const table = TABLES.allianceEventTypes;
        if (typeof nameOrId === 'number')
            return this.#getEntry(table, nameOrId);
        else if (typeof nameOrId === 'string')
            return this.#getEntry(
                table,
                nameOrId,
                INDEXES.allianceEventTypes.name
            );
        else return this.#getTable(table);
    }
    // endregion

    async *#fetchV2API(api, id) {
        let nextPage = `/api/v2/${api}${id ? `/${id}` : ''}`;
        while (nextPage) {
            yield await fetch(nextPage)
                .then(res => res.json())
                .then(res => {
                    nextPage = res.paging?.next_page;
                    return res.result;
                });
        }
    }

    async #updateV2API(table, endpoint, id, callback) {
        const single = void 0 !== id;
        if (!single && !(await this.#needsUpdate(table, FIVE_MINUTES))) return;

        const storedIDs = await this.#getKeys(table);
        const currentIDs = new Set();

        for await (const result of this.#fetchV2API(endpoint, id)) {
            await this.#openDB(db => {
                const tx = db.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                if (single) store.put(result);
                else
                    result.forEach(item => {
                        currentIDs.add(item.id);
                        store.put(item);
                    });
                return new Promise((resolve, reject) => {
                    tx.addEventListener('complete', () => resolve());
                    tx.addEventListener('error', () => reject(tx.error));
                });
            });
            callback?.(result);
        }

        if (!single) {
            await this.#setLastUpdate(table);

            const deletedItems = storedIDs.difference(currentIDs);

            if (deletedItems.size === 0) return;

            await this.#openDB(db => {
                const tx = db.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                deletedItems.forEach(id => store.delete(id));
                return new Promise((resolve, reject) => {
                    tx.addEventListener('complete', () => resolve());
                    tx.addEventListener('error', () => reject(tx.error));
                });
            });
        }
    }

    async getVehicles(id, callback) {
        const table = TABLES.vehicles;
        await this.#updateV2API(table, 'vehicles', id, callback);

        if (void 0 !== id) return this.#getEntry(table, id);
        else return this.#getTable(table);
    }

    async getVehiclesOfType(vehicleType, callback) {
        const table = TABLES.vehicles;
        await this.#updateV2API(table, 'vehicles', undefined, callback);

        return this.#getEntry(table, vehicleType, INDEXES.vehicles.vehicleType);
    }

    async #updateBuildings(id) {
        const table = TABLES.buildings;
        const single = void 0 !== id;

        if (!single && !(await this.#needsUpdate(table, FIVE_MINUTES))) return;

        return fetch('/api/buildings' + (id ? `/${id}` : ''))
            .then(res => res.json())
            .then(buildings =>
                this.#openDB(async db => {
                    const storedBuildings = await this.#getKeys(table);
                    const tx = db.transaction(table, 'readwrite');
                    const store = tx.objectStore(table);
                    const currentBuildings = new Set();
                    if (single) store.put(buildings);
                    else {
                        buildings.forEach(building => {
                            currentBuildings.add(building.id);
                            store.put(building);
                        });
                        storedBuildings
                            .difference(currentBuildings)
                            .forEach(id => store.delete(id));
                    }
                    return new Promise((resolve, reject) => {
                        tx.addEventListener('complete', () => resolve());
                        tx.addEventListener('error', () => reject(tx.error));
                    });
                })
            )
            .then(() => this.#setLastUpdate(table));
    }

    async getBuildings(id) {
        await this.#updateBuildings(id);

        if (void 0 !== id) return this.#getEntry(TABLES.buildings, id);
        else return this.#getTable(TABLES.buildings);
    }

    async getBuldingsOfType(buildingType) {
        await this.#updateBuildings();

        return this.#getEntry(
            TABLES.buildings,
            buildingType,
            INDEXES.buildings.buildingType
        );
    }

    async getBuildingsOfDispatchCenter(dispatchCenterId) {
        await this.#updateBuildings();

        return this.#getEntry(
            TABLES.buildings,
            dispatchCenterId,
            INDEXES.buildings.dispatchCenter
        );
    }
}

this.sharedAPIStorage = new SharedAPIStorage();
