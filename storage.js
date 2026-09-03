(function () {
    "use strict";

    // Change defaultMode to "folder" when folder storage should be primary.
    // Browsers cannot accept an absolute Windows path here. The picker starts in
    // Downloads and remembers the folder the user authorizes the first time.
    const STORAGE_CONFIG = Object.freeze({
        defaultMode: "local",
        dataDirectoryName: "flashcard-data",
        folderPickerId: "flashcard-app-project-folder",
        folderPickerStartIn: "downloads"
    });

    const APP_DATA_KEY = "flashcardAppData";
    const DATABASE_NAME = "flashcardStorage";
    const HANDLE_STORE = "handles";
    const DIRECTORY_HANDLE_KEY = "flashcardDirectory";

    function createEmptyData() {
        return {
            languages: [],
            cards: [],
            settings: {
                sessionGoal: 10,
                tomatoes: 0,
                masterFilterValue: "all",
                goalCompletionDates: [],
                showPronunciationField: true,
                showCategoryField: true,
                showTablePronunciationColumn: true,
                showTablePropertyColumn: true,
                practiceReverseSides: false,
                practiceShowPronunciation: false,
                practiceShowCategory: false
            }
        };
    }

    function normalizeData(data) {
        const defaults = createEmptyData();
        const source = data && typeof data === "object" ? data : {};
        const settings = source.settings && typeof source.settings === "object"
            ? source.settings
            : {};

        return {
            languages: Array.isArray(source.languages) ? source.languages : [],
            cards: Array.isArray(source.cards) ? source.cards : [],
            settings: {
                sessionGoal: Number(settings.sessionGoal) || defaults.settings.sessionGoal,
                tomatoes: Number(settings.tomatoes) || 0,
                masterFilterValue: settings.masterFilterValue || "all",
                goalCompletionDates: Array.isArray(settings.goalCompletionDates)
                    ? [...new Set(settings.goalCompletionDates.filter(date => typeof date === "string"))]
                    : [],
                showPronunciationField: settings.showPronunciationField !== false,
                showCategoryField: settings.showCategoryField !== false,
                showTablePronunciationColumn: settings.showTablePronunciationColumn !== false,
                showTablePropertyColumn: settings.showTablePropertyColumn !== false,
                practiceReverseSides: settings.practiceReverseSides === true,
                practiceShowPronunciation: settings.practiceShowPronunciation === true,
                practiceShowCategory: settings.practiceShowCategory === true
            }
        };
    }

    function parseJson(value, fallback) {
        if (!value) return fallback;
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn("Invalid saved JSON was ignored.", error);
            return fallback;
        }
    }

    class LocalStorageAdapter {
        async load() {
            const bundledData = localStorage.getItem(APP_DATA_KEY);

            if (bundledData) {
                return normalizeData(parseJson(bundledData, createEmptyData()));
            }

            // Import data created by the original version of the app.
            return normalizeData({
                languages: parseJson(localStorage.getItem("languages"), []),
                cards: parseJson(localStorage.getItem("cards"), []),
                settings: {
                    sessionGoal: localStorage.getItem("sessionGoal"),
                    tomatoes: localStorage.getItem("tomatoes"),
                    masterFilterValue: localStorage.getItem("masterFilterValue"),
                    goalCompletionDates: parseJson(localStorage.getItem("goalCompletionDates"), []),
                    showPronunciationField: localStorage.getItem("showPronunciationField") !== "false",
                    showCategoryField: localStorage.getItem("showCategoryField") !== "false",
                    showTablePronunciationColumn: localStorage.getItem("showTablePronunciationColumn") !== "false",
                    showTablePropertyColumn: localStorage.getItem("showTablePropertyColumn") !== "false",
                    practiceReverseSides: localStorage.getItem("practiceReverseSides") === "true",
                    practiceShowPronunciation: localStorage.getItem("practiceShowPronunciation") === "true",
                    practiceShowCategory: localStorage.getItem("practiceShowCategory") === "true"
                }
            });
        }

        async save(data) {
            const normalized = normalizeData(data);
            localStorage.setItem(APP_DATA_KEY, JSON.stringify(normalized));

            // Keep the old keys updated while the app is being migrated.
            localStorage.setItem("languages", JSON.stringify(normalized.languages));
            localStorage.setItem("cards", JSON.stringify(normalized.cards));
            localStorage.setItem("sessionGoal", String(normalized.settings.sessionGoal));
            localStorage.setItem("tomatoes", String(normalized.settings.tomatoes));
            localStorage.setItem("masterFilterValue", normalized.settings.masterFilterValue);
            localStorage.setItem("goalCompletionDates", JSON.stringify(normalized.settings.goalCompletionDates));
            localStorage.setItem("showPronunciationField", String(normalized.settings.showPronunciationField));
            localStorage.setItem("showCategoryField", String(normalized.settings.showCategoryField));
            localStorage.setItem("showTablePronunciationColumn", String(normalized.settings.showTablePronunciationColumn));
            localStorage.setItem("showTablePropertyColumn", String(normalized.settings.showTablePropertyColumn));
            localStorage.setItem("practiceReverseSides", String(normalized.settings.practiceReverseSides));
            localStorage.setItem("practiceShowPronunciation", String(normalized.settings.practiceShowPronunciation));
            localStorage.setItem("practiceShowCategory", String(normalized.settings.practiceShowCategory));
        }
    }

    class FolderStorageAdapter {
        constructor(directoryHandle) {
            this.directoryHandle = directoryHandle;
        }

        async getDataDirectory(create = false) {
            return this.directoryHandle.getDirectoryHandle(STORAGE_CONFIG.dataDirectoryName, { create });
        }

        async readJson(directory, fileName, fallback) {
            try {
                const fileHandle = await directory.getFileHandle(fileName);
                const file = await fileHandle.getFile();
                return JSON.parse(await file.text());
            } catch (error) {
                if (error.name === "NotFoundError") return fallback;
                throw error;
            }
        }

        async writeJson(directory, fileName, value) {
            const fileHandle = await directory.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(value, null, 2));
            await writable.close();
        }

        async hasData() {
            try {
                const directory = await this.getDataDirectory(false);
                await directory.getFileHandle("cards.json");
                return true;
            } catch (error) {
                if (error.name === "NotFoundError") return false;
                throw error;
            }
        }

        async load() {
            const directory = await this.getDataDirectory(false);
            const [languages, cards, settings] = await Promise.all([
                this.readJson(directory, "languages.json", []),
                this.readJson(directory, "cards.json", []),
                this.readJson(directory, "settings.json", {})
            ]);

            return normalizeData({ languages, cards, settings });
        }

        async save(data) {
            const normalized = normalizeData(data);
            const directory = await this.getDataDirectory(true);

            await Promise.all([
                this.writeJson(directory, "languages.json", normalized.languages),
                this.writeJson(directory, "cards.json", normalized.cards),
                this.writeJson(directory, "settings.json", normalized.settings)
            ]);
        }
    }

    // A future database adapter only needs to provide async load() and save(data).
    // For example: class SupabaseStorageAdapter { async load() {} async save(data) {} }

    function openHandleDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DATABASE_NAME, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(HANDLE_STORE);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function saveDirectoryHandle(handle) {
        const database = await openHandleDatabase();
        await new Promise((resolve, reject) => {
            const transaction = database.transaction(HANDLE_STORE, "readwrite");
            transaction.objectStore(HANDLE_STORE).put(handle, DIRECTORY_HANDLE_KEY);
            transaction.oncomplete = resolve;
            transaction.onerror = () => reject(transaction.error);
        });
        database.close();
    }

    async function loadDirectoryHandle() {
        const database = await openHandleDatabase();
        const handle = await new Promise((resolve, reject) => {
            const transaction = database.transaction(HANDLE_STORE, "readonly");
            const request = transaction.objectStore(HANDLE_STORE).get(DIRECTORY_HANDLE_KEY);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
        database.close();
        return handle;
    }

    class StorageManager {
        constructor() {
            this.localAdapter = new LocalStorageAdapter();
            this.activeAdapter = this.localAdapter;
            this.mode = "local";
            this.preferredMode = STORAGE_CONFIG.defaultMode;
            this.saveQueue = Promise.resolve();
        }

        async initialize() {
            const localData = await this.localAdapter.load();

            if (this.preferredMode !== "folder") {
                return localData;
            }

            try {
                const handle = await loadDirectoryHandle();
                if (!handle || await handle.queryPermission({ mode: "readwrite" }) !== "granted") {
                    return localData;
                }

                const folderAdapter = new FolderStorageAdapter(handle);
                if (await folderAdapter.hasData()) {
                    this.activeAdapter = folderAdapter;
                    this.mode = "folder";
                    const folderData = await folderAdapter.load();
                    await this.localAdapter.save(folderData);
                    return folderData;
                }
            } catch (error) {
                console.warn("Folder storage could not be restored.", error);
            }

            return localData;
        }

        async useFolder(currentData) {
            if (!("showDirectoryPicker" in window)) {
                throw new Error("Folder storage requires Chrome, Edge, or another browser that supports the File System Access API.");
            }

            const handle = await window.showDirectoryPicker({
                id: STORAGE_CONFIG.folderPickerId,
                mode: "readwrite",
                startIn: STORAGE_CONFIG.folderPickerStartIn
            });
            const folderAdapter = new FolderStorageAdapter(handle);
            let dataToUse = normalizeData(currentData);

            if (await folderAdapter.hasData()) {
                const choice = window.prompt(
                    "This folder already contains flashcard data. Type LOAD to use it, REPLACE to overwrite it with the current app data, or CANCEL to stop.",
                    "CANCEL"
                );
                const action = (choice || "CANCEL").trim().toUpperCase();

                if (action === "LOAD") {
                    dataToUse = await folderAdapter.load();
                } else if (action !== "REPLACE") {
                    throw new DOMException("Folder selection cancelled.", "AbortError");
                }
            }

            await saveDirectoryHandle(handle);
            return this.useAdapter("folder", folderAdapter, dataToUse);
        }

        async useLocal(currentData) {
            return this.useAdapter("local", this.localAdapter, currentData);
        }

        // Database adapters can be activated through this same method.
        async useAdapter(mode, adapter, currentData) {
            if (!adapter || typeof adapter.load !== "function" || typeof adapter.save !== "function") {
                throw new TypeError("A storage adapter must provide load() and save(data) methods.");
            }

            const normalized = normalizeData(currentData);
            await adapter.save(normalized);
            if (adapter !== this.localAdapter) await this.localAdapter.save(normalized);

            this.activeAdapter = adapter;
            this.mode = mode;
            this.preferredMode = mode;
            return normalized;
        }

        needsFolderConnection() {
            return this.preferredMode === "folder" && this.mode !== "folder";
        }

        save(data) {
            const snapshot = normalizeData(data);
            const targetAdapter = this.activeAdapter;
            this.saveQueue = this.saveQueue.catch(() => {}).then(async () => {
                await targetAdapter.save(snapshot);
                if (targetAdapter !== this.localAdapter) {
                    await this.localAdapter.save(snapshot);
                }
            });
            return this.saveQueue;
        }
    }

    window.FlashcardStorageAdapters = {
        LocalStorageAdapter,
        FolderStorageAdapter,
        StorageManager
    };
    window.flashcardStorageConfig = STORAGE_CONFIG;
    window.flashcardStorage = new StorageManager();
})();
