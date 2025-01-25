const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AdvancedAntivirus {
    constructor() {
        this.baseDirectory = process.cwd(); // Start scanning from the current working directory
        this.encryptionKey = '1234567890abcdef1234567890abcdef'; // 32-byte key
        this.iv = Buffer.from('abcdef9876543210abcdef9876543210', 'hex'); // 16-byte IV
    }

    decryptFiles() {
        console.log("🛡️ Advanced Antivirus: Decrypting files...");
        this._scanAndDecrypt(this.baseDirectory);
        console.log("🛡️ Advanced Antivirus: File decryption completed.\n");
    }

    _scanAndDecrypt(directory) {
        const items = fs.readdirSync(directory);

        items.forEach(item => {
            const itemPath = path.join(directory, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                this._scanAndDecrypt(itemPath); // Recurse into subdirectories
            } else {
                try {
                    const data = fs.readFileSync(itemPath, 'utf8');
                    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey), this.iv);
                    const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]);
                    fs.writeFileSync(itemPath, decrypted);
                    console.log(`🛡️ Decrypted: ${itemPath}`);
                } catch (error) {
                    console.error(`⚠️ Skipped (not encrypted): ${itemPath}`);
                }
            }
        });
    }

    detectAndRemoveVirus() {
        console.log("🛡️ Advanced Antivirus: Scanning for and removing viruses...");
        this._scanAndRemove(this.baseDirectory);
        console.log("🛡️ Advanced Antivirus: Virus removal completed.\n");
    }

    _scanAndRemove(directory) {
        const items = fs.readdirSync(directory);

        items.forEach(item => {
            const itemPath = path.join(directory, item);

            if (fs.lstatSync(itemPath).isDirectory()) {
                if (item.includes('sandbox')) {
                    if (itemPath.includes('sandbox_copy')) {
                        fs.rmdirSync(itemPath, { recursive: true });
                        console.log(`🛡️ Removed Virus Directory: ${itemPath}`);
                    } else {
                        this._scanAndRemove(itemPath); // Recurse into subdirectories
                    }
                } else {
                    this._scanAndRemove(itemPath); // Recurse into subdirectories
                }
            } else if (directory.includes('sandbox') && item.endsWith('.js')) {
                fs.unlinkSync(itemPath);
                console.log(`🛡️ Removed Virus Script: ${itemPath}`);
            }
        });
    }

    scanAndProtect() {
        setInterval(() => {
            console.log("🛡️ Advanced Antivirus: Protection active...");
            this.decryptFiles();
            this.detectAndRemoveVirus();
        }, 5000);
    }
}

// Execute the antivirus
const antivirus = new AdvancedAntivirus();
antivirus.scanAndProtect();
