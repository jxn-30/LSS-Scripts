/**
 * @typedef {Object} Mission
 */

class SharedAPIStorage {
    static #TABLES = {
        lastUpdates: 'lastUpdates',
        missionTypes: 'missionTypes',
    };

    #DB_NAME = `shared-api-storage`;

    /** @type {IDBDatabase | null} */
    #db = null;

    /**
     * @param {IDBVersionChangeEvent} event
     */
    async #upgradeDB({ oldVersion }) {
        if (!this.#db) return;

        /** @type {Promise<void>[]} */
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

        // In version 1, we introduced storing missionTypes and a table for lastUpdates
        if (oldVersion < 1) {
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.lastUpdates, {
                    keyPath: 'api',
                }).transaction
            );
            addTransaction(
                this.#db.createObjectStore(this.#class.#TABLES.missionTypes, {
                    keyPath: 'id',
                }).transaction
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

    #getEntry(table, key) {
        return this.#openDB()
            .then(db => {
                const tx = db.transaction(table, 'readonly');
                const store = tx.objectStore(table);
                const request = store.get(key);
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

    #getTable(table) {
        return this.#openDB()
            .then(db => {
                const tx = db.transaction(table, 'readonly');
                const store = tx.objectStore(table);
                const request = store.getAll();
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

    // region lastUpdates
    #setLastUpdate(table) {
        return this.#openDB()
            .then(db => {
                const tx = db.transaction(
                    this.#class.#TABLES.lastUpdates,
                    'readwrite'
                );
                const store = tx.objectStore(this.#class.#TABLES.lastUpdates);
                store.put({ api: table, lastUpdate: Date.now() });
            })
            .finally(() => this.#closeDB());
    }

    #getLastUpdate(table) {
        return this.#getEntry(this.#class.#TABLES.lastUpdates, table).then(
            res => res?.lastUpdate ?? 0
        );
    }
    // endregion

    // region missionTypes
    async updateMissionTypes() {
        const table = this.#class.#TABLES.missionTypes;

        const lastUpdate = await this.#getLastUpdate(table);

        if (Date.now() - lastUpdate < 60 * 60 * 1000) return;

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
    getMissionTypes() {
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
    // endregion
}

this.sharedAPIStorage = new SharedAPIStorage();
