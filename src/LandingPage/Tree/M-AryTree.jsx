import React, { useState, useEffect } from "react";
import style from "./M-AryTree.module.css";

export default function MAryTree({ inputValues }) {
    const [root, setRoot] = useState(null);
    const [nodeMap, setNodeMap] = useState(new Map());

    useEffect(() => {
        const buildTree = () => {
            const { Nodes, m } = inputValues;

            if (Nodes.length === 0) return;

            const newMap = new Map();
            const rootNode = new TreeNode(Nodes[0]);
            newMap.set(Nodes[0], rootNode);

            const queue = [rootNode];
            let index = 1;

            while (queue.length > 0 && index < Nodes.length) {
                const current = queue.shift();
                for (let i = 0; i < m && index < Nodes.length; i++) {
                    const childName = Nodes[index];
                    const childNode = new TreeNode(childName, current);
                    current.addChild(childNode);
                    newMap.set(childName, childNode);
                    queue.push(childNode);
                    index++;
                }
            }

            setRoot(rootNode);
            setNodeMap(newMap);
        };

        buildTree();
    }, [inputValues]);

    const lock = (name, userId) => {
        const node = nodeMap.get(name);
        if (!node || node.isLocked || node.lockedDescendantsCount > 0) return false;

        let current = node.parent;
        while (current) {
            if (current.isLocked) return false;
            current = current.parent;
        }

        node.isLocked = true;
        node.lockedBy = userId;

        setNodeMap(new Map(nodeMap));
        return true;
    };

    const unlock = (name, userId) => {
        const node = nodeMap.get(name);
        if (!node || !node.isLocked || node.lockedBy !== userId) return false;

        node.isLocked = false;
        node.lockedBy = -1;

        setNodeMap(new Map(nodeMap)); 
        return true;
    };

    const upgrade = (name, userId) => {
        const node = nodeMap.get(name);
        if (!node || node.isLocked || !canUpgrade(node, userId)) return false;

        unlockDescendants(node, userId);
        return lock(name, userId);
    };

    const canUpgrade = (node, userId) => {
        if (node.isLocked && node.lockedBy !== userId) return false;

        return node.children.every(child => canUpgrade(child, userId));
    };

    const unlockDescendants = (node, userId) => {
        node.children.forEach(child => {
            if (child.isLocked && child.lockedBy === userId) {
                unlock(child.name, userId);
            }
            unlockDescendants(child, userId);
        });
    };

    const renderTree = (node) => {
        if (!node) return null;

        return (
            <div className={`${style.NodeContainer} ${node.isLocked ? style.Locked : style.Unlocked}`} id={node.name}>
                <div className={style.Node}>{node.name}</div>
                <div className={style.Status}>{node.isLocked ? `Locked by ID: ${node.lockedBy}` : "Unlocked"}</div>
                {node.children.length > 0 && (
                    <div className={style.ChildrenContainer}>
                        {node.children.map((child, index) => (
                            <div key={index} className={style.Child}>
                                {renderTree(child)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const operation = parseInt(e.target.Op.value);
        const nodeName = e.target.Node.value;
        const userId = parseInt(e.target.UserId.value);

        let result;
        if (operation === 1) {
            result = lock(nodeName, userId);
        } else if (operation === 2) {
            result = unlock(nodeName, userId);
        } else if (operation === 3) {
            result = upgrade(nodeName, userId);
        }

        alert(result ? "Operation successful" : "Operation failed");
    };

    return (
        <div className={style.TreeContainer}>
            {renderTree(root)}
            <div className={style.inputbox}>
                <form className={style.formContainer} onSubmit={handleSubmit}>
                    <div className={style.label}>
                        <label htmlFor="Op">Enter The operation (1/2/3):</label>
                        <input type="number" id="Op" className={style.inputtag} required />
                    </div>
                    <div className={style.label}>
                        <label htmlFor="Node">Enter Node:</label>
                        <input type="text" id="Node" className={style.inputtag} required />
                    </div>
                    <div className={style.label}>
                        <label htmlFor="UserID">Enter your ID:</label>
                        <input type="number" id="UserId" className={style.inputtag} required />
                    </div>
                    <button type="submit">Trigger</button>
                </form>
            </div>
        </div>
    );
}

class TreeNode {
    constructor(name, parent = null) {
        this.name = name;
        this.isLocked = false;
        this.lockedBy = -1; // -1 indicates not locked
        this.lockedDescendantsCount = 0;
        this.parent = parent;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }
}
