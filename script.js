class ByteBuffer {

    constructor(arrayBuffer) {
        this.view = new DataView(arrayBuffer);
        this.offset = 0;
    }

    readByte() {
        return this.view.getInt8(this.offset++);
    }

    writeByte(byte) {
        this.view.setInt8(this.offset++, byte);
    }

    readBoolean() {
        return this.view.getInt8(this.offset++) === 1;
    }

    writeBoolean(boolean) {
        this.writeByte(boolean ? 1 : 0);
    }

    readShort() {
        let short = this.view.getInt16(this.offset);
        this.offset += 2;

        return short;
    }

    writeShort(short) {
        this.view.setInt16(this.offset, short);
        this.offset += 2;
    }

    readInt() {
        let int = this.view.getInt32(this.offset);
        this.offset += 4;

        return int;
    }

    writeInt(int) {
        this.view.setInt32(this.offset, int);
        this.offset += 4;
    }

    readFloat() {
        let float = this.view.getFloat32(this.offset);
        this.offset += 4;

        return float;
    }

    writeFloat(float) {
        this.view.setFloat32(this.offset, float);
        this.offset += 4;
    }

    // Currently just reading the bytes to an array because the game encodes Strings weird
    readString() {
        let length = this.readShort();
        let string = [];

        for (let i = 0; i < length; i++) {
            string.push(this.readByte());
        }

        return string;
    }

    writeString(string) {
        this.writeShort(string.length);

        for (let i = 0; i < string.length; i++) {
            this.writeByte(string[i]);
        }

        return string;
    }
}

async function mergeFiles(filesElm) {
    let fileList = filesElm.files;
    let fileSize = 0;
    let symbols = {};

    if (fileList.length < 2) {
        error("Select 2 or more files to merge");
        return;
    }

    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new ByteBuffer(arrayBuffer);

        fileSize += file.size;

        if (buffer.readByte() !== 87 || buffer.readByte() !== 77 || buffer.readByte() !== 83 || buffer.readByte() !== 89) {
            error(file.name + " doesn't look like a symbols file!");
            return;
        }

        // What are these?
        let v1 = buffer.readInt();
        let v2 = buffer.readShort();
        let count = buffer.readInt();

        for (let j = 0; j < count; j++) {
            let symbol = {
                type: buffer.readByte()
            };

            if (symbol.type !== 0 && symbol.type !== 1) {
                error("Unknown map symbol type " + symbol.type + " in " + file.name);
                return;
            }

            symbol.x = buffer.readFloat();
            symbol.y = buffer.readFloat();
            symbol.anchorX = buffer.readFloat();
            symbol.anchorY = buffer.readFloat();
            symbol.scale = buffer.readFloat();
            symbol.r = buffer.readByte();
            symbol.g = buffer.readByte();
            symbol.b = buffer.readByte();
            symbol.a = buffer.readByte();
            symbol.collide = buffer.readBoolean();
            symbol.text = buffer.readString();

            if (symbol.type === 0) {
                symbol.translated = buffer.readBoolean();
            }

            symbols[symbol.x + "," + symbol.y] = symbol;
        }
    }

    console.log(symbols);
    let merged = new ByteBuffer(new ArrayBuffer(fileSize));
    let symbs = Object.values(symbols);

    // Static header data
    merged.writeByte(87);
    merged.writeByte(77);
    merged.writeByte(83);
    merged.writeByte(89);
    merged.writeInt(186);
    merged.writeShort(1);

    merged.writeInt(symbs.length);

    symbs.forEach(symbol => {
        merged.writeByte(symbol.type);
        merged.writeFloat(symbol.x);
        merged.writeFloat(symbol.y);
        merged.writeFloat(symbol.anchorX);
        merged.writeFloat(symbol.anchorY);
        merged.writeFloat(symbol.scale);
        merged.writeByte(symbol.r);
        merged.writeByte(symbol.g);
        merged.writeByte(symbol.b);
        merged.writeByte(symbol.a);
        merged.writeBoolean(symbol.collide);
        merged.writeString(symbol.text);

        if (symbol.type === 0) {
            merged.writeBoolean(symbol.translated);
        }
    });

    const url = window.URL.createObjectURL(new Blob([merged.view.buffer], {type: "application/octet-stream"}));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'map_symbols.bin');
    document.body.appendChild(link);
    link.click();
}

function error(msg) {
    document.getElementById("error").innerHTML = msg;
}