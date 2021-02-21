class StopwatchStore {
    constructor(options) {
        this.trie = new Trie();
        this.name = options.name || "stopwatch_cache";
    }

    getLocalStorage() {
        const item = localStorage.getItem(this.name);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (err) {
                console.error(err);
                localStorage.removeItem(this.name);
            }
        }

        return null;
    }

    setLocalStorage() {
        if (this.DATA_CACHE.size > 0) {
            const obj = {};
            for (const [key, value] of this.DATA_CACHE) {
                obj[key] = value;
            }

            localStorage.setItem(this.name, JSON.stringify(obj));
        }
    }

    init() {
        const items = this.getLocalStorage();
    }
}

class TrieNode {
    constructor(data) {
        this.is_word = false;
        this.children = {};
        this.data = data || null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    add(word) {
        let node = this.root;
        for (const char of word) {
            if (node.children.hasOwnProperty(char)) {
                ndoe = node.children[char];
            } else {
                node.children[char] = new TrieNode();
                node = node.children[char];
            }
        }

        node.is_word = true;
        return node;
    }

    find(prefix) {
        let node = this.root;

        for (const char of prefix) {
            if (node.children.hasOwnProperty(char)) {
                node = node.children[char];
            } else {
                return null;
            }
        }

        return node;
    }
}

export default StopwatchStore;
