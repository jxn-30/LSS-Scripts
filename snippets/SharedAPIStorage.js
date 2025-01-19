const ONE_MINUTE = 60 * 1000;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;

/**
 * @typedef {Object} Mission
 */

class SharedAPIStorage {
    static #TABLES = {
        lastUpdates: 'lastUpdates',
        missionTypes: 'missionTypes',
        userInfo: 'userinfo',
        allianceInfo: 'allianceinfo',
        settings: 'settings',
        allianceMembers: 'allianceMembers',
    };

    static #INDEXES = {
        allianceMembers: {
            name: 'name',
        },
    };

    #DB_NAME = `shared-api-storage`;

    /** @type {IDBDatabase | null} */
    #db = null;

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

        // In version 1, we introduced:
        // * a table for lastUpdates
        // * storing missionTypes
        // * storing simple APIs such as userinfo, allianceinfo and settings
        if (oldVersion < 1) {
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.lastUpdates)
                    .transaction
            );
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.missionTypes, {
                    keyPath: 'id',
                }).transaction
            );
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.userInfo)
                    .transaction
            );
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.allianceInfo)
                    .transaction
            );
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.settings)
                    .transaction
            );
            addTransaction(
                (() => {
                    const store = this.#db.createObjectStore(
                        this.#class.#TABLES.allianceMembers,
                        { keyPath: 'id' }
                    );
                    store.createIndex(
                        'name',
                        this.#class.#INDEXES.allianceMembers.name,
                        { unique: true }
                    );

                    return store.transaction;
                })()
            );
        }

        await Promise.all(transactions);
    }

    get #class() {
        return this.constructor;
    }

    /**
     * @param {IDBDatabase} db
     */
    #setDB(db) {
        if (this.#db) return;
        this.#db = db;
    }

    #openDB() {
        if (this.#db) return Promise.resolve(this.#db);
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.#DB_NAME, 1);

            let upgradeNeeded = false;

            request.addEventListener('success', () => {
                if (upgradeNeeded) return;
                this.#setDB(request.result);
                return resolve(request.result);
            });
            request.addEventListener('error', () => reject(request.error));

            request.addEventListener('upgradeneeded', async event => {
                upgradeNeeded = true;
                this.#setDB(request.result);
                await this.#upgradeDB(event);
                return resolve(request.result);
            });
        });
    }

    #closeDB() {
        if (this.#db) this.#db.close();
        this.#db = null;
    }

    #getEntry(table, key, index) {
        return this.#openDB()
            .then(db => {
                const tx = db.transaction(table, 'readonly');
                const store = tx.objectStore(table);
                const request =
                    index ? store.index(index).get(key) : store.get(key);
                return new Promise((resolve, reject) => {
                    request.addEventListener('success', () =>
                        resolve(request.result)
                    );
                    request.addEventListener('error', () =>
                        reject(request.error)
                    );
                });
            })
            .finally(() => this.#closeDB());
    }

    #getTable(table, object = false) {
        return this.#openDB()
            .then(db => {
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
                    request.addEventListener('error', () =>
                        reject(request.error)
                    );
                });
            })
            .finally(() => this.#closeDB());
    }

    // region lastUpdates
    #setLastUpdate(table) {
        return this.#openDB()
            .then(db => {
                const tx = db.transaction(
                    this.#class.#TABLES.lastUpdates,
                    'readwrite'
                );
                const store = tx.objectStore(this.#class.#TABLES.lastUpdates);
                store.put(Date.now(), table);
            })
            .finally(() => this.#closeDB());
    }

    #getLastUpdate(table) {
        return this.#getEntry(this.#class.#TABLES.lastUpdates, table).then(
            res => res || 0
        );
    }

    async #needsUpdate(table, treshhold) {
        return Date.now() - (await this.#getLastUpdate(table)) > treshhold;
    }
    // endregion

    // region missionTypes
    async #updateMissionTypes() {
        const table = this.#class.#TABLES.missionTypes;

        if (!(await this.#needsUpdate(table, ONE_HOUR))) return;

        return Promise.all([
            this.#openDB(),
            fetch('/einsaetze.json').then(res => res.json()),
        ])
            .then(([db, missionTypes]) => {
                const tx = db.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                missionTypes.forEach(missionType => {
                    store.put(missionType);
                });
                return new Promise((resolve, reject) => {
                    tx.addEventListener('complete', () => resolve());
                    tx.addEventListener('error', () => reject(tx.error));
                });
            })
            .then(() => this.#setLastUpdate(table))
            .finally(() => this.#closeDB());
    }

    /**
     * @returns {Promise<Record<string, Mission>>}
     */
    async getMissionTypes() {
        await this.#updateMissionTypes();

        return this.#getTable(this.#class.#TABLES.missionTypes).then(
            missionTypes => {
                // indexedDB returns an array, so we need to convert it to an object
                /** @type {Record<string, Mission>} */
                const missionTypesObject = {};
                missionTypes.forEach(missionType => {
                    missionTypesObject[missionType.id] = missionType;
                });
                return missionTypesObject;
            }
        );
    }

    getMission(id) {
        return this.#getEntry(this.#class.#TABLES.missionTypes, id);
    }
    // endregion

    // region simple APIs (userinfo, allianceinfo, settings)
    async #updateSimpleAPI(table, endpoint) {
        if (!(await this.#needsUpdate(table, FIVE_MINUTES))) return;

        return Promise.all([
            this.#openDB(),
            fetch(`/api/${endpoint}`).then(res => res.json()),
        ])
            .then(([db, result]) => {
                const tx = db.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                Object.entries(result).forEach(([key, value]) =>
                    store.put(value, key)
                );
                return new Promise((resolve, reject) => {
                    tx.addEventListener('complete', () => resolve(result));
                    tx.addEventListener('error', () => reject(tx.error));
                });
            })
            .then(result => this.#setLastUpdate(table).then(() => result))
            .finally(() => this.#closeDB());
    }

    #updateAllianceInfo() {
        const membersTable = this.#class.#TABLES.allianceMembers;
        return this.#updateSimpleAPI(
            this.#class.#TABLES.allianceInfo,
            'allianceinfo'
        ).then(async result => {
            if (!result) return;
            const db = await this.#openDB();
            const tx = db.transaction(membersTable, 'readwrite');
            const store = tx.objectStore(membersTable);
            result.users.forEach(user => store.put(user));
            return new Promise((resolve, reject) => {
                tx.addEventListener('complete', () => resolve());
                tx.addEventListener('error', () => reject(tx.error));
            });
        });
    }

    async getUserInfo(key) {
        const table = this.#class.#TABLES.userInfo;
        await this.#updateSimpleAPI(table, 'userinfo');
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }

    async getAllianceInfo(key) {
        const table = this.#class.#INDEXES.allianceMembers.name;
        await this.#updateAllianceInfo();
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }

    async getSettings(key) {
        const table = this.#class.#TABLES.settings;
        await this.#updateSimpleAPI(table, 'settings');
        if (key) return this.#getEntry(table, key);
        else return this.#getTable(table, true);
    }
    // endregion

    async getAllianceMembers(nameOrId) {
        await this.#updateAllianceInfo();
        const table = this.#class.#TABLES.allianceMembers;
        if (typeof nameOrId === 'number')
            return this.#getEntry(table, nameOrId);
        else if (typeof nameOrId === 'string')
            return this.#getEntry(
                table,
                nameOrId,
                this.#class.#INDEXES.allianceMembers.name
            );
        else return this.#getTable(table);
    }
}

this.sharedAPIStorage = new SharedAPIStorage();
